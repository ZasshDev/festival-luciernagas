export default function Terms() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-serif text-yellow-500 mb-8">Términos y Condiciones</h1>
        
        <section className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">1. Reservaciones</h2>
          <p>
            Todas las reservaciones están sujetas a disponibilidad. El código QR generado es personal e intransferible. Una vez confirmada la reservación, no se permitirán cambios de fecha a menos que se notifique con 72 horas de anticipación.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">2. Políticas de Cancelación</h2>
          <p>
            No existen reembolsos por cancelaciones. Si el clima impide el avistamiento de luciérnagas, el boleto podrá ser reagendado para otra fecha de la temporada o la temporada siguiente, según determine la administración.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">3. Acceso a los Santuarios</h2>
          <p>
            Nos reservamos el derecho de admisión. Cualquier persona en estado de ebriedad o que incumpla el reglamento interno será retirada de las instalaciones sin derecho a reembolso.
          </p>
        </section>

        <div className="pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500">Última actualización: Mayo 2026</p>
        </div>
      </div>
    </div>
  );
}
