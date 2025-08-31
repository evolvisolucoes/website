// app\(site)\user\page
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileDown, User, FolderCheck, Clock, Coins } from 'lucide-react';
import {
  getUsuarioLogado,
  getAgendamentosDoUsuario,
  getFaturasDoUsuario,
} from '@/lib/supabaseService';
import { Usuario, Agendamento, Fatura } from '@/types_db';

export default function PainelUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [faturaAtiva, setFaturaAtiva] = useState<Fatura | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = await getUsuarioLogado();
      if (user) {
        setUsuario(user);
        setAgendamentos(await getAgendamentosDoUsuario(user.id));

        const faturas = await getFaturasDoUsuario(user.id);
        const ultimaPagaRaw = [...faturas]
          .filter((f) => f.status === 'Pago')
          .sort(
            (a, b) =>
              new Date(b.vencimento || '').getTime() -
              new Date(a.vencimento || '').getTime()
          )[0];

        const ultimaPaga: Fatura | null = ultimaPagaRaw
          ? {
              ...ultimaPagaRaw,
              id: ultimaPagaRaw.id,
              status: ultimaPagaRaw.status,
            }
          : null;

        setFaturaAtiva(ultimaPaga);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !usuario) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Carregando informações...</p>
      </div>
    );
  }

  const concluidos = agendamentos.filter(
    (a) => a.status === 'concluido' && a.arquivos_gerados?.length
  );
  const pendentes = agendamentos.filter((a) => a.status === 'pendente');
  const totalArquivos = concluidos.reduce(
    (acc, a) => acc + (a.arquivos_gerados?.length || 0),
    0
  );
  const ultimo = [...concluidos].sort(
    (a, b) =>
      new Date(b.data_geracao || '').getTime() -
      new Date(a.data_geracao || '').getTime()
  )[0];
  const formatarData = (data?: string) => {
    if (!data) return '—';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700">
        Olá, {usuario.nome} 👋
      </h1>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <ResumoCard
          titulo="Serviços Executados"
          valor={concluidos.length}
          icon={<FolderCheck className="w-5 h-5 text-blue-700" />}
        />
        <ResumoCard
          titulo="Arquivos Gerados"
          valor={totalArquivos}
          icon={<FileDown className="w-5 h-5 text-blue-700" />}
        />
        <ResumoCard
          titulo="Pendentes"
          valor={pendentes.length}
          icon={<Clock className="w-5 h-5 text-orange-600" />}
          cor="orange"
        />
        <ResumoCard
          titulo="Fatura Ativa"
          valor={
            faturaAtiva
              ? `R$ ${faturaAtiva.valor.toFixed(2)}`
              : 'Nenhuma fatura'
          }
          icon={<Coins className="w-5 h-5 text-green-600" />}
          cor="green"
        />
      </div>

      {/* Último serviço concluído */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          📁 Último Serviço Concluído
        </h2>
        {ultimo ? (
          <div className="text-sm space-y-1">
            <p>
              <strong>Serviço:</strong> {ultimo.servico_nome}
            </p>
            <p>
              <strong>Data:</strong> {formatarData(ultimo.data_geracao)}
            </p>
            <div>
              <p className="mt-2 font-medium">Arquivos:</p>
              <ul className="list-disc ml-5 mt-1 space-y-1">
                {ultimo.arquivos_gerados!.map((arq, i) => (
                  <li key={i}>
                    <a
                      href={arq}
                      download
                      className="text-blue-600 underline text-xs hover:text-blue-800"
                    >
                      Download {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Você ainda não tem serviços concluídos.
          </p>
        )}
      </div>

      {/* Fatura Ativa (Detalhes) */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          💰 Fatura Ativa
        </h2>
        {faturaAtiva ? (
          <div className="text-sm">
            <p>
              <strong>Valor:</strong>{' '}
              <span className="text-green-700 font-semibold">
                R$ {faturaAtiva.valor.toFixed(2)}
              </span>
            </p>
            <p>
              {faturaAtiva.status === 'Pago' ?
              (<strong>Pago em:</strong>) :
              (<strong>Vencimento:</strong>)} {formatarData(faturaAtiva.vencimento)}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`${faturaAtiva.status === 'Pago' ? 'text-green-600' : 'text-orange-600'} font-medium uppercase`}>
                {faturaAtiva.status}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhuma fatura paga encontrada.</p>
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

function ResumoCard({
  titulo,
  valor,
  cor = 'blue',
  icon,
}: {
  titulo: string;
  valor: number | string;
  cor?: 'blue' | 'orange' | 'green';
  icon: React.ReactNode;
}) {
  const corTexto =
    cor === 'orange'
      ? 'text-orange-600'
      : cor === 'green'
      ? 'text-green-600'
      : 'text-blue-700';

  return (
    <div className="bg-white p-5 rounded-xl shadow border flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{titulo}</p>
        <p className={`text-2xl font-semibold ${corTexto}`}>{valor}</p>
      </div>
      <div className="ml-3">{icon}</div>
    </div>
  );
}

function LinkCard({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <div className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 text-blue-700 font-medium shadow-sm transition cursor-pointer text-center">
        {label}
      </div>
    </Link>
  );
}