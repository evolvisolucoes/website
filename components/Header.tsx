'use client';
import Image from 'next/image';
import logo from '@/public/logo.png';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 border-b bg-white shadow">
      <div className="flex items-center gap-3">
        <Image src={logo} alt="Logo Evolvi" width={32} height={32} />
        <span className="text-xl font-bold text-blue-700">Evolvi Soluções</span>
      </div>
    </header>
  );
}
