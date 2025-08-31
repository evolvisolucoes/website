import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import SiteLayout from '@/components/SiteLayout';

export default function SiteLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SiteLayout>{children}</SiteLayout>
    </AuthProvider>
  );
}
