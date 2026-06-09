import { Park } from '../types';
import { useAuth } from '../hooks/useAuth';

interface ParkPopupProps {
  park: Park;
  onReserve: (park: Park) => void;
}

export default function ParkPopup({ park, onReserve }: ParkPopupProps) {
  const { user } = useAuth();

  return (
    <div className="p-2">
      <h3 className="text-lg font-bold">{park.nombre}</h3>
      <p className="text-sm text-gray-600 mb-2">{park.direccion}</p>
      
      <div className="mb-2">
        <span className="font-semibold text-sm">Servicios:</span>
        <p className="text-sm">{park.servicios}</p>
      </div>
      
      <div className="mb-2">
        <span className="font-semibold text-sm">Horario:</span>
        <p className="text-sm">{park.horario}</p>
      </div>

      <div className="mb-4">
        <span className="font-semibold text-sm">Alojamiento:</span>
        <p className="text-sm">
          Camping {park.hasCabins && 'y Cabañas'}
        </p>
      </div>

      {user ? (
        user.role === 'CLIENT' && (
          <button
            onClick={() => onReserve(park)}
            className="w-full bg-blue-600 text-white rounded p-2 text-sm hover:bg-blue-700"
          >
            Reservar
          </button>
        )
      ) : (
        <p className="text-sm text-blue-600 font-semibold mt-2">
          Inicia sesión para reservar
        </p>
      )}
    </div>
  );
}
