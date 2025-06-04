'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function AdminMenu() {
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    clsx(
      "px-4 py-2 rounded font-medium",
      pathname === href
        ? "bg-blue-700 text-white"
        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
    );

  return (
    <nav className="flex gap-4 mb-6">
      <Link href="/admin/usuarios" className={linkClasses("/admin/usuarios")}>Usuários</Link>
      <Link href="/admin/faturamento" className={linkClasses("/admin/faturamento")}>Faturamento</Link>
      <Link href="/admin/servicos" className={linkClasses("/admin/servicos")}>Serviços</Link>
    </nav>
  );
}
