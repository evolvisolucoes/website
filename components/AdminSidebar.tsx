'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { href: '/admin/usuarios', label: 'Usuários', icon: <Users size={16} /> },
  { href: '/admin/faturamento', label: 'Faturamento', icon: <FileText size={16} /> },
  { href: '/admin/servicos', label: 'Serviços', icon: <Settings size={16} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setTimeout(() => router.replace('/admin/login'), 150);
  };

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col justify-between p-6">
      <div>
        <h2 className="text-xl font-bold mb-8">Administração</h2>
        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-700',
                pathname === link.href && 'bg-blue-700 font-semibold'
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-red-300 hover:text-white transition"
      >
        <LogOut size={16} />
        Sair
      </button>
    </aside>
  );
}
