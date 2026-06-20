import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 dark:bg-dark">
      <form onSubmit={handleSubmit} className="card w-full max-w-md space-y-5 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-primary">Organizer Login</p>
          <h1 className="mt-2 text-2xl font-semibold">Admin Panel</h1>
        </div>
        <label className="block space-y-2 text-sm">
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" required />
        </label>
        <label className="block space-y-2 text-sm">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
        </label>
        {error ? <p className="error-box">{error}</p> : null}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
