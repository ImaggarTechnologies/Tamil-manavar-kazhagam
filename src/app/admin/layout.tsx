import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';

const nav = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/registrations', label: 'Registrations' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/gallery', label: 'Gallery' },
  { href: '/admin/contacts', label: 'Contact Enquiries' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === '/admin') {
      setReady(true);
      return;
    }
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin', { replace: true });
      return;
    }
    setReady(true);
  }, [pathname, navigate]);

  if (pathname === '/admin') {
    return <>{children}</>;
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-surface text-white">
      <div className="border-b border-primary/30 bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-primary">Admin Panel</p>
            <h1 className="text-lg font-semibold">Tamil Maanavar Mandram</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin');
            }}
            className="rounded-full border border-primary/20 px-4 py-2 text-sm hover:border-primary"
          >
            Logout
          </button>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                pathname === item.href ? 'bg-primary text-white' : 'border border-primary/15 hover:border-primary/40'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
