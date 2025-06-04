'use client';

import { useState, useEffect } from 'react';
import {
  getUsuarioLogado,
  getAgendamentosDoUsuario,
  getEmpresasPorIds,
  getCertificadoPorIds,
} from '@/lib/mockDB';

export default function HistoricoPage() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendente' | 'concluido'>('todos');
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const user = getUsuarioLogado();
    if (user) {
      const dados = getAgendamentosDoUsuario(user.id);
      console.log('Agendamentos carregados:', dados);
      setAgendamentos(dados);
    }
  }, []);

  const agsFiltrados = agendamentos.filter((a) =>
    filtroStatus === 'todos' ? true : a.status === filtroStatus
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">📄 Histórico de Serviços</h1>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium">Filtrar por status:</label>
        <select
          className="border px-2 py-1 rounded"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value as any)}
        >
          <option value="todos">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>

      {/* Tabela */}
      {agsFiltrados.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum serviço encontrado.</p>
      ) : (
        <table className="w-full text-sm border mt-4 bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Serviço</th>
              <th className="text-left p-2">Empresas</th>
              <th className="text-left p-2">Certificado</th>
              <th className="text-left p-2">Data</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Arquivos / Ações</th>
            </tr>
          </thead>
          <tbody>
            {agsFiltrados.map((a) => {
              const empresasObjs = getEmpresasPorIds(a.empresa_ids || []);
              const empresas = empresasObjs.length > 0 ? empresasObjs.map((e: any) => e?.nome || '—') : ['—'];
              const certificados = getCertificadoPorIds([a.certificado_id]);
              const certificado = certificados.length > 0 ? certificados[0] : null;
              const arquivos = a.arquivos_gerados || [];

              return (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium text-blue-700">{a.servico_nome || '—'}</td>
                  <td className="p-2 text-xs">{empresas.join(', ') || '—'}</td>
                  <td className="p-2 text-xs">{certificado?.id || '—'}</td>
                  <td className="p-2 text-xs">{a.data_execucao || a.data_geracao || '—'}</td>
                  <td className="p-2 capitalize text-xs">
                    <span className={`px-2 py-0.5 rounded ${a.status === 'concluido' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-2 space-y-1 text-xs">
                    {arquivos.length > 0 ? (
                      <>
                        <p className="text-gray-500 mb-1">Gerado em: {a.data_geracao || '—'}</p>
                        {arquivos.map((arq: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <a href={arq} download className="text-blue-600 underline">Download {i + 1}</a>
                            <button
                              onClick={() => setPreview(arq)}
                              className="text-gray-500 hover:text-blue-600 underline"
                            >
                              Visualizar
                            </button>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-gray-400">Nenhum arquivo</p>
                    )}
                    <button
                      onClick={() => {
                        // Simular reexecução
                        alert(`Reexecutando o serviço: ${a.servico_nome}`);
                      }}
                      className="text-xs text-orange-600 underline mt-2 block"
                    >
                      🔁 Reexecutar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Modal de visualização */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-xl w-full relative">
            <button
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2">Visualização do Arquivo</h2>
            <p className="text-sm text-gray-500 mb-4">(Conteúdo simulado)</p>
            <div className="bg-gray-100 p-3 text-xs font-mono h-64 overflow-y-auto">
              &lt;xml&gt;Simulação do conteúdo do arquivo XML...&lt;/xml&gt;
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
