import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Pages
import Home from './app/page';
import About from './app/about/page';
import WhyJoin from './app/why-join/page';
import Activities from './app/activities/page';
import Events from './app/events/page';
import Gallery from './app/gallery/page';
import Join from './app/join/page';
import Contact from './app/contact/page';

// Admin Panel
import AdminLogin from './app/admin/page';
import AdminLayout from './app/admin/layout';
import AdminDashboard from './app/admin/dashboard/page';
import AdminRegistrations from './app/admin/registrations/page';
import AdminEvents from './app/admin/events/page';
import AdminGallery from './app/admin/gallery/page';
import AdminContacts from './app/admin/contacts/page';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/why-join" element={<WhyJoin />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/join" element={<Join />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/registrations" element={<AdminLayout><AdminRegistrations /></AdminLayout>} />
          <Route path="/admin/events" element={<AdminLayout><AdminEvents /></AdminLayout>} />
          <Route path="/admin/gallery" element={<AdminLayout><AdminGallery /></AdminLayout>} />
          <Route path="/admin/contacts" element={<AdminLayout><AdminContacts /></AdminLayout>} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
