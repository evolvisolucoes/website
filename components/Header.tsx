'use client';
import { logoutUsuario } from '@/lib/supabaseService';
import { useRouter } from 'next/navigation';
export default function Header({ title }: { title: string }) {
	 const router = useRouter();
	 const handleLogout = () => {
     logoutUsuario();
    router.replace('/login');
  };
	 return (
    <header className="w-full border-b bg-white shadow-sm top-0 z-30">
      <div className="mx-6 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-blue-700">{title}</h1>
        <button
          onClick={handleLogout}
          className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition"
        >
          Sair
        </button>
      </div>
    </header>
  );
}