import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.details) {
        setError(err.response.data.details.map((d: any) => d.message).join(', '));
      } else {
        setError(err.response?.data?.error || 'Failed to login');
      }
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#030712]">
      {/* Dynamic abstract background */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none animate-glow"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[150px] pointer-events-none animate-float"></div>

      <div className="relative z-10 w-full max-w-md p-10">
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-serif text-white mb-3 tracking-wide">Bienvenido</h2>
          <p className="text-slate-400 font-light tracking-wide text-sm uppercase">Accede a tu experiencia</p>
        </div>

        {error && <div className="mb-8 rounded bg-red-950/50 border-l-4 border-red-500 p-4 text-red-200 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full bg-transparent border-b border-slate-700 py-3 text-white placeholder-transparent focus:border-yellow-500 transition-colors outline-none font-light"
              placeholder="Correo Electrónico"
              required
            />
            <label className="absolute left-0 -top-4 text-xs font-semibold tracking-wider text-yellow-500 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-yellow-500">
              Correo Electrónico
            </label>
          </div>
          
          <div className="relative group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full bg-transparent border-b border-slate-700 py-3 text-white placeholder-transparent focus:border-yellow-500 transition-colors outline-none font-light"
              placeholder="Contraseña"
              required
            />
            <label className="absolute left-0 -top-4 text-xs font-semibold tracking-wider text-yellow-500 uppercase transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-yellow-500">
              Contraseña
            </label>
          </div>

          <button 
            type="submit" 
            className="group relative w-full overflow-hidden rounded-full bg-slate-900 border border-yellow-500/30 p-4 font-semibold text-yellow-500 transition-all hover:bg-yellow-500 hover:text-slate-950 mt-12"
          >
            <span className="relative z-10 tracking-widest uppercase text-sm">Iniciar Sesión</span>
            <div className="absolute inset-0 h-full w-0 bg-yellow-500 transition-all duration-500 ease-out group-hover:w-full"></div>
          </button>
        </form>
        
        <p className="mt-10 text-center text-xs tracking-widest text-slate-500 uppercase">
          ¿Nuevo aquí? <Link to="/register" className="text-yellow-500 hover:text-white transition-colors ml-2 font-semibold">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
