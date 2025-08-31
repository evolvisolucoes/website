'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUsuario } from '@/types_db';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import logo from 'public/logo.svg';

const links = [
  { label: 'Dashboard', href: '/user' },
  { label: 'Histórico', href: '/user/historico' },
  { label: 'Serviços', href: '/user/servicos' },
  { label: 'Perfil', href: '/user/perfil' }
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logoutUsuario();
    router.replace('/login');
  };

  return (
    <>
      {/* Botão hambúrguer para mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white border border-gray-300 shadow-md"
        aria-label="Abrir menu"
        onClick={() => setSidebarOpen(true)}
      >
        <svg
          className="w-6 h-6 text-blue-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay para fechar sidebar no mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r z-50 flex flex-col justify-between px-4 py-6
          w-64
          transform md:transform-none transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        `}
      >
        <div>
          {/* Logo no topo */}
          <div className="mb-8 flex items-center space-x-2 px-2">
            <Image src={logo} alt="Logo Evolvi" width={180} height={60} />
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`block px-4 py-2 rounded text-sm cursor-pointer hover:bg-blue-50 ${
                    pathname === link.href
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)} // fecha menu mobile ao clicar link
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
