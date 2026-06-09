import { useState } from 'react';
import { Park } from '../types';
import { api } from '../services/api';

interface AdminParksManagerProps {
  parks: Park[];
  onParksChange: () => void;
}

export default function AdminParksManager({ parks, onParksChange }: AdminParksManagerProps) {
  const [isEditing, setIsEditing] = useState<Partial<Park> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este parque?')) return;
    try {
      await api.delete(`/parks/${id}`);
      onParksChange();
    } catch (error) {
      alert('Error al eliminar el parque');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing?.id) {
        await api.put(`/parks/${isEditing.id}`, isEditing);
      } else {
        await api.post('/parks', isEditing);
      }
      setIsEditing(null);
      onParksChange();
    } catch (error) {
      alert('Error al guardar el parque');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-yellow-100">Gestión de Parques</h2>
        <button 
          onClick={() => setIsEditing({ hasCabins: false, stockCabanas: 0, stockCamping: 50, lat: 19.5, lng: -98.5 })}
          className="bg-yellow-500 text-slate-900 font-bold px-5 py-2.5 rounded-full hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.3)]"
        >
          + Nuevo Parque
        </button>
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input placeholder="Nombre" required value={isEditing.nombre || ''} onChange={e => setIsEditing({...isEditing, nombre: e.target.value})} className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            <input placeholder="Dirección" required value={isEditing.direccion || ''} onChange={e => setIsEditing({...isEditing, direccion: e.target.value})} className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            <input placeholder="Servicios" required value={isEditing.servicios || ''} onChange={e => setIsEditing({...isEditing, servicios: e.target.value})} className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            <input placeholder="Horario" required value={isEditing.horario || ''} onChange={e => setIsEditing({...isEditing, horario: e.target.value})} className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-700 p-3 rounded-xl">
              <label className="text-slate-300 font-medium">Tiene Cabañas:</label>
              <input type="checkbox" checked={isEditing.hasCabins || false} onChange={e => setIsEditing({...isEditing, hasCabins: e.target.checked})} className="w-5 h-5 accent-yellow-500" />
            </div>
            
            <input type="number" placeholder="Stock Cabañas" value={isEditing.stockCabanas || 0} onChange={e => setIsEditing({...isEditing, stockCabanas: Number(e.target.value)})} className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            <input type="number" placeholder="Stock Camping (Espacios)" value={(isEditing as any).stockCamping || 0} onChange={e => setIsEditing({...isEditing, stockCamping: Number(e.target.value)} as any)} className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            
            <input type="number" step="any" placeholder="Latitud" required value={isEditing.lat || ''} onChange={e => setIsEditing({...isEditing, lat: parseFloat(e.target.value)})} className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
            <input type="number" step="any" placeholder="Longitud" required value={isEditing.lng || ''} onChange={e => setIsEditing({...isEditing, lng: parseFloat(e.target.value)})} className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors" />
          </div>
          <div className="flex gap-4 justify-end">
            <button type="button" onClick={() => setIsEditing(null)} className="text-slate-400 border border-slate-600 hover:bg-slate-700 px-6 py-2.5 rounded-xl transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-yellow-500 text-slate-900 font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition-colors">{loading ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-950/50">
            <tr className="border-b border-slate-800 text-slate-400 text-sm tracking-wider uppercase">
              <th className="py-4 px-4 font-semibold">Nombre</th>
              <th className="py-4 px-4 font-semibold">Dirección</th>
              <th className="py-4 px-4 font-semibold">Cabañas (Stock)</th>
              <th className="py-4 px-4 font-semibold">Camping (Stock)</th>
              <th className="py-4 px-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {parks.map(park => (
              <tr key={park.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                <td className="py-4 px-4 font-medium text-slate-200">{park.nombre}</td>
                <td className="py-4 px-4 text-slate-400">{park.direccion}</td>
                <td className="py-4 px-4 text-slate-300">{park.hasCabins ? `Sí (${park.stockCabanas})` : 'No'}</td>
                <td className="py-4 px-4 text-slate-300">{(park as any).stockCamping || 50}</td>
                <td className="py-4 px-4 space-x-4">
                  <button onClick={() => setIsEditing(park)} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Editar</button>
                  <button onClick={() => handleDelete(park.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
