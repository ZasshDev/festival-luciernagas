export interface User {
  id: string;
  nombre: string;
  apellidos?: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
}

export interface Park {
  id: string;
  nombre: string;
  direccion: string;
  servicios: string;
  horario: string;
  hasCabins: boolean;
  lat: number;
  lng: number;
}

export interface Reservation {
  id: string;
  userId: string;
  parkId: string;
  fechaInicio: string;
  fechaFin: string;
  numPersonas: number;
  tipo: 'CABIN' | 'CAMPING';
  status: 'ACTIVE' | 'CANCELLED';
  codigo?: string;
  park?: { nombre: string };
  user?: { nombre: string; apellidos: string; email: string };
}
