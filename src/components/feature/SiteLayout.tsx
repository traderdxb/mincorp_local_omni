import type { ReactNode } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

type Props = {
  children: ReactNode;
};

export default function SiteLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}