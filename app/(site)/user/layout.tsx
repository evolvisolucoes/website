'use client';

import { ReactNode } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UsuarioLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        <aside className="w-64 flex-shrink-0 min-h-screen">
          <UserSidebar />
        </aside>

        <div className="flex flex-col flex-1 min-h-screen min-w-0">
          <Header title="Contabilidade Automatizada" />
          {/* <main className="flex-grow p-8 overflow-auto"> */}
		  <main className="flex-grow p-2 overflow-auto">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
