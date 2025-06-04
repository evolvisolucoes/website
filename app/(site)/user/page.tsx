'use client';

import { useEffect, useState } from 'react';
import {
  getUsuarioLogado,
  getAgendamentosDoUsuario,
} from '@/lib/mockDB';
import Link from 'next/link';

export default function PainelUsuario() {
  const [usuario, setUsuario] = useState<any>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  useEffect(() => {
    const user = getUsuarioLogado();
    if (user) {
      setUsuario(user);
      setAgendamentos(getAgendamentosDoUsuario(user.id));
    }
  }, []);

  if (!usuario) return <p>Carregando...</p>;

  const concluidos = agendamentos.filter((a) => a.status === 'concluido' && a.arquivos_gerados?.length > 0);
  const pendentes = agendamentos.filter((a) => a.status === 'pendente');

  const totalArquivos = concluidos.reduce((acc, a) => acc + (a.arquivos_gerados?.length || 0), 0);
  const ultimo = [...concluidos].sort((a, b) => new Date(b.data_geracao || '').getTime() - new Date(a.data_geracao || '').getTime())[0];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-blue-700">Olá, {usuario.nome} 👋</h1>

      {/* Resumo rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResumoCard titulo="Serviços Executados" valor={concluidos.length} />
        <ResumoCard titulo="Arquivos Gerados" valor={totalArquivos} />
        <ResumoCard titulo="Pendentes" valor={pendentes.length} cor="orange" />
      </div>

      {/* Último serviço */}
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-2">📁 Último Serviço Concluído</h2>
        {ultimo ? (
          <div className="text-sm">
            <p><strong>Serviço:</strong> {ultimo.servico_nome}</p>
            <p><strong>Data:</strong> {ultimo.data_geracao || '—'}</p>
            <p className="mt-2 font-medium">Arquivos:</p>
            <ul className="list-disc ml-5">
              {ultimo.arquivos_gerados.map((arq: string, i: number) => (
                <li key={i}>
                  <a href={arq} download className="text-blue-600 underline text-xs">Download {i + 1}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Você ainda não tem serviços concluídos.</p>
        )}
      </div>

      {/* Links úteis */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <LinkCard href="/user/servicos" label="📦 Executar Serviços" />
        <LinkCard href="/user/historico" label="📄 Ver Histórico" />
        <LinkCard href="/user/perfil" label="👤 Editar Perfil" />
      </div>
    </div>
  );
}

function ResumoCard({ titulo, valor, cor = 'blue' }: { titulo: string; valor: number; cor?: string }) {
  const corTexto = cor === 'orange' ? 'text-orange-600' : 'text-blue-700';
  return (
    <div className="bg-white p-4 rounded shadow border">
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className={`text-2xl font-semibold ${corTexto}`}>{valor}</p>
    </div>
  );
}

function LinkCard({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <div className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded p-4 text-blue-700 font-medium shadow-sm transition cursor-pointer">
        {label}
      </div>
    </Link>
  );
}
