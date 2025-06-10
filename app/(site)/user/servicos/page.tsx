// app/user/servicos/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getUsuarioLogado,
  servicosDisponiveis,
  getAgendamentosDoUsuario,
  getSlugServicoPorId,
  getProximoAgendamentoServico,
  Agendamento,
} from '@/lib/mockDB';
import { format } from 'date-fns';

export default function ServicosPage() {
  const [usuario, setUsuario] = useState<any>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    const u = getUsuarioLogado();
    if (u) {
      setUsuario(u);
      setAgendamentos(getAgendamentosDoUsuario(u.id));
    }
  }, []);

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">📦 Serviços Disponíveis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicosDisponiveis.map((s) => {
          const agendamento = getProximoAgendamentoServico(usuario.id, s.id);

          return (
            <div key={s.id} className="bg-white p-4 rounded shadow border">
              <h2 className="text-lg font-semibold text-blue-700">{s.nome}</h2>
              <p className="text-sm text-gray-600">{s.descricao}</p>

              {agendamento ? (
                <p className="text-sm text-green-700 mt-2">
                  🔄 Próximo agendamento:{' '}
                  <strong>{format(new Date(agendamento.data_execucao), 'dd/MM/yyyy')}</strong>
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-2">Sem agendamento futuro</p>
              )}

              <Link
                href={getSlugServicoPorId(s.id)}
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Acessar
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
