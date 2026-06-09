export default function Privacy() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-300 py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-serif text-yellow-500 mb-8">Aviso de Privacidad</h1>
        
        <section className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">1. Recopilación de Datos</h2>
          <p>
            En LuciMap recolectamos únicamente la información necesaria para gestionar tu reservación. Esto incluye tu nombre, correo electrónico y las preferencias de tu estancia. No almacenamos información bancaria en nuestros servidores.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">2. Uso de la Información</h2>
          <p>
            Tu información será utilizada exclusivamente para enviarte los códigos QR de acceso, notificaciones sobre tu reservación, y comunicados urgentes respecto a los santuarios (ej. cierres por mal clima).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl text-white font-semibold">3. Protección de Datos</h2>
          <p>
            Tus datos están protegidos mediante cifrado de grado industrial. No compartimos ni vendemos tus datos personales a terceros bajo ninguna circunstancia.
          </p>
        </section>

        <div className="pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-500">Última actualización: Mayo 2026</p>
        </div>
      </div>
    </div>
  );
}
