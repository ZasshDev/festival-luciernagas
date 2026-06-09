import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Reservation } from '../types';
import { QRCodeCanvas } from 'qrcode.react';

export default function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const { data } = await api.get('/reservations/me');
      setReservations(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (error) {
      console.error(error);
      alert('Error al cancelar la reserva');
    }
  };

  if (loading) return <div className="p-8">Cargando reservas...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-yellow-100">Mis Reservas Mágicas</h2>

        {reservations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl shadow-lg text-center flex flex-col items-center">
            <span className="text-5xl mb-4">✨</span>
            <p className="text-slate-300 text-lg mb-6">Aún no tienes reservaciones mágicas.</p>
            <a href="/" className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-8 py-3 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              Descubrir Santuarios
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div key={res.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">{res.park?.nombre}</h3>
                  <p className="text-slate-400 mt-1">
                    {new Date(res.fechaInicio).toLocaleDateString()} - {new Date(res.fechaFin).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex gap-3 text-sm">
                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                      {res.numPersonas} personas
                    </span>
                    <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                      {res.tipo === 'CABIN' ? 'Cabaña' : 'Camping'}
                    </span>
                    <span className={`px-3 py-1 rounded-full border ${res.status === 'ACTIVE' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-red-900/30 text-red-400 border-red-800'}`}>
                      {res.status}
                    </span>
                  </div>
                </div>

                {res.status === 'ACTIVE' && (
                  <div className="flex flex-col items-end gap-4">
                    <div className="flex flex-col items-center p-3 bg-white rounded-xl">
                      <QRCodeCanvas
                        value={`Reserva:${res.codigo || res.id}|Parque:${res.park?.nombre}|Inicio:${res.fechaInicio}`}
                        size={100}
                        level="H"
                      />
                      <span className="text-xs text-slate-500 mt-2 font-medium">Escanea al llegar</span>
                    </div>
                    <button
                      onClick={() => handleCancel(res.id)}
                      className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm font-medium"
                    >
                      Cancelar Reserva
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
