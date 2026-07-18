import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuthStore } from '../../store';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!auth) {
        throw new Error('Firebase belum dikonfigurasi');
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard-portfolio');
    } catch (err: any) {
      setError(err.message || 'Gagal login. Periksa kembali email dan password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUser({ uid: 'demo-user', email: 'demo@example.com' } as any);
    navigate('/dashboard-portfolio');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-zinc-200/50 p-8 border border-zinc-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Admin Login</h1>
          <p className="text-zinc-500 mt-2 text-sm">Masuk untuk mengelola portofolio</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all bg-zinc-50 focus:bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all bg-zinc-50 focus:bg-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-zinc-500">ATAU</span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          type="button"
          className="w-full py-3 bg-purple-100 text-purple-700 rounded-lg font-bold hover:bg-purple-200 transition-colors"
        >
          Preview Mode Admin (Demo)
        </button>
      </div>
    </div>
  );
}
