'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  getUsuarioLogado,
  getServicoPorId,
  getAgendamentosPorServico,
  getEmpresasDoUsuario,
  getCertificadosDoUsuario,
  simularExecucaoServico,
  adicionarAgendamento,
} from '@/lib/supabaseService';
import { Empresa, Certificado, Agendamento, ServicoDetalhado } from '@/types_db';
import { format } from 'date-fns';

const ServicoAgendavel = ({ servico }: { servico: ServicoDetalhado }) => {
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

    useEffect(() => {
        const fetchDadosAgendamento = async () => {
            const user = await getUsuarioLogado();
            if (user) {
                setUsuario(user);
                setEmpresas(await getEmpresasDoUsuario(user.id));
                setCertificados(await getCertificadosDoUsuario(user.id));
                setAgendamentos(await getAgendamentosPorServico(user.id, slug as string));
            }
        };
        fetchDadosAgendamento();
    }, [slug]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setSucesso('');
    
        if (!dataExecucao || !certificadoId || empresasSelecionadas.length === 0) {
          setErro('Preencha todos os campos para agendar.');
          return;
        }
    
        if (!usuario || !servico) {
            setErro('Dados do usuário ou serviço não carregados.');
            return;
        }
    
        try {
          await adicionarAgendamento({
            user_id: usuario.id,
            servico_id: slug as string,
            servico_nome: servico.nome || 'Serviço',
            certificado_id: certificadoId,
            empresa_ids: empresasSelecionadas,
            data_execucao: dataExecucao,
          });
          setAgendamentos(await getAgendamentosPorServico(usuario.id, slug as string));
          setSucesso('Agendamento criado com sucesso!');
          setCertificadoId('');
          setEmpresasSelecionadas([]);
          setDataExecucao('');
    
        } catch (e: any) {
          setErro(e.message);
        }
    };
    
    const simular = async (id: number) => {
        if (!usuario) return;
        await simularExecucaoServico(id);
        setAgendamentos(await getAgendamentosPorServico(usuario.id, slug as string));
    };

    return (
        <div className="space-y-8">
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
                        <option key={c.id} value={c.id}>{c.id} - {c.tipo}</option>
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
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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

const ServicoEstatico = ({ servico }: { servico: ServicoDetalhado }) => {
    if (servico.tipo !== 'embed') return null;

    return (
        <div className="bg-white rounded shadow" style={{ height: '80vh' }}>
            <iframe
                src={servico.embedUrl}
                title={servico.nome}
                style={{ width: '100%', height: '100%' }}
                allowFullScreen
            />
        </div>
    );
};

export default function ServicoDetalhePage() {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [servico, setServico] = useState<ServicoDetalhado | undefined>(undefined);

    useEffect(() => {
        const fetchServicoData = async (serviceSlug: string) => {
            setLoading(true);
            const servicoData = await getServicoPorId(serviceSlug);
            setServico(servicoData);
            setLoading(false);
        };

        if (slug) {
            fetchServicoData(slug as string);
        }
    }, [slug]);
    
    if (loading) return <p>Carregando...</p>;
    if (!servico) return <p>Serviço não encontrado.</p>;

    return (
        <div className="space-y-2">
            <h1 className="text-2xl font-bold text-blue-700">🔧 {servico.nome}</h1>
            <p className="text-gray-600">{servico.descricao}</p>
            
            {servico.tipo === 'embed' && <ServicoEstatico servico={servico} />}
            {servico.tipo === 'agendavel' && <ServicoAgendavel servico={servico} />}
        </div>
    );
}