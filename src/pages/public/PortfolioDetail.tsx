import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { TEMPLATE_PORTFOLIOS } from '../../data/templates';

export default function PortfolioDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>({
    whatsappNumber: '6289630144066'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!db) return;
        
        // Fetch Settings for WhatsApp Number
        const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
        if (settingsDoc.exists()) {
          setSettings((prev: any) => ({ ...prev, ...settingsDoc.data() }));
        }

        // Fetch Portfolio by slug
        const q = query(collection(db, 'portfolios'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          const template = TEMPLATE_PORTFOLIOS.find(p => p.slug === slug);
          if (template) {
            setProject(template);
          }
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen text-zinc-900 flex items-center justify-center">
        <p className="text-zinc-500 font-medium">Memuat...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-white min-h-screen text-zinc-900 flex flex-col items-center justify-center gap-4">
        <p className="text-zinc-500 font-medium text-lg">Project tidak ditemukan.</p>
        <Link to="/" className="text-purple-600 font-medium hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-zinc-900 pb-24">
      {/* Navbar Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
          <a 
            href={`https://wa.me/${settings.whatsappNumber}`} 
            target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-full font-bold text-sm hover:bg-[#1fae54] transition-colors"
          >
            <MessageCircle size={16} />
            Pesan Desain
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-6 max-w-4xl mx-auto">
        <div className="rounded-3xl overflow-hidden bg-zinc-100 mb-10 border border-zinc-200">
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-auto max-h-[80vh] object-contain bg-zinc-900" />
          ) : (
            <div className="w-full aspect-[16/9] flex items-center justify-center text-zinc-400">Tidak ada gambar</div>
          )}
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="inline-block px-4 py-1.5 bg-zinc-100 text-zinc-600 font-bold text-xs uppercase tracking-wider rounded-full">
            {project.categoryId}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">
              {project.description}
            </p>
          )}
          
          <div className="pt-8">
             <a 
              href={`https://wa.me/${settings.whatsappNumber}`} 
              target="_blank" rel="noopener noreferrer"
              className="inline-flex sm:hidden items-center justify-center gap-2 w-full px-6 py-4 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-[#1fae54] transition-colors"
            >
              <MessageCircle size={20} />
              Diskusikan Project Ini
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
