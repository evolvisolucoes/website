// app/user/servicos/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getUsuarioLogado,
  getTodosOsServicos,
  getSlugServicoPorId,
  getProximoAgendamentoServico,
} from '@/lib/supabaseService';
import { format } from 'date-fns';
import { Agendamento, ServicoDetalhado } from 'types_db';

function ServicoCardEstatico({ servico }: { servico: ServicoDetalhado }) {
  return (
    <div className="bg-white p-4 rounded shadow border flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-blue-700">{servico.nome}</h2>
        <p className="text-sm text-gray-600 mb-4">{servico.descricao}</p>
      </div>
      <Link
          href={getSlugServicoPorId(servico.id)}
          className="inline-block mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-start"
      >
          Acessar
      </Link>
    </div>
  );
}

function ServicoCardComAgendamento({ servico, userId }: { servico: ServicoDetalhado; userId: string }) {
    const [agendamento, setAgendamento] = useState<Agendamento | undefined>(undefined);
    const [loadingAgendamento, setLoadingAgendamento] = useState(true);

    useEffect(() => {
        const fetchAgendamento = async () => {
            setLoadingAgendamento(true);
            const proximo = await getProximoAgendamentoServico(userId, servico.id);
            setAgendamento(proximo);
            setLoadingAgendamento(false);
        };
        fetchAgendamento();
    }, [userId, servico.id]);


    return (
        <div className="bg-white p-4 rounded shadow border flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold text-blue-700">{servico.nome}</h2>
              <p className="text-sm text-gray-600">{servico.descricao}</p>

              {loadingAgendamento ? (
                  <p className="text-sm text-gray-500 mt-2">Buscando agendamento...</p>
              ) : agendamento ? (
                  <p className="text-sm text-green-700 mt-2">
                      🔄 Próximo agendamento:{' '}
                      <strong>{format(new Date(agendamento.data_execucao), 'dd/MM/yyyy')}</strong>
                  </p>
              ) : (
                  <p className="text-sm text-gray-500 mt-2">Sem agendamento futuro</p>
              )}
            </div>

            <Link
                href={getSlugServicoPorId(servico.id)}
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-start"
            >
                Acessar
            </Link>
        </div>
    );
}

export default function ServicosPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [servicosState, setServicosState] = useState<ServicoDetalhado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const u = await getUsuarioLogado();
      if (u) {
        setUsuario(u);
        setServicosState(await getTodosOsServicos());
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !usuario) return <p>Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">📦 Serviços Disponíveis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicosState.map((s) => {
          if (s.tipo === 'embed') {
            return <ServicoCardEstatico key={s.id} servico={s} />;
          } else {
            return <ServicoCardComAgendamento key={s.id} servico={s} userId={usuario.id} />;
          }
        })}
      </div>
    </div>
  );
}