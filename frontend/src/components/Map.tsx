import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Park } from '../types';
import ParkPopup from './ParkPopup';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  parks: Park[];
  onReserve: (park: Park) => void;
}

export default function InteractiveMap({ parks, onReserve }: MapProps) {
  // Center roughly in the region (Tlaxcala/Puebla/Edomex)
  const center: [number, number] = [19.3, -98.6];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border shadow-sm">
      <MapContainer center={center} zoom={9} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parks.map((park) => (
          <Marker key={park.id} position={[park.lat, park.lng]}>
            <Popup>
              <ParkPopup park={park} onReserve={onReserve} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
