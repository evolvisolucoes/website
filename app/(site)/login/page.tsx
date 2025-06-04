'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { login } from '@/lib/mockDB';
import logo from '@/public/logo.png'; // Ajuste o caminho se necessário

export default function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
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
    } else {
      setErro('Credenciais inválidas');
    }
  };

  return (
    <div className="flex items-center justify-center w-full px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white border-l-4 border-blue-700 p-8 rounded shadow-md w-full max-w-md space-y-6 relative"
      >
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-xl font-bold text-blue-700">Login do Usuário</h1>
        </div>

        {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

        <div className="space-y-3">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
