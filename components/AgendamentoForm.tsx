'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { agendarServico, getFaturasDoUsuario, getUsuarioPorId, getUsuarioLogado, getCertificadosDoUsuario, getEmpresasDoUsuario } from '@/lib/mockDB';

export default function AgendamentoForm({ servicoId }: { servicoId: string }) {
	const [certificados, setCertificados] = useState<any[]>([]);
	const [empresas, setEmpresas] = useState<any[]>([]);
	const [certificadoId, setCertificadoId] = useState('');
	const [empresaIds, setEmpresaIds] = useState<string[]>([]);
	const [dataExecucao, setDataExecucao] = useState('');
	const [bloqueado, setBloqueado] = useState(false);
	const [usuario, setUsuario] = useState<any>(null);

	//   useEffect(() => {
	//     async function fetchData() {
	//       const user = await supabaseBrowser.auth.getUser();
	//       const { data: certs } = await supabaseBrowser.from('certificados').select('*').eq('user_id', user.data.user?.id);
	//       const { data: emps } = await supabaseBrowser.from('empresas').select('*').eq('user_id', user.data.user?.id);
	//       setCertificados(certs || []);
	//       setEmpresas(emps || []);
	//     }
	//     fetchData();
	//   }, []);

	//   const handleSubmit = async (e: React.FormEvent) => {
	//     e.preventDefault();
	//     const user = await supabaseBrowser.auth.getUser();
	//     await supabaseBrowser.from('agendamentos').insert({
	//       user_id: user.data.user?.id,
	//       servico_id: servicoId,
	//       certificado_id: certificadoId,
	//       empresa_ids: empresaIds,
	//       data_execucao: dataExecucao,
	//       status: 'pendente',
	//       arquivos_gerados: null,
	//     });
	//   };

	useEffect(() => {
		async function fetchData() {
			const user = getUsuarioLogado();
			if (!user) return;

			const faturas = getFaturasDoUsuario(user.id);
			const inadimplente = faturas.some(f => f.status === 'Pendente');

			if (!user.ativo || inadimplente) {
				setBloqueado(true);
			} else {
				setBloqueado(false);
			}

			setUsuario(user);
			setCertificados(getCertificadosDoUsuario(user.id));
			setEmpresas(getEmpresasDoUsuario(user.id));
		}

		fetchData();
	}, []);


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const user = await supabaseBrowser.auth.getUser();

		if (!user.data.user?.id) return;

		agendarServico({
			user_id: user.data.user.id,
			servico_id: servicoId,
			servico_nome: servicoId,
			certificado_id: certificadoId,
			empresa_ids: empresaIds,
			data_execucao: dataExecucao,
			status: 'pendente',
			arquivos_gerados: [],
		});

		alert('Serviço agendado!');
		setCertificadoId('');
		setEmpresaIds([]);
		setDataExecucao('');
	};


	return (<>
		{bloqueado && (
			<div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
				Você não pode agendar serviços no momento. Verifique seu plano ou pagamentos pendentes.
			</div>
		)}

		{!bloqueado && (
			<form onSubmit={handleSubmit} className="space-y-4">
				<label>Certificado</label>
				<select value={certificadoId} onChange={(e) => setCertificadoId(e.target.value)} required>
					<option value="">Selecione</option>
					{certificados.map((c) => (
						<option key={c.id} value={c.id}>{c.nome}</option>
					))}
				</select>

				<label>Empresas</label>
				<select multiple value={empresaIds} onChange={(e) => setEmpresaIds(Array.from(e.target.selectedOptions, o => o.value))} required>
					{empresas.map((e) => (
						<option key={e.id} value={e.id}>{e.nome} ({e.cnpj})</option>
					))}
				</select>

				<label>Data de Execução</label>
				<input type="date" value={dataExecucao} onChange={(e) => setDataExecucao(e.target.value)} required />

				<button type="submit">Agendar Serviço</button>
			</form>
		)}</>
	);
}
