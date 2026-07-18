import { FolderOpen, Layers, Eye, FileEdit } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Project', value: '0', icon: FolderOpen, color: 'bg-blue-50 text-blue-600' },
    { label: 'Published', value: '0', icon: Eye, color: 'bg-green-50 text-green-600' },
    { label: 'Drafts', value: '0', icon: FileEdit, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Kategori', value: '0', icon: Layers, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Ringkasan statistik website portofolio Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Projects Placeholder */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200">
          <h2 className="text-lg font-semibold text-zinc-900">Project Terbaru</h2>
        </div>
        <div className="p-12 text-center text-zinc-500">
          Belum ada data project.
        </div>
      </div>
    </div>
  );
}
