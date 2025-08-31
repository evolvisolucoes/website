'use client';
import { useEffect, useState } from 'react';
import {
  getFaturasDoUsuario,
  getUsuarioLogado,
  getCertificadosDoUsuario,
  getEmpresasDoUsuario,
  adicionarAgendamento,
} from '@/lib/supabaseService';
import { Usuario, Certificado, Empresa } from '@/types_db';

export default function AgendamentoForm({ servicoId }: { servicoId: string }) {
	const [certificados, setCertificados] = useState<Certificado[]>([]);
	const [empresas, setEmpresas] = useState<Empresa[]>([]);
	const [certificadoId, setCertificadoId] = useState('');
	const [empresaIds, setEmpresaIds] = useState<string[]>([]);
	const [dataExecucao, setDataExecucao] = useState('');
	const [bloqueado, setBloqueado] = useState(false);
	const [usuario, setUsuario] = useState<Usuario | null>(null);

	useEffect(() => {
		async function fetchData() {
			const user = await getUsuarioLogado();
			if (!user) {
                setBloqueado(true);
                return;
            }

			const faturas = await getFaturasDoUsuario(user.id);
			const inadimplente = faturas.some(f => f.status === 'Pendente');

			if (!user.ativo || inadimplente) {
				setBloqueado(true);
			} else {
				setBloqueado(false);
			}

			setUsuario(user);
			setCertificados(await getCertificadosDoUsuario(user.id));
			setEmpresas(await getEmpresasDoUsuario(user.id));
		}

		fetchData();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

        if (!usuario || !usuario.id) {
            alert('Usuário não logado.');
            return;
        }

		try {
            await adicionarAgendamento({
                user_id: usuario.id,
                servico_id: servicoId,
                servico_nome: servicoId, // Aqui você pode querer buscar o nome real do serviço
                certificado_id: certificadoId,
                empresa_ids: empresaIds,
                data_execucao: dataExecucao,
                // status e arquivos_gerados são definidos por padrão na função do serviço
            });

            alert('Serviço agendado!');
            setCertificadoId('');
            setEmpresaIds([]);
            setDataExecucao('');
		} catch (error: any) {
            alert(`Erro ao agendar serviço: ${error.message}`);
            console.error('Erro ao agendar serviço:', error);
        }
	};

	return (<>
		{bloqueado && (
			<div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
				Você não pode agendar serviços no momento. Verifique seu plano ou pagamentos pendentes.
			</div>
		)}

		{!bloqueado && (
			<form onSubmit={handleSubmit} className="space-y-4">
				<label className="block mb-1 font-medium">Certificado</label>
				<select
                    value={certificadoId}
                    onChange={(e) => setCertificadoId(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                >
					<option value="">Selecione</option>
					{certificados.map((c) => (
						<option key={c.id} value={c.id}>{c.tipo} ({c.id})</option>
					))}
				</select>

				<label className="block mb-1 font-medium">Empresas</label>
				<select
                    multiple
                    value={empresaIds}
                    onChange={(e) => setEmpresaIds(Array.from(e.target.selectedOptions, o => o.value))}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                >
					{empresas.map((e) => (
						<option key={e.id} value={e.id}>{e.nome} ({e.cnpj})</option>
					))}
				</select>

				<label className="block mb-1 font-medium">Data de Execução</label>
				<input
                    type="date"
                    value={dataExecucao}
                    onChange={(e) => setDataExecucao(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                />

				<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Agendar Serviço
                </button>
			</form>
		)}</>
	);
}