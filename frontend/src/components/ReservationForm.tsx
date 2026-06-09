import { useState } from 'react';
import { Park } from '../types';
import { api } from '../services/api';

interface ReservationFormProps {
  park: Park;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReservationForm({ park, onClose, onSuccess }: ReservationFormProps) {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [numPersonas, setNumPersonas] = useState(1);
  const [tipo, setTipo] = useState<'CABIN' | 'CAMPING'>('CAMPING');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic date validation
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    
    // Normalize dates to check for tuesday or out of season (June=5, Aug=7)
    if (start.getUTCMonth() < 5 || start.getUTCMonth() > 7 || end.getUTCMonth() < 5 || end.getUTCMonth() > 7) {
      setError('Las reservas solo son válidas entre junio y agosto.');
      return;
    }

    let current = new Date(start);
    while (current <= end) {
      if (current.getUTCDay() === 2) {
        setError('No se pueden hacer reservas que incluyan días martes (mantenimiento).');
        return;
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }

    setLoading(true);
    try {
      await api.post('/reservations', {
        parkId: park.id,
        fechaInicio: new Date(fechaInicio).toISOString(),
        fechaFin: new Date(fechaFin).toISOString(),
        numPersonas,
        tipo,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-8 shadow-2xl text-slate-100">
        <h2 className="mb-6 text-2xl font-bold text-yellow-100">Reservar en {park.nombre}</h2>
        {error && <div className="mb-6 rounded-lg bg-red-900/30 border border-red-800 p-3 text-red-400 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Fecha de Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Fecha de Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Número de Personas</label>
            <input
              type="number"
              min="1"
              value={numPersonas}
              onChange={(e) => setNumPersonas(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de Alojamiento</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'CABIN' | 'CAMPING')}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
            >
              <option value="CAMPING">Camping</option>
              {park.hasCabins && <option value="CABIN">Cabaña</option>}
            </select>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-600 bg-transparent px-5 py-2.5 text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-yellow-500 px-6 py-2.5 text-slate-900 font-semibold hover:bg-yellow-400 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]"
            >
              {loading ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
