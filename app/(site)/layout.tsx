import { ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import SiteLayout from '@/components/SiteLayout'; // supondo que você colocou o layout em components

export default function SiteLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SiteLayout>{children}</SiteLayout>
    </AuthProvider>
  );
}
