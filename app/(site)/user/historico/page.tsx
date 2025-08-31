'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getUsuarioLogado,
  getAgendamentosDoUsuario,
  getEmpresasPorIds,
  getCertificadoPorIds,
  simularExecucaoServico,
} from '@/lib/supabaseService';
import { Empresa, Certificado, Usuario, Agendamento } from '@/types_db';

export default function HistoricoPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'pendente' | 'concluido' | 'erro'>('todos');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);

  const [empresasCache, setEmpresasCache] = useState<Map<string, Empresa>>(new Map());
  const [certificadosCache, setCertificadosCache] = useState<Map<string, Certificado>>(new Map());


  const fetchHistoricoData = useCallback(async (userId: string) => {
    setLoading(true);
    const fetchedAgendamentos = await getAgendamentosDoUsuario(userId);
    setAgendamentos(fetchedAgendamentos);

    const allEmpresaIds = Array.from(new Set(fetchedAgendamentos.flatMap(a => a.empresa_ids || [])));
    const allCertificadoIds = Array.from(new Set(fetchedAgendamentos.map(a => a.certificado_id).filter(Boolean)));

    const fetchedEmpresas = await getEmpresasPorIds(allEmpresaIds);
    const fetchedCertificados = await getCertificadoPorIds(allCertificadoIds);

    const empMap = new Map<string, Empresa>();
    fetchedEmpresas.forEach(emp => empMap.set(emp.id, emp));
    setEmpresasCache(empMap);

    const certMap = new Map<string, Certificado>();
    fetchedCertificados.forEach(cert => certMap.set(cert.id, cert));
    setCertificadosCache(certMap);

    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const user = await getUsuarioLogado();
      if (user) {
        setUsuarioId(user.id);
        await fetchHistoricoData(user.id);
      } else {
        setLoading(false);
      }
    };
    init();
  }, [fetchHistoricoData]);

  const agsFiltrados = agendamentos.filter((a) =>
    filtroStatus === 'todos' ? true : a.status === filtroStatus
  );

  const handleReexecutar = async (agendamentoId: number) => {
    if (usuarioId) {
      await simularExecucaoServico(agendamentoId);
      await fetchHistoricoData(usuarioId);
      alert(`Serviço reexecutado (simulado) para o agendamento ID: ${agendamentoId}`);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Carregando histórico...</p>;
  }
  if (!usuarioId) {
      return <p className="text-sm text-red-500">Faça login para ver o histórico.</p>;
  }

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
          <option value="erro">Erro</option>
        </select>
      </div>

      {/* Tabela */}
      {agsFiltrados.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum serviço encontrado.</p>
      ) : (
        <table className="w-full text-sm border mt-4 bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Serviço</th>
              <th className="p-2 text-left">Empresas</th>
              <th className="text-left p-2">Certificado</th>
              <th className="p-2 text-left">Data</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Arquivos / Ações</th>
            </tr>
          </thead>
          <tbody>
            {agsFiltrados.map((a) => {
              const empresasNomes = a.empresa_ids?.map(id => empresasCache.get(id)?.nome || '—').filter(Boolean).join(', ') || '—';
              const certificadoObj = certificadosCache.get(a.certificado_id);
              const arquivos = a.arquivos_gerados || [];

              return (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="p-2 font-medium text-blue-700">{a.servico_nome || '—'}</td>
                  <td className="p-2 text-xs">{empresasNomes}</td>
                  <td className="p-2 text-xs">{certificadoObj?.id || '—'}</td>
                  <td className="p-2 text-xs">{a.data_execucao || a.data_geracao || '—'}</td>
                  <td className="p-2 capitalize text-xs">
                    <span className={`px-2 py-0.5 rounded ${a.status === 'concluido' ? 'bg-green-100 text-green-700' : a.status === 'erro' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
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
                      onClick={() => handleReexecutar(a.id)}
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