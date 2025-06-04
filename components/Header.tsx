'use client';
import Image from 'next/image';
import logo from '@/public/logo.svg';

export default function Header() {
  return (
    <header className="flex justify-between items-center px-4 border-b bg-white shadow">
      <div className="flex items-center">
        <Image src={logo} alt="Logo Evolvi" width={180} height={60} />
      </div>
    </header>
  );
}