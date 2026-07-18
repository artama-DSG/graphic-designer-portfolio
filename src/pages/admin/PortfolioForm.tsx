import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function PortfolioForm() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  
  const onSubmit = (data: any) => {
    console.log(data);
    // TODO: implement save to firestore
    navigate('/dashboard-portfolio/portfolio');
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Nama Project</label>
                <input 
                  {...register('title')}
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                  placeholder="Misal: Redesign Logo Bank Jago"
                />
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
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Thumbnail Project</label>
                <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-50 transition-colors">
                  <div className="w-12 h-12 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-medium text-zinc-900">Klik atau drag gambar ke sini</p>
                  <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
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
                <label className="block text-sm font-semibold text-zinc-900 mb-2">Kategori</label>
                <select 
                  {...register('categoryId')}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                >
                  <option value="">Pilih Kategori</option>
                  <option value="logo">Logo</option>
                  <option value="branding">Identitas Brand</option>
                  <option value="print">Desain Cetak</option>
                  <option value="outdoor">Media Outdoor</option>
                </select>
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
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
              >
                <Save size={18} />
                Simpan Project
              </button>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}
