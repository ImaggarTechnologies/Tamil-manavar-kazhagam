import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { X, Lock, User, Eye, EyeOff } from 'lucide-react';

const navItems = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'whyJoin', href: '/why-join' },
  { key: 'activities', href: '/activities' },
  { key: 'joinNow', href: '/join' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Login Modal States
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tamilClass = language === 'ta' ? 'tamil-text' : '';

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    setIsAdminLoggedIn(!!token);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    
    checkAuth();
    window.addEventListener('admin-auth-change', checkAuth);
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('admin-auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleHomeClick = () => {
    localStorage.setItem('adminViewActive', 'false');
    window.dispatchEvent(new Event('admin-auth-change'));
  };

  const handleRegistrationsClick = () => {
    localStorage.setItem('adminViewActive', 'true');
    window.dispatchEvent(new Event('admin-auth-change'));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminViewActive');
    window.dispatchEvent(new Event('admin-auth-change'));
    setIsAdminLoggedIn(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      localStorage.setItem('adminViewActive', 'true');
      window.dispatchEvent(new Event('admin-auth-change'));
      setIsAdminLoggedIn(true);
      setLoginModalOpen(false);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 m-0 border-b border-primary bg-navbar p-0 transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_4px_30px_rgba(139,0,0,0.35)]' : ''
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <Link to="/" onClick={handleHomeClick} className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-secondary bg-black shadow-logo transition group-hover:border-accent sm:h-12 sm:w-12">
            <img
              src="/dmk-logo.jpeg"
              alt="Tamil Maanavar Mandram Logo"
              width={48}
              height={48}
              className="h-9 w-9 rounded-md object-cover sm:h-10 sm:w-10"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <p className={`truncate text-sm font-bold text-secondary sm:text-base ${tamilClass}`}>{t.logo}</p>
            <p className="hidden text-[10px] font-medium uppercase tracking-widest text-accent sm:block">Student Movement</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-4 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={item.href === '/' ? handleHomeClick : undefined}
              className={`whitespace-nowrap text-xs font-medium text-muted transition hover:text-accent ${tamilClass}`}
            >
              {t[item.key]}
            </Link>
          ))}
          {isAdminLoggedIn && (
            <Link
              to="/"
              onClick={handleRegistrationsClick}
              className={`whitespace-nowrap text-xs font-bold text-accent transition hover:text-white border-l border-primary/45 pl-4 ${tamilClass}`}
            >
              {language === 'ta' ? 'பதிவுகள்' : 'Registrations'}
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Language selection toggles */}
          <div className="inline-flex items-center gap-0.5 rounded-full border border-primary/50 bg-card p-0.5 text-xs mr-1">
            <button
              type="button"
              onClick={() => setLanguage('ta')}
              className={`rounded-full px-2.5 py-1 transition tamil-text ${language === 'ta' ? 'bg-gradient-to-r from-primary to-secondary font-semibold text-white' : 'text-muted hover:text-accent'}`}
            >
              தமிழ்
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-full px-2.5 py-1 transition ${language === 'en' ? 'bg-gradient-to-r from-primary to-secondary font-semibold text-white' : 'text-muted hover:text-accent'}`}
            >
              EN
            </button>
          </div>

          {/* Admin Login/Logout Button */}
          {isAdminLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-xs font-bold text-white shadow-soft transition hover:scale-105 active:scale-95 cursor-pointer"
            >
              {language === 'ta' ? 'வெளியேறு' : 'Logout'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="rounded-full border border-primary/50 bg-card/65 px-4 py-1.5 text-xs font-semibold text-muted hover:text-accent hover:border-accent transition cursor-pointer"
            >
              {language === 'ta' ? 'நிர்வாகி' : 'Admin'}
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="inline-flex rounded-lg border border-primary/50 bg-card px-3 py-2 text-accent xl:hidden ml-1"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen ? (
        <div className="border-t border-primary/40 bg-navbar px-4 py-3 xl:hidden">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => {
                  setMenuOpen(false);
                  if (item.href === '/') handleHomeClick();
                }}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-primary/20 hover:text-accent ${tamilClass}`}
              >
                {t[item.key]}
              </Link>
            ))}
            {isAdminLoggedIn && (
              <Link
                to="/"
                onClick={() => {
                  setMenuOpen(false);
                  handleRegistrationsClick();
                }}
                className={`rounded-lg px-3 py-2.5 text-sm font-bold text-accent bg-primary/10 border-l-4 border-accent transition hover:bg-primary/20 ${tamilClass}`}
              >
                {language === 'ta' ? 'பதிவுகள் தரவுத்தளம்' : 'Registrations Database'}
              </Link>
            )}
          </nav>
        </div>
      ) : null}

      {/* Admin Login Modal Overlay */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-8 relative shadow-glow border border-primary/30">
            <button
              type="button"
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs uppercase tracking-[0.24em] text-accent">Organizer Login</span>
              <h2 className="text-2xl font-bold text-white mt-1">Admin Panel</h2>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-accent" /> Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="admin"
                  required
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-accent" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <X className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="error-box mt-2 text-xs py-2 px-3">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
