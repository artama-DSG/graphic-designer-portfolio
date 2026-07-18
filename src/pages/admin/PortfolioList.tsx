import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function PortfolioList() {
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
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
            />
          </div>
          
          <select className="w-full sm:w-auto px-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white">
            <option value="">Semua Kategori</option>
            <option value="logo">Logo</option>
            <option value="branding">Identitas Brand</option>
            <option value="print">Desain Cetak</option>
          </select>
        </div>

        {/* Empty State */}
        <div className="p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">Belum Ada Project</h3>
          <p className="text-zinc-500 max-w-sm mb-6">
            Anda belum menambahkan project portofolio satupun. Mulai dengan membuat project pertama Anda.
          </p>
          <Link 
            to="/dashboard-portfolio/portfolio/new" 
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Tambah Project
          </Link>
        </div>
      </div>
    </div>
  );
}
