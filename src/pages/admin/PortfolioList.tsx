import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export default function PortfolioList() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchPortfolios = async () => {
    setIsLoading(true);
    try {
      if (!db) return;
      const q = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPortfolios(data);
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus project ini?')) {
      try {
        await deleteDoc(doc(db, 'portfolios', id));
        fetchPortfolios(); // Refresh list
      } catch (error) {
        console.error("Error deleting portfolio:", error);
        alert('Gagal menghapus project');
      }
    }
  };

  const filteredPortfolios = portfolios.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory ? p.categoryId === filterCategory : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Portfolio</h1>
          <p className="text-zinc-500 mt-1">Kelola semua project desain Anda.</p>
        </div>
        <Link 
          to="/dashboard-portfolio/portfolio/new" 
          className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Tambah Project
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
          
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
          >
            <option value="">Semua Kategori</option>
            <option value="Logo">Logo</option>
            <option value="Identitas Brand">Identitas Brand</option>
            <option value="Desain Cetak">Desain Cetak</option>
            <option value="Media Outdoor">Media Outdoor</option>
            <option value="Media Promosi">Media Promosi</option>
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="p-16 flex justify-center text-zinc-500">Memuat data...</div>
        ) : filteredPortfolios.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Belum Ada Project</h3>
            <p className="text-zinc-500 max-w-sm mb-6">
              Anda belum menambahkan project portofolio satupun atau tidak ada hasil pencarian.
            </p>
            <Link 
              to="/dashboard-portfolio/portfolio/new" 
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
            >
              <Plus size={18} />
              Tambah Project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-500">
              <thead className="bg-zinc-50/50 text-xs text-zinc-700 uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold border-b border-zinc-200">Project</th>
                  <th className="px-6 py-4 font-semibold border-b border-zinc-200">Kategori</th>
                  <th className="px-6 py-4 font-semibold border-b border-zinc-200">Status</th>
                  <th className="px-6 py-4 font-semibold border-b border-zinc-200 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredPortfolios.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {project.image ? (
                          <img src={project.image} alt={project.title} className="w-12 h-12 rounded-lg object-cover bg-zinc-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-zinc-900">{project.title}</div>
                          <div className="text-xs text-zinc-400 mt-0.5">{project.client || 'Internal Project'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700">
                        {project.categoryId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        project.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 
                        <Link 
                          to={`/dashboard-portfolio/portfolio/edit/${project.id}`}
                          className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </Link>
                        */}
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
