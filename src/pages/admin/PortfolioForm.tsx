import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase';

export default function PortfolioForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: any) => {
    if (!db || !storage) {
      setErrorMsg("Firebase belum dikonfigurasi.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      let imageUrl = '';
      
      // Upload image to Firebase Storage if exists
      if (imageFile) {
        const imageRef = ref(storage, `portfolio/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } else {
        setErrorMsg('Thumbnail project wajib diupload');
        setIsSubmitting(false);
        return;
      }

      // Generate slug from title
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // Save to Firestore
      await addDoc(collection(db, 'portfolios'), {
        title: data.title,
        description: data.description,
        status: data.status,
        categoryId: data.categoryId,
        client: data.client,
        isFeatured: data.isFeatured,
        slug: slug,
        image: imageUrl,
        createdAt: serverTimestamp(),
      });

      navigate('/dashboard-portfolio/portfolio');
    } catch (error: any) {
      console.error("Error saving project:", error);
      setErrorMsg(error.message || 'Gagal menyimpan project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard-portfolio/portfolio')}
          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Tambah Project</h1>
          <p className="text-zinc-500 mt-1">Buat project portofolio baru.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Nama Project <span className="text-red-500">*</span></label>
                <input 
                  {...register('title', { required: true })}
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                  placeholder="Misal: Redesign Logo Bank Jago"
                />
                {errors.title && <span className="text-red-500 text-xs mt-1">Nama project wajib diisi</span>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Deskripsi</label>
                <textarea 
                  {...register('description')}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-y"
                  placeholder="Ceritakan tentang project ini..."
                ></textarea>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
              <h3 className="text-lg font-semibold text-zinc-900">Thumbnail & Gallery</h3>
              
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Thumbnail Project <span className="text-red-500">*</span></label>
                
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-zinc-200 group">
                    <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover max-h-[400px]" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-zinc-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-50 transition-colors block">
                    <div className="w-12 h-12 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center mb-3">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-medium text-zinc-900">Klik untuk upload gambar</p>
                    <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Status</label>
                <select 
                  {...register('status')}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Kategori <span className="text-red-500">*</span></label>
                <select 
                  {...register('categoryId', { required: true })}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Logo">Logo</option>
                  <option value="Identitas Brand">Identitas Brand</option>
                  <option value="Desain Cetak">Desain Cetak</option>
                  <option value="Media Outdoor">Media Outdoor</option>
                  <option value="Media Promosi">Media Promosi</option>
                </select>
                {errors.categoryId && <span className="text-red-500 text-xs mt-1">Kategori wajib dipilih</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Client</label>
                <input 
                  {...register('client')}
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                  placeholder="Nama perusahaan client"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    {...register('isFeatured')}
                    className="w-5 h-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                  />
                  <span className="text-sm font-semibold text-zinc-900">Jadikan Featured Project</span>
                </label>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Simpan Project
                  </>
                )}
              </button>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}
