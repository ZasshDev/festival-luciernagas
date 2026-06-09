export default function Rules() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-serif text-yellow-500 mb-8">Reglamento del Santuario</h1>
        
        <div className="bg-red-950/30 border border-red-900 p-6 rounded-xl mb-8">
          <p className="text-red-400 text-sm font-semibold">El incumplimiento de este reglamento resulta en la expulsión inmediata del parque.</p>
        </div>

        <ul className="space-y-6 list-none p-0">
          <li className="flex gap-4">
            <span className="text-yellow-500 font-bold text-xl">1.</span>
            <div>
              <h3 className="text-white font-semibold mb-1">Silencio Absoluto</h3>
              <p>El ruido altera el ciclo de apareamiento de las luciérnagas. Se debe mantener el silencio en todo momento durante el recorrido.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <span className="text-yellow-500 font-bold text-xl">2.</span>
            <div>
              <h3 className="text-white font-semibold mb-1">Cero Luz Artificial</h3>
              <p>Está estrictamente prohibido el uso de linternas, celulares, flashes de cámara o cualquier otra fuente de luz artificial.</p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <span className="text-yellow-500 font-bold text-xl">3.</span>
            <div>
              <h3 className="text-white font-semibold mb-1">No Salir del Sendero</h3>
              <p>Los visitantes deben caminar exclusivamente por los senderos marcados para evitar pisar las larvas y huevos de las luciérnagas que habitan en el suelo.</p>
            </div>
          </li>

          <li className="flex gap-4">
            <span className="text-yellow-500 font-bold text-xl">4.</span>
            <div>
              <h3 className="text-white font-semibold mb-1">Cero Repelentes</h3>
              <p>No se permite el uso de repelentes contra insectos, perfumes o aerosoles, ya que estos químicos son mortales para las luciérnagas.</p>
            </div>
          </li>
        </ul>

        <div className="pt-8 border-t border-slate-800 mt-12">
          <p className="text-sm text-slate-500">Última actualización: Mayo 2026</p>
        </div>
      </div>
    </div>
  );
}
