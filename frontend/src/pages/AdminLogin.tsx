import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err: any) {
      if (err.response?.data?.details) {
        setError(err.response.data.details.map((d: any) => d.message).join(', '));
      } else {
        setError(err.response?.data?.error || 'Failed to login');
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-purple-500/30 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-purple-400">Portal de Administración</h2>
          <p className="mt-2 text-sm text-slate-400">Acceso exclusivo para personal autorizado</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-900/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
          >
            Acceder al Sistema
          </button>
        </form>
      </div>
    </div>
  );
}
