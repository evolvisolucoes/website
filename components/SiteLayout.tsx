'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export default function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isUserRoute = pathname.startsWith('/user'); // ou inclua outros como `/admin`

  return (
    <div className={`flex min-h-screen ${isUserRoute ? 'pl-64' : ''}`}>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
