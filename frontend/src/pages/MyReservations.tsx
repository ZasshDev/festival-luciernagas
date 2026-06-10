import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Reservation } from '../types';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import { Download, Calendar, Users, Tent, MapPin } from 'lucide-react';

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

  const downloadPDF = (res: Reservation) => {
    const doc = new jsPDF();
    
    // Configuración general
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 297, 'F');
    
    // Título principal
    doc.setTextColor(253, 224, 71); // yellow-300
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("Festival de las Luciernagas", 105, 30, { align: "center" });
    
    // Subtítulo
    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("Pase de Acceso Magico", 105, 45, { align: "center" });

    // Cuadro de información
    doc.setDrawColor(253, 224, 71);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, 60, 170, 100, 5, 5);

    // Datos de la reserva
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(`Santuario: ${res.park?.nombre}`, 30, 75);
    
    doc.setFontSize(12);
    doc.setTextColor(180, 180, 180);
    doc.text(`ID Reserva: ${res.codigo || res.id}`, 30, 90);
    doc.text(`Fechas: ${new Date(res.fechaInicio).toLocaleDateString()} al ${new Date(res.fechaFin).toLocaleDateString()}`, 30, 105);
    doc.text(`Visitantes: ${res.numPersonas} personas`, 30, 120);
    doc.text(`Tipo de Estancia: ${res.tipo === 'CABIN' ? 'Cabana' : 'Camping'}`, 30, 135);
    doc.text(`Estado: ${res.status}`, 30, 150);
    
    // Agregar código QR al PDF
    const qrElement = document.getElementById(`qr-${res.id}`) as HTMLCanvasElement;
    if (qrElement) {
      const qrDataUrl = qrElement.toDataURL("image/png");
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(75, 180, 60, 60, 3, 3, 'F');
      doc.addImage(qrDataUrl, 'PNG', 77, 182, 56, 56);
      
      doc.setTextColor(253, 224, 71);
      doc.setFontSize(10);
      doc.text("Presenta este codigo al llegar al santuario", 105, 250, { align: "center" });
    }

    doc.save(`Reserva_${res.codigo || res.id}.pdf`);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse text-yellow-500 font-serif text-2xl tracking-widest">Buscando pases mágicos...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-serif mb-8 text-yellow-100 border-b border-white/10 pb-4">Mis Reservas Mágicas</h2>

        {reservations.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/50 p-16 rounded-3xl shadow-2xl text-center flex flex-col items-center backdrop-blur-sm">
            <span className="text-6xl mb-6">✨</span>
            <p className="text-slate-300 text-xl mb-8 font-light tracking-wide">Aún no tienes reservaciones mágicas.</p>
            <a href="/" className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-10 py-4 rounded-full text-sm font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-105">
              Descubrir Santuarios
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {reservations.map((res) => (
              <div key={res.id} className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-serif text-white mb-2">{res.park?.nombre}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <MapPin size={16} className="text-yellow-500" />
                        <span>Santuario Protegido</span>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border ${res.status === 'ACTIVE' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-red-900/20 text-red-400 border-red-500/30'}`}>
                      {res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Fechas</span>
                      <div className="flex items-center gap-2 text-slate-200">
                        <Calendar size={16} className="text-purple-400" />
                        <span className="text-sm">{new Date(res.fechaInicio).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Visitantes</span>
                      <div className="flex items-center gap-2 text-slate-200">
                        <Users size={16} className="text-purple-400" />
                        <span className="text-sm">{res.numPersonas} Personas</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Estancia</span>
                      <div className="flex items-center gap-2 text-slate-200">
                        <Tent size={16} className="text-purple-400" />
                        <span className="text-sm">{res.tipo === 'CABIN' ? 'Cabaña' : 'Camping'}</span>
                      </div>
                    </div>
                  </div>

                  {res.status === 'ACTIVE' && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-xl shadow-lg">
                          <QRCodeCanvas
                            id={`qr-${res.id}`}
                            value={`Reserva:${res.codigo || res.id}|Parque:${res.park?.nombre}|Inicio:${res.fechaInicio}`}
                            size={70}
                            level="H"
                          />
                        </div>
                        <div className="flex flex-col">
                          <button
                            onClick={() => downloadPDF(res)}
                            className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-semibold text-sm transition-colors mb-2"
                          >
                            <Download size={16} />
                            Descargar Pase PDF
                          </button>
                          <span className="text-xs text-slate-500">ID: {res.codigo?.substring(0,8) || res.id.substring(0,8)}...</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancel(res.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors text-xs font-medium uppercase tracking-widest"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
