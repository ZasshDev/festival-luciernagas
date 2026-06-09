import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Park } from '../types';
import { Clock, Calendar, Users, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReservationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [park, setPark] = useState<Park | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  
  // Step 1 Form State
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [numPersonas, setNumPersonas] = useState(1);
  const [tipo, setTipo] = useState<'CABIN' | 'CAMPING'>('CAMPING');
  
  // UI State
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPark = async () => {
      try {
        const { data } = await api.get(`/parks/${id}`);
        if (data.data) {
          setPark(data.data);
          if (data.data.hasCabins) {
            setTipo('CABIN');
          }
        } else {
          setError('Santuario no encontrado');
        }
      } catch (err) {
        setError('Error al cargar la información del santuario');
      } finally {
        setLoading(false);
      }
    };
    fetchPark();
  }, [id]);

  useEffect(() => {
    if (loading || !park) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert('El tiempo de reserva ha expirado.');
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [loading, park, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    
    if (start >= end) {
      setError('La fecha de inicio debe ser anterior a la de fin.');
      return;
    }
    
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
    
    setStep(2);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/reservations', {
        parkId: park!.id,
        fechaInicio: new Date(fechaInicio).toISOString(),
        fechaFin: new Date(fechaFin).toISOString(),
        numPersonas,
        tipo,
      });
      
      const alertBox = document.createElement('div');
      alertBox.className = 'fixed bottom-10 right-10 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-bounce flex items-center gap-2';
      alertBox.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> ✨ ¡Reserva confirmada! Revisa tu correo.';
      document.body.appendChild(alertBox);
      setTimeout(() => document.body.removeChild(alertBox), 5000);
      
      navigate('/my-reservations');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear la reserva');
      setStep(1); // Volver atrás si hubo un error (e.g. overbooking)
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cargando santuario...</div>;
  }

  if (!park) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-slate-400">{error || 'No se pudo encontrar este santuario.'}</p>
        <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-yellow-500 text-black rounded-full font-bold hover:bg-yellow-400">
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Countdown */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl">
          <div>
            <h1 className="text-3xl font-serif text-yellow-500 mb-2">{park.nombre}</h1>
            <p className="flex items-center gap-2 text-slate-400 text-sm"><MapPin size={16} /> {park.direccion}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3 bg-red-950/30 border border-red-900 text-red-400 px-5 py-3 rounded-xl">
            <Clock size={20} className="animate-pulse" />
            <div className="text-right">
              <p className="text-xs font-bold tracking-widest uppercase mb-1">Tiempo Restante</p>
              <p className="text-2xl font-mono leading-none">{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Area */}
          <div className="md:col-span-2">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
              {error && (
                <div className="mb-6 rounded-xl bg-red-950/50 border border-red-900 p-4 text-red-400 flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {step === 1 ? (
                <motion.form 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleNextStep} 
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">1. Detalles de tu estancia</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Fecha de Llegada</label>
                      <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                        style={{ colorScheme: 'dark' }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Fecha de Salida</label>
                      <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                        style={{ colorScheme: 'dark' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Número de Personas</label>
                      <input
                        type="number"
                        min="1"
                        value={numPersonas}
                        onChange={(e) => setNumPersonas(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Tipo de Alojamiento</label>
                      <select
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value as 'CABIN' | 'CAMPING')}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors appearance-none"
                      >
                        <option value="CAMPING">Zona de Camping</option>
                        {park.hasCabins && <option value="CABIN">Cabaña Rústica</option>}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-8 bg-yellow-500 text-slate-950 font-bold text-lg py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                  >
                    Siguiente Paso
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">2. Comprobación de Reserva</h2>
                  
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <span className="text-slate-400">Santuario</span>
                      <span className="font-bold text-yellow-500">{park.nombre}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <span className="text-slate-400">Alojamiento</span>
                      <span className="font-medium">{tipo === 'CABIN' ? 'Cabaña Rústica' : 'Zona de Camping'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <span className="text-slate-400">Fechas</span>
                      <span className="font-medium text-right">
                        {new Date(fechaInicio).toLocaleDateString()} al {new Date(fechaFin).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Visitantes</span>
                      <span className="font-medium">{numPersonas} {numPersonas === 1 ? 'persona' : 'personas'}</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 border border-slate-700 text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={submitting}
                      className="w-2/3 flex items-center justify-center gap-2 bg-yellow-500 text-slate-950 font-bold text-lg py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_20px_rgba(234,179,8,0.3)] disabled:opacity-50"
                    >
                      {submitting ? 'Confirmando...' : <><CheckCircle2 size={20} /> Finalizar Reserva</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Park Details Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="font-bold text-lg mb-4 text-white">Sobre el Santuario</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Este santuario ofrece una de las vistas más espectaculares del avistamiento de luciérnagas.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="block text-slate-300 font-medium">Temporada</span>
                    <span className="text-slate-500">Junio - Agosto</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="block text-slate-300 font-medium">Horario de Actividad</span>
                    <span className="text-slate-500">{park.horario}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Users className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <span className="block text-slate-300 font-medium">Servicios</span>
                    <span className="text-slate-500">{park.servicios}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
