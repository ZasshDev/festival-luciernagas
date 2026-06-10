import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md text-white h-16 flex items-center justify-between px-6 border-b border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 group">
          <svg className="w-7 h-7 text-yellow-500 group-hover:drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] transition-all" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.686 2 6 4.686 6 8C6 9.873 6.862 11.547 8.167 12.637C8.683 13.067 9 13.722 9 14.414V16C9 17.104 9.896 18 11 18H13C14.104 18 15 17.104 15 16V14.414C15 13.722 15.317 13.067 15.833 12.637C17.138 11.547 18 9.873 18 8C18 4.686 15.314 2 12 2ZM12 20C10.895 20 10 20.895 10 22C10 22.552 10.448 23 11 23H13C13.552 23 14 22.552 14 22C14 20.895 13.105 20 12 20Z" />
            <circle cx="12" cy="8" r="3" fill="#fef08a" className="animate-pulse" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-yellow-100 drop-shadow-[0_0_10px_rgba(253,224,71,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(253,224,71,0.8)] transition-all hidden sm:block">
            Festival de las Luciérnagas
          </span>
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
