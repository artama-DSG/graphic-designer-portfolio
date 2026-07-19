import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Plus, Trash2, Link as LinkIcon, X, Loader2 } from 'lucide-react';

export default function ClientList() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [clientName, setClientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      if (!db) return;
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) {
      setErrorMsg("Firebase belum dikonfigurasi.");
      return;
    }
    
    if (!logoUrl) {
      setErrorMsg("URL Logo klien wajib diisi");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      // Save to Firestore
      await addDoc(collection(db, 'clients'), {
        name: clientName,
        logo: logoUrl,
        createdAt: serverTimestamp(),
      });

      // Reset form and refetch
      setIsAdding(false);
      setLogoUrl('');
      setClientName('');
      fetchClients();
    } catch (error: any) {
      console.error("Error saving client:", error);
      setErrorMsg(error.message || 'Gagal menyimpan klien');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus logo klien ini?')) {
      try {
        await deleteDoc(doc(db, 'clients', id));
        fetchClients();
      } catch (error) {
        console.error("Error deleting client:", error);
        alert('Gagal menghapus klien');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900">Klien</h1>
          <p className="text-zinc-500 mt-1 font-medium">Kelola logo klien yang tampil di beranda.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Tambah Klien
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm max-w-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-zinc-900">Tambah Klien Baru</h2>
            <button onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-zinc-600">
              <X size={20} />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium border border-red-100">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">Nama Klien (Opsional)</label>
              <input 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                type="text" 
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                placeholder="Misal: PT Teknologi Maju"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">URL Logo Klien (Cloudinary) <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={18} className="text-zinc-400" />
                </div>
                <input 
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  type="url" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">Paste URL gambar logo yang sudah diupload ke Cloudinary.</p>
            </div>

            {logoUrl && (
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center">
                <img src={logoUrl} alt="Preview" className="max-h-20 w-auto object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 rounded-lg font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="p-16 flex justify-center text-zinc-500">Memuat data...</div>
      ) : clients.length === 0 && !isAdding ? (
        <div className="p-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-zinc-200">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
            <LinkIcon size={32} />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Belum Ada Logo Klien</h3>
          <p className="text-zinc-500 max-w-sm mb-6">
            Tambahkan URL logo klien atau partner yang pernah bekerja sama dengan Anda.
          </p>
          <button 
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Tambah Klien
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col items-center justify-center relative group">
              <img src={client.logo} alt={client.name || 'Client Logo'} className="max-h-16 w-auto object-contain mb-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
              {client.name && <span className="text-xs font-medium text-zinc-500 text-center">{client.name}</span>}
              
              <button
                onClick={() => handleDelete(client.id)}
                className="absolute top-2 right-2 bg-white shadow-sm border border-zinc-200 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
                title="Hapus Logo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
