'use client';

import Image from 'next/image';
import logo from '@/public/logo.svg';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/mockDB';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const router = useRouter();

  useEffect(() => {
    const role = document.cookie.split('; ').find(c => c.startsWith('auth_user_role='))?.split('=')[1];
    if (role === 'user') router.push('/user');
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = login(email, senha);
    if (user && user.role === 'user') {
      router.push('/user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="flex">
          {/* Borda azul lateral */}
          <div className="w-2 bg-blue-600" />

          {/* Conteúdo do Card */}
          <div className="flex-1 p-8">
            <div className="flex justify-center mb-6">
              <Image src={logo} alt="Logo Evolvi" width={160} height={40} />
            </div>

            <h1 className="text-xl font-semibold text-center mb-6 text-gray-800">
              Acesse sua conta
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="E-mail"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
