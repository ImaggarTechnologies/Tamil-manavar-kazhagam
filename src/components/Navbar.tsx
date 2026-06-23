import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, Globe } from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdminLoggedIn(!!token);
  }, [pathname]);

  const navItems = [
    { name: t.home, path: '/' },
    { name: t.about, path: '/about' },
    { name: t.whyJoin, path: '/why-join' },
    { name: t.activities, path: '/activities' },
    { name: t.contact, path: '/contact' },
    ...(isAdminLoggedIn
      ? [{ name: language === 'ta' ? 'நிர்வாகப் பலகை' : 'Admin Panel', path: '/admin/dashboard' }]
      : [])
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ta' ? 'en' : 'ta');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-red-100'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-[#8B0000] font-poppins tracking-wide">
              {language === 'ta' ? 'தமிழ் மாணவர் மன்றம்' : 'Tamil Maanavar Mandram'}
            </span>
            <span className="text-[10px] tracking-widest text-[#00695C] font-semibold uppercase">
              {language === 'ta' ? 'மாணவர் சக்தி • தமிழ் வளர்ச்சி' : 'Student Power • Tamil Growth'}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#8B0000] ${
                  isActive(item.path)
                    ? 'text-[#8B0000] font-semibold border-b-2 border-[#8B0000] pb-1'
                    : 'text-gray-600'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 hover:border-[#8B0000] text-gray-700 hover:text-[#8B0000] text-xs font-semibold transition-all duration-200 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>

            {/* CTA Join Button */}
            <Link
              to="/join"
              className="bg-[#8B0000] hover:bg-[#F5C542] hover:text-[#8B0000] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t.joinNow}
            </Link>

            {/* Admin Login/Logout Button */}
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="border border-[#8B0000] text-[#8B0000] hover:bg-[#8B0000] hover:text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
              >
                {language === 'ta' ? 'வெளியேறு' : 'Logout'}
              </button>
            ) : (
              <Link
                to="/admin"
                className="border border-gray-300 hover:border-[#8B0000] text-gray-700 hover:text-[#8B0000] px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
              >
                {language === 'ta' ? 'நிர்வாகி' : 'Admin'}
              </Link>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-300 text-gray-700 text-xs font-semibold"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'ta' ? 'EN' : 'தமிழ்'}</span>
            </button>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#8B0000] focus:outline-none p-1"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-red-50 py-4 px-4 shadow-inner">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-red-50 text-[#8B0000]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/join"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-[#8B0000] hover:bg-[#F5C542] hover:text-[#8B0000] text-white px-4 py-3 rounded-md text-base font-bold shadow-md"
            >
              {t.joinNow}
            </Link>

            {/* Mobile Admin Login/Logout */}
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="block w-full text-center border border-red-600 text-red-600 hover:bg-red-50 px-4 py-3 rounded-md text-base font-bold transition-all duration-200 cursor-pointer"
              >
                {language === 'ta' ? 'நிர்வாகி வெளியேறு' : 'Admin Logout'}
              </button>
            ) : (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block text-center border border-gray-300 hover:border-[#8B0000] text-gray-700 hover:text-[#8B0000] px-4 py-3 rounded-md text-base font-bold transition-all duration-200"
              >
                {language === 'ta' ? 'நிர்வாகி உள்நுழைவு' : 'Admin Login'}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

