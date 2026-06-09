import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Reservation, Park, User } from '../types';
import AdminParksManager from '../components/AdminParksManager';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [parks, setParks] = useState<Park[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [validating, setValidating] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  
  const fetchData = async () => {
    try {
      const [resData, parksData, usersData] = await Promise.all([
        api.get('/reservations'),
        api.get('/parks'),
        api.get('/auth/users')
      ]);
      setReservations(resData.data.data);
      setParks(parksData.data.data);
      setUsers(usersData.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleScan = async (text: string) => {
    if (!text || validating) return;
    
    let code = text;
    if (text.includes('Reserva:')) {
      const match = text.match(/Reserva:([^|]+)/);
      if (match) code = match[1];
    }
    
    setValidating(true);
    setScanMessage('Validando...');
    try {
      const res = await api.post('/reservations/validate', { codigo: code });
      setScanMessage(`✅ Éxito: ${res.data.message}`);
      fetchData(); // Refresh list
    } catch (err: any) {
      setScanMessage(`❌ Error: ${err.response?.data?.error || 'Código inválido'}`);
    } finally {
      setTimeout(() => {
        setValidating(false);
        setScanMessage('');
      }, 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 text-slate-100">
      <h1 className="text-4xl font-bold mb-8 text-yellow-500 tracking-tight">Admin Dashboard</h1>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AdminParksManager parks={parks} onParksChange={fetchData} />
        </div>
        
        {/* Lector de QR */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4 text-purple-400">Validar Llegada (Escáner QR)</h2>
          <div className="w-full max-w-sm rounded-xl overflow-hidden border-2 border-dashed border-slate-600 bg-black aspect-square flex items-center justify-center">
            <Scanner onScan={(result) => handleScan(result[0].rawValue)} />
          </div>
          {scanMessage && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-semibold w-full text-center ${scanMessage.includes('❌') ? 'bg-red-900/50 text-red-400 border border-red-800' : scanMessage.includes('✅') ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-slate-800 text-slate-300'}`}>
              {scanMessage}
            </div>
          )}
          <p className="text-xs text-slate-500 mt-4 text-center">Apunta la cámara al código QR de la reserva para marcar la llegada del visitante.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-yellow-100">Todas las Reservas</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-slate-950/50">
              <tr className="border-b border-slate-800 text-slate-400 text-sm tracking-wider uppercase">
                <th className="py-2">Cliente</th>
                <th className="py-2">Email</th>
                <th className="py-2">Parque</th>
                <th className="py-2">Fechas</th>
                <th className="py-2">Duración</th>
                <th className="py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => {
                const start = new Date(res.fechaInicio);
                const end = new Date(res.fechaFin);
                const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                return (
                  <tr key={res.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-200">{res.user?.nombre} {res.user?.apellidos}</td>
                    <td className="py-4 px-4 text-slate-400">{res.user?.email}</td>
                    <td className="py-4 px-4 text-yellow-500/80">{res.park?.nombre}</td>
                    <td className="py-4 px-4 text-slate-300">
                      {start.toLocaleDateString()} - {end.toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-slate-400">{days} {days === 1 ? 'día' : 'días'}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-xs font-bold tracking-wider rounded-full border ${
                        res.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                        res.status === 'ARRIVED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-yellow-100">Gestión de Usuarios</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-slate-950/50">
              <tr className="border-b border-slate-800 text-slate-400 text-sm tracking-wider uppercase">
                <th className="py-2">Nombre</th>
                <th className="py-2">Email</th>
                <th className="py-2">Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-200">{u.nombre} {u.apellidos}</td>
                  <td className="py-4 px-4 text-slate-400">{u.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 text-xs font-bold tracking-wider rounded-full border ${u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
