'use client';

import { ReactNode } from 'react';
import UserSidebar from '@/components/UserSidebar';
import { AuthProvider } from '../auth-context';

export default function UsuarioLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <UserSidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-8 bg-gray-50 overflow-hidden">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
