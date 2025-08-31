'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getUsuarioLogado, logoutUsuario } from '@/lib/supabaseService';
import { Usuario } from "@/types_db"

type AuthContextType = {
  isLoggedIn: boolean;
  role: 'user' | 'admin' | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const user: Usuario | null = await getUsuarioLogado();
      const storedRole = localStorage.getItem('auth_user_role') as 'user' | 'admin' | null;

      if (user) {
        setIsLoggedIn(true);
        setRole(user.role || storedRole);
      } else {
        setIsLoggedIn(false);
        setRole(null);
      }
    };
    checkUser();
  }, []);

  const logout = async () => {
    await logoutUsuario();
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};