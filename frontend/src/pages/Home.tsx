import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from '../components/Map';
import { useParks } from '../hooks/useParks';
import { Trees, Users, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { parks, loading } = useParks();
  const [view, setView] = useState<'gallery' | 'map'>('gallery');
  const navigate = useNavigate();

  // Hardcoded stunning images for the demo
  const parkImages = [
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop', // Forest / Fireflies aesthetic
    'https://images.unsplash.com/photo-1444124818704-4d89a495bbae?q=80&w=800&auto=format&fit=crop', // Camping
    'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop', // Cabin
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="animate-pulse text-2xl font-light">Despertando a las luciérnagas...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Santuario de las luciérnagas" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-5xl"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] flex justify-center pointer-events-none opacity-20">
            <h1 className="text-[20vw] leading-none font-serif text-yellow-500 italic tracking-tighter blur-md">
              2026
            </h1>
          </div>
          <h1 className="text-[10vw] md:text-[6vw] leading-[0.85] font-serif mb-8 text-white tracking-tighter drop-shadow-2xl relative z-10">
            FESTIVAL DE LAS <span className="italic text-yellow-500 font-light block mt-2 md:mt-4">LUCIÉRNAGAS</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light mb-12 max-w-2xl mx-auto tracking-widest uppercase leading-relaxed relative z-10">
            Una inmersión mágica en los santuarios luminosos de México. 
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => { setView('gallery'); document.getElementById('parks')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group relative overflow-hidden rounded-full bg-yellow-500 text-slate-950 px-10 py-4 font-semibold transition-all hover:shadow-[0_0_40px_rgba(234,179,8,0.4)]"
            >
              <span className="relative z-10 tracking-widest uppercase text-sm">Explorar Santuarios</span>
              <div className="absolute inset-0 h-full w-0 bg-yellow-400 transition-all duration-500 ease-out group-hover:w-full"></div>
            </button>
            <button 
              onClick={() => { setView('map'); document.getElementById('parks')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group relative overflow-hidden rounded-full border border-slate-500 text-white px-10 py-4 font-semibold transition-all hover:border-yellow-500"
            >
              <div className="relative z-10 flex items-center gap-3 tracking-widest uppercase text-sm">
                <MapPin size={18} className="text-yellow-500 group-hover:scale-110 transition-transform" /> Ver Mapa
              </div>
              <div className="absolute inset-0 h-full w-0 bg-slate-900/50 transition-all duration-500 ease-out group-hover:w-full"></div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Parks Section */}
      <section id="parks" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-yellow-100 mb-2">Nuestros Santuarios</h2>
            <p className="text-slate-400 text-lg">Elige el destino perfecto para tu aventura mágica.</p>
          </div>
          <div className="hidden md:flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setView('gallery')}
              className={`px-4 py-2 rounded-md transition-colors ${view === 'gallery' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Galería
            </button>
            <button 
              onClick={() => setView('map')}
              className={`px-4 py-2 rounded-md transition-colors ${view === 'map' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Mapa Interactivo
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'gallery' ? (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {parks.map((park, index) => (
                <div key={park.id} className="group relative bg-transparent overflow-hidden rounded-none border-b border-white/10 hover:border-yellow-500/50 pb-8 transition-colors flex flex-col justify-between">
                  <div className="relative h-80 w-full overflow-hidden rounded-2xl mb-8">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-700"></div>
                    <img 
                      src={parkImages[index % parkImages.length]} 
                      alt={park.nombre}
                      className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute top-6 right-6 z-20 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase text-yellow-500 border border-white/5">
                      {park.hasCabins ? 'Cabañas / Camping' : 'Camping'}
                    </div>
                  </div>
                  
                  <div className="px-2">
                    <h3 className="text-4xl font-serif mb-4 text-white leading-tight">{park.nombre}</h3>
                    <p className="text-slate-400 mb-8 font-light text-sm tracking-widest uppercase">{park.direccion}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-10">
                      <div className="flex items-center gap-2 text-slate-300 border border-white/10 px-3 py-1.5 rounded-full">
                        <Users size={14} className="text-yellow-500" />
                        <span className="text-[10px] tracking-widest uppercase">Familias</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 border border-white/10 px-3 py-1.5 rounded-full">
                        <Trees size={14} className="text-yellow-500" />
                        <span className="text-[10px] tracking-widest uppercase">Bosque</span>
                      </div>
                    </div>

                    <p className="text-sm font-light text-slate-500 mb-10 leading-loose border-l border-yellow-500/30 pl-4">
                      {park.servicios} <br/>
                      <span className="text-yellow-500/70">{park.horario}</span>
                    </p>

                    <button
                      onClick={() => navigate(`/book/${park.id}`)}
                      className="group relative w-full overflow-hidden rounded-full bg-white/5 py-4 transition-all hover:bg-yellow-500"
                    >
                      <span className="relative z-10 text-xs tracking-widest uppercase text-white group-hover:text-slate-950 font-bold">Reservar Experiencia</span>
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
            >
              <InteractiveMap parks={parks} onReserve={(p) => navigate(`/book/${p.id}`)} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    </div>
  );
}
