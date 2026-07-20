import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Save, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!db) return;
        const docRef = doc(db, 'settings', 'homepage');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          reset(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      if (!db) throw new Error("Firebase belum dikonfigurasi.");
      
      await setDoc(doc(db, 'settings', 'homepage'), {
        heroTitle: data.heroTitle,
        heroDescription: data.heroDescription,
        portfolioTitle: data.portfolioTitle,
        portfolioDescription: data.portfolioDescription,
        ctaTitle: data.ctaTitle,
        ctaDescription: data.ctaDescription,
        ctaButtonText: data.ctaButtonText,
        whatsappNumber: data.whatsappNumber,
        footerText: data.footerText
      }, { merge: true });
      
      setMessage({ text: 'Pengaturan berhasil disimpan!', type: 'success' });
    } catch (error: any) {
      console.error("Error saving settings:", error);
      setMessage({ text: error.message || 'Gagal menyimpan pengaturan.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-16 flex justify-center text-zinc-500">Memuat data...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Pengaturan Website</h1>
        <p className="text-zinc-500 font-medium">Ubah redaksi teks pada halaman utama.</p>
      </div>
      
      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium border ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Hero Section</h2>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Judul Hero</label>
            <textarea 
              {...register('heroTitle')}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="Desain Grafis Profesional untuk Branding & Media Cetak"
              rows={2}
            />
            <p className="text-xs text-zinc-500 mt-1">Gunakan teks singkat dan menarik.</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Deskripsi Hero</label>
            <textarea 
              {...register('heroDescription')}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="Saya membantu bisnis, UMKM..."
              rows={3}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Portfolio Section</h2>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Judul Portfolio</label>
            <textarea 
              {...register('portfolioTitle')}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="KARYA PILIHAN ."
              rows={1}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Deskripsi Portfolio</label>
            <textarea 
              {...register('portfolioDescription')}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="Jelajahi beberapa project desain grafis terbaik..."
              rows={2}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Call to Action (CTA) Section</h2>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Judul CTA</label>
            <textarea 
              {...register('ctaTitle')}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="Siap Mewujudkan Desain Anda?"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Deskripsi CTA</label>
            <textarea 
              {...register('ctaDescription')}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="Diskusikan kebutuhan desain Anda sekarang juga..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Teks Tombol CTA</label>
            <input 
              {...register('ctaButtonText')}
              type="text"
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="Hubungi via WhatsApp"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Footer</h2>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Teks Footer</label>
            <textarea 
              {...register('footerText')}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="© 2026 Artama DSG. All rights reserved."
              rows={2}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 mb-4">Kontak</h2>
          
          <div>
            <label className="block text-sm font-semibold text-zinc-900 mb-2">Nomor WhatsApp</label>
            <input 
              {...register('whatsappNumber')}
              type="text"
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              placeholder="6289630144066"
            />
            <p className="text-xs text-zinc-500 mt-1">Mulai dengan kode negara tanpa +, contoh: 6289630144066</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} />
                Simpan Pengaturan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
