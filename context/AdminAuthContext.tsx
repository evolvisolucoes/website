'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { logoutUsuario } from '@/lib/supabaseService';

type AdminAuthContextType = {
  isAdminLogged: boolean;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminLogged, setIsAdminLogged] = useState(false);

  useEffect(() => {
    const isLogged = document.cookie.includes('auth_user_role=admin');
    setIsAdminLogged(isLogged);
  }, []);

  const logout = () => {
    logoutUsuario();
    setIsAdminLogged(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLogged, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth precisa estar dentro de AdminAuthProvider');
  return context;
}
