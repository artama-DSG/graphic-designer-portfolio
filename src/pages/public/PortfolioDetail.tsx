import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';

const PORTFOLIO_DATA = [
  { 
    id: '1', 
    title: 'Rebranding Kopi Kenangan', 
    category: 'Identitas Brand', 
    client: 'PT Kopi Kenangan Nusantara',
    slug: 'kopi-kenangan', 
    coverImage: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626292376665-27a3a60a7e1e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Proyek rebranding komprehensif untuk Kopi Kenangan. Fokus pada penyegaran visual identitas tanpa menghilangkan essence brand yang sudah dikenal luas oleh masyarakat.'
  },
  // Add fallback for others if needed, using the first one as template
];

export default function PortfolioDetail() {
  const { slug } = useParams();
  
  // In a real app, you'd fetch this from Firebase
  const project = PORTFOLIO_DATA.find(p => p.slug === slug) || PORTFOLIO_DATA[0];

  return (
    <div className="bg-white min-h-screen text-zinc-900 pb-24">
      {/* Navbar Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-6 max-w-5xl mx-auto">
        <header className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 font-semibold text-sm rounded-full mb-6">
            {project.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            {project.title}
          </h1>
          <div className="flex items-center gap-4 text-zinc-500 font-medium">
            <span>Klien: {project.client}</span>
          </div>
        </header>

        <div className="rounded-[2.5rem] overflow-hidden bg-zinc-100 mb-16 aspect-[16/9] md:aspect-[21/9]">
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Tentang Project</h2>
            <p className="text-lg text-zinc-600 leading-relaxed">
              {project.description}
            </p>
          </div>
          <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 h-fit">
            <h3 className="font-bold text-zinc-900 mb-4">Tertarik dengan desain seperti ini?</h3>
            <p className="text-zinc-600 mb-6 text-sm">Diskusikan kebutuhan desain Anda bersama saya melalui WhatsApp.</p>
            <a 
              href="https://wa.me/6289630144066" 
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#25D366] text-white rounded-full font-bold hover:bg-[#1fae54] transition-colors"
            >
              <MessageCircle size={18} />
              Hubungi Sekarang
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-8">Galeri Project</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.gallery.map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-zinc-100 aspect-square">
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
