import type { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

type PageShellProps = {
  children: ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-surface text-white">
      <Header />
      <main className="page-main">{children}</main>
      <Footer />
    </div>
  );
}
