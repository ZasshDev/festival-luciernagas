import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#030712] pt-24 pb-12 overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <h2 className="text-4xl font-serif text-white mb-6">LuciMap <span className="italic text-yellow-500 font-light">2026</span></h2>
            <p className="text-slate-400 font-light leading-relaxed max-w-sm">
              Una experiencia inmersiva en los santuarios luminosos de México. 
              Conecta con la naturaleza en su máxima expresión.
            </p>
          </div>
          
          <div className="md:col-span-2 md:col-start-8 space-y-6">
            <h3 className="text-sm tracking-widest text-white uppercase font-semibold">Santuarios</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Explorar</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Mapa Mágico</Link></li>
              <li><Link to="/" className="text-slate-400 hover:text-yellow-500 transition-colors text-sm">Cabañas</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h3 className="text-sm tracking-widest text-white uppercase font-semibold">Legal</h3>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">Privacidad</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Términos</Link></li>
              <li><Link to="/rules" className="text-slate-400 hover:text-white transition-colors text-sm">Reglamento</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
          <p className="text-slate-600 text-sm mb-4 md:mb-0">
            © 2026 LuciMap Festival. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
