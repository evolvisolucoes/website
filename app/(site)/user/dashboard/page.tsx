'use client';
import { getUsuarioLogado, getFaturasDoUsuario, getServicosDoUsuario } from '@/lib/mockDB';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [faturas, setFaturas] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);

  useEffect(() => {
    const user = getUsuarioLogado();
    if (user) {
      setUsuario(user);
      setFaturas(getFaturasDoUsuario(user.id));
      setServicos(getServicosDoUsuario(user.id));
    }
  }, []);

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Olá, {usuario.nome}</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Faturas</p>
          <p className="text-xl font-bold">{faturas.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Serviços Realizados</p>
          <p className="text-xl font-bold">{servicos.length}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/user/configuracoes" className="bg-blue-600 text-white px-4 py-2 rounded">Configurações</Link>
        <Link href="/user/servicos" className="bg-green-600 text-white px-4 py-2 rounded">Ver Serviços</Link>
      </div>
    </div>
  );
}
