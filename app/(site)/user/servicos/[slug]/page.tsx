// app/user/servicos/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  getUsuarioLogado,
  getServicoDisponivelPorId,
  getAgendamentosPorServico,
  getEmpresasDoUsuario,
  getCertificadosDoUsuario,
  simularExecucaoServico,
  adicionarAgendamento,
  Empresa,
  Certificado,
  Agendamento,
} from '@/lib/mockDB';
import { format } from 'date-fns';

export default function ServicoDetalhePage() {
  const { slug } = useParams();
  const [usuario, setUsuario] = useState<any>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [certificadoId, setCertificadoId] = useState('');
  const [empresasSelecionadas, setEmpresasSelecionadas] = useState<string[]>([]);
  const [dataExecucao, setDataExecucao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const servico = getServicoDisponivelPorId(slug as string);

  useEffect(() => {
    const user = getUsuarioLogado();
    if (user) {
      setUsuario(user);
      setEmpresas(getEmpresasDoUsuario(user.id));
      setCertificados(getCertificadosDoUsuario(user.id));
      setAgendamentos(getAgendamentosPorServico(user.id, slug as string));
    }
  }, [slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!dataExecucao || !certificadoId || empresasSelecionadas.length === 0) {
      setErro('Preencha todos os campos para agendar.');
      return;
    }

    try {
      adicionarAgendamento({
        user_id: usuario.id,
        servico_id: slug as string,
        servico_nome: servico?.nome || 'Serviço',
        certificado_id: certificadoId,
        empresa_ids: empresasSelecionadas,
        data_execucao: dataExecucao,
      });
      setAgendamentos(getAgendamentosPorServico(usuario.id, slug as string));
      setSucesso('Agendamento criado com sucesso!');
    } catch (e: any) {
      setErro(e.message);
    }
  };

  const simular = (id: number) => {
    simularExecucaoServico(id);
    setAgendamentos(getAgendamentosPorServico(usuario.id, slug as string));
  };

  if (!usuario || !servico) return <p>Carregando...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-blue-700">🔧 {servico.nome}</h1>
      <p className="text-gray-600">{servico.descricao}</p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold text-blue-700">📅 Agendar Execução</h2>

        <input
          type="date"
          value={dataExecucao}
          onChange={(e) => setDataExecucao(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />

        <select
          value={certificadoId}
          onChange={(e) => setCertificadoId(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="">Selecione um certificado</option>
          {certificados.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} - {c.tipo}
            </option>
          ))}
        </select>

        <div>
          <label className="block mb-1 font-medium">Empresas</label>
          {empresas.map((e) => (
            <label key={e.id} className="block text-sm">
              <input
                type="checkbox"
                checked={empresasSelecionadas.includes(e.id)}
                onChange={() =>
                  setEmpresasSelecionadas((prev) =>
                    prev.includes(e.id)
                      ? prev.filter((id) => id !== e.id)
                      : [...prev, e.id]
                  )
                }
              />
              <span className="ml-2">{e.nome} ({e.cnpj})</span>
            </label>
          ))}
        </div>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm">{sucesso}</p>}

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Agendar Serviço
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold text-blue-700 mt-6">📁 Agendamentos Realizados</h2>
        <ul className="space-y-4 mt-4">
          {agendamentos.map((a) => (
            <li key={a.id} className="bg-white p-4 rounded shadow border">
              <p><strong>Data:</strong> {format(new Date(a.data_execucao), 'dd/MM/yyyy')}</p>
              <p><strong>Status:</strong> {a.status}</p>

              {a.arquivos_gerados.length > 0 ? (
                <ul className="list-disc ml-5 mt-2">
                  {a.arquivos_gerados.map((arq, i) => (
                    <li key={i}>
                      <a href={arq} className="text-blue-600 underline" download>
                        Download {i + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-2">Nenhum arquivo gerado ainda.</p>
              )}

              {a.status === 'pendente' && (
                <button
                  onClick={() => simular(a.id)}
                  className="mt-2 text-sm text-orange-600 underline"
                >
                  Simular Execução
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
