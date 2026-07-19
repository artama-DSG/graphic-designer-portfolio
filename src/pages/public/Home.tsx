import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MessageCircle, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { cn } from '../../utils/cn';
import { TEMPLATE_PORTFOLIOS } from '../../data/templates';

const CATEGORIES = ['Semua', 'Logo', 'Identitas Brand', 'Media Promosi', 'Desain Cetak', 'Media Outdoor'];

const CLIENT_LOGOS = [
  'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=200&h=100&fit=crop',
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<any>({
    heroTitle: 'Desain Grafis Profesional untuk Branding & Media Cetak',
    heroDescription: 'Saya membantu bisnis, UMKM, dan berbagai instansi menciptakan logo, media promosi, serta desain cetak berkualitas yang menarik, fungsional, dan siap diproduksi.',
    ctaTitle: 'Siap Mewujudkan Desain Anda?',
    ctaDescription: 'Diskusikan kebutuhan desain Anda sekarang juga. Mari ciptakan sesuatu yang luar biasa bersama.',
    whatsappNumber: '6289630144066'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!db) return;
        
        // Fetch Settings
        const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
        if (settingsDoc.exists()) {
          setSettings((prev: any) => ({ ...prev, ...settingsDoc.data() }));
        }

        // Fetch Portfolios
        const q = query(
          collection(db, 'portfolios'), 
          where('status', '==', 'published')
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort manually by createdAt since we can't use orderBy together with where without index
        data.sort((a: any, b: any) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.seconds - a.createdAt.seconds;
        });

        setPortfolios(data);

        // Fetch Clients
        const clientsQuery = query(collection(db, 'clients'));
        const clientsSnapshot = await getDocs(clientsQuery);
        const clientsData = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(clientsData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const activePortfolios = portfolios.length > 0 ? portfolios : TEMPLATE_PORTFOLIOS;
  const filteredPortfolio = activeCategory === 'Semua' 
    ? activePortfolios 
    : activePortfolios.filter(item => item.categoryId === activeCategory);

  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900 selection:bg-purple-200 selection:text-purple-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter font-display">Artama DSG.</Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
            <a href="#portfolio" className="text-zinc-600 hover:text-purple-600 transition-colors">Portfolio</a>
            <a href="#clients" className="text-zinc-600 hover:text-purple-600 transition-colors">Client</a>
            <a href="#contact" className="px-6 py-2.5 bg-zinc-950 text-white rounded-full hover:bg-purple-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20">
              Hubungi Saya
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-100 rounded-full blur-[100px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-100 rounded-full blur-[100px] -z-10 opacity-40"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[1.1] mb-6">
            {settings.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 leading-relaxed max-w-3xl mb-10 whitespace-pre-wrap">
            {settings.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#portfolio" 
              className="px-8 py-4 bg-zinc-900 text-white rounded-full font-medium text-lg hover:bg-purple-600 hover:shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
            >
              Lihat Portofolio
              <ArrowRight size={20} />
            </a>
            <a 
              href={`https://wa.me/${settings.whatsappNumber}`} 
              target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 bg-white border-2 border-zinc-200 text-zinc-900 rounded-full font-medium text-lg hover:border-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Hubungi Saya
            </a>
          </div>
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 px-6 bg-white border-y border-zinc-100 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 font-display uppercase">
                Karya Pilihan <span className="text-yellow-400">.</span>
              </h2>
              <p className="text-lg text-zinc-500 max-w-xl font-medium">
                Jelajahi beberapa project desain grafis terbaik yang pernah saya kerjakan untuk berbagai klien.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all border",
                    activeCategory === cat 
                      ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-purple-400 hover:text-purple-600"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-zinc-500 font-medium">Memuat portfolio...</div>
          ) : filteredPortfolio.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 font-medium">Belum ada karya portfolio.</div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence>
                {filteredPortfolio.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={item.id}
                  >
                    <Link to={`/portfolio/${item.slug}`} className="group block h-full">
                      <div className="rounded-2xl sm:rounded-3xl overflow-hidden aspect-square sm:aspect-[4/5] bg-zinc-100 relative border border-zinc-200 group-hover:border-purple-400 transition-colors duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-purple-500/10 h-full">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-200">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold tracking-wider text-yellow-300 uppercase mb-2 sm:mb-3 border border-white/20">
                            {item.categoryId}
                          </span>
                          <h3 className="text-base sm:text-xl lg:text-2xl font-black tracking-tighter text-white font-display group-hover:text-yellow-400 transition-colors leading-tight sm:leading-none">{item.title}</h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Client Logos */}
      <section id="clients" className="py-24 px-6 bg-zinc-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Dipercaya oleh Berbagai Klien</p>
        </div>
        
        <div className="flex w-[200%] whitespace-nowrap animate-[marquee_20s_linear_infinite]">
          {[...Array(3)].map((_, arrayIndex) => (
            <div key={arrayIndex} className="flex items-center justify-around w-full gap-16 px-8">
              {(clients.length > 0 ? clients : CLIENT_LOGOS).map((logo, index) => (
                <div key={index} className="w-40 h-20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer flex items-center justify-center">
                  <img src={typeof logo === 'string' ? logo : logo.logo} alt="Client Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 sm:py-32 px-6 bg-zinc-950 text-white text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-purple-600/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 sm:mb-8 font-display uppercase leading-[1] whitespace-pre-wrap">
            {settings.ctaTitle}
          </h2>
          <p className="text-lg sm:text-xl text-zinc-400 mb-10 sm:mb-12 max-w-2xl mx-auto font-medium whitespace-pre-wrap">
            {settings.ctaDescription}
          </p>
          <a 
            href={`https://wa.me/${settings.whatsappNumber}`} 
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-yellow-400 text-zinc-950 rounded-full font-black uppercase tracking-widest text-sm sm:text-base hover:scale-105 hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(250,204,21,0.2)]"
          >
            <MessageCircle size={22} className="text-zinc-950" />
            Hubungi via WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-10 px-6 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <div className="text-2xl font-black tracking-tighter font-display">Artama DSG.</div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold uppercase tracking-widest text-zinc-600">
            <a href="#portfolio" className="hover:text-purple-600 transition-colors">Portfolio</a>
            <a href="#about" className="hover:text-purple-600 transition-colors">Tentang</a>
            <a href="#contact" className="hover:text-purple-600 transition-colors">Kontak</a>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-zinc-100 text-center text-xs sm:text-sm font-medium text-zinc-400">
          &copy; {new Date().getFullYear()} Artama DSG. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

