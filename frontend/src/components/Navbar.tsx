import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md text-white h-16 flex items-center justify-between px-6 border-b border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-2xl font-bold tracking-tight text-yellow-100 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)] hover:drop-shadow-[0_0_20px_rgba(253,224,71,0.8)] transition-all">
          LuciMap
        </Link>
        <Link to="/admin" className="w-2 h-2 rounded-full opacity-0 hover:opacity-100 bg-purple-500 transition-opacity" title="Admin Portal" />
      </div>

      <div className="flex space-x-6 items-center">
        {user ? (
          <>
            {user.role === 'ADMIN' && (
              <Link to="/admin/dashboard" className="text-sm font-medium text-slate-300 hover:text-yellow-400 transition-colors">Dashboard Admin</Link>
            )}
            {user.role === 'CLIENT' && (
              <Link to="/my-reservations" className="text-sm font-medium text-slate-300 hover:text-yellow-400 transition-colors">Mis Reservas</Link>
            )}
            <div className="flex items-center space-x-4 ml-4 border-l border-slate-700 pl-4">
              <span className="text-sm text-slate-400">{user.email}</span>
              <button 
                onClick={logout}
                className="text-slate-400 hover:text-red-400 text-sm font-medium transition-colors"
              >
                Salir
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-yellow-400 transition-colors">Ingresar</Link>
            <Link to="/register" className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
