'use client';

import { useEffect, useState } from 'react';
import {
	getUsuarioLogado,
	getCertificadosDoUsuario,
	getEmpresasDoUsuario,
	servicosDisponiveis,
	adicionarAgendamento,
	getAgendamentosDoUsuario,
	Usuario,
	Empresa,
	Certificado,
	Agendamento,
	staticServices
} from '@/lib/mockDB';
import ServicoExecucaoModal from '@/components/ServicoExecucaoModal';
import { format, isAfter, isBefore, startOfDay, isEqual } from 'date-fns';

export default function ServicosPage() {
	const [usuario, setUsuario] = useState<Usuario | null>(null);
	const [certificados, setCertificados] = useState<Certificado[]>([]);
	const [empresas, setEmpresas] = useState<Empresa[]>([]);
	const [servicoSelecionado, setServicoSelecionado] = useState<any | null>(null);
	const [editarAgendamento, setEditarAgendamento] = useState<Agendamento | null>(null);
	const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
	const [showEmbed, setShowEmbed] = useState(false);
	const [embedUrl, setEmbedUrl] = useState("");

	useEffect(() => {
		const u = getUsuarioLogado();
		if (u) {
			setUsuario(u);
			setCertificados(getCertificadosDoUsuario(u.id));
			setEmpresas(getEmpresasDoUsuario(u.id));
			setAgendamentos(getAgendamentosDoUsuario(u.id));
		}
	}, []);

	if (!usuario) return <p>Carregando...</p>;

	const hoje = startOfDay(new Date());

	const agendamentosFuturos = agendamentos.filter((a) => {
		const dataExec = startOfDay(new Date(a.data_execucao));
		return isAfter(dataExec, hoje) || isEqual(dataExec, hoje);
	});

	const agendamentosPassados = agendamentos.filter((a) => {
		const dataExec = startOfDay(new Date(a.data_execucao));
		return isBefore(dataExec, hoje);
	});

	const abrirServicoEmbedado = (url: string) => {
		setEmbedUrl(url);
		setShowEmbed(true);
	};

	function agendamentoAtualDoServico(servicoId: string): Agendamento | undefined {
		const mesAtual = new Date().toISOString().slice(0, 7);
		return agendamentos.find(
			(a) =>
				a.servico_id === servicoId &&
				a.data_execucao.slice(0, 7) === mesAtual
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-blue-700">📦 Serviços Disponíveis</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{servicosDisponiveis.map((s) => {
					const agendamentoAtual = agendamentoAtualDoServico(s.id);

					return (
						<div key={s.id} className="bg-white p-4 rounded shadow border">
							<h2 className="text-lg font-semibold text-blue-700">{s.nome}</h2>
							<p className="text-sm text-gray-600">{s.descricao}</p>

							{agendamentoAtual ? (
								<div className="mt-4 text-sm text-gray-700">
									<p>✅ Agendado para: <strong>{format(new Date(agendamentoAtual.data_execucao), 'dd/MM/yyyy')}</strong></p>
									<button
										onClick={() => {
											setServicoSelecionado(s);
											setEditarAgendamento(agendamentoAtual);
										}}
										className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
									>
										Alterar data
									</button>
								</div>
							) : (
								<button
									onClick={() => {
										setServicoSelecionado(s);
										setEditarAgendamento(null);
									}}
									className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
								>
									Executar
								</button>
							)}
						</div>
					);
				})}
				{/* Serviços embedados (sem agendamento) */}
				{staticServices.map((s) => (
					<div key={s.id} className="bg-white p-4 rounded shadow border">
						<h2 className="text-lg font-semibold text-blue-700">{s.nome}</h2>
						<p className="text-sm text-gray-600">{s.descricao}</p>
						<button
							onClick={() => abrirServicoEmbedado(s.embedUrl)}
							className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
						>
							Abrir Serviço
						</button>
					</div>
				))}
			</div>

			{servicoSelecionado && (
				<ServicoExecucaoModal
					servico={servicoSelecionado}
					onClose={() => {
						setServicoSelecionado(null);
						setEditarAgendamento(null);
					}}
					empresas={empresas}
					certificados={certificados}
					existingAgendamento={editarAgendamento}
					onExecutar={(info: {
						certificadoId: string;
						empresasSelecionadas: string[];
						dataExecucao: string;
					}) => {
						if (!usuario) return;

						try {
							// sobrescreve ou adiciona novo
							adicionarAgendamento({
								id: editarAgendamento?.id,
								user_id: usuario.id,
								servico_id: servicoSelecionado.id,
								servico_nome: servicoSelecionado.nome,
								certificado_id: info.certificadoId,
								empresa_ids: info.empresasSelecionadas,
								data_execucao: info.dataExecucao,
							});

							alert('Serviço agendado com sucesso!');
							setServicoSelecionado(null);
							setEditarAgendamento(null);
							setAgendamentos(getAgendamentosDoUsuario(usuario.id));
						} catch (err: any) {
							alert(err.message);
						}
					}}
				/>
			)}
			
			{/* Modal de serviço embedado */}
			{showEmbed && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white w-full max-w-4xl h-[80vh] rounded shadow-lg relative">
						<button
							onClick={() => setShowEmbed(false)}
							className="absolute top-2 right-2 text-gray-700 hover:text-red-600"
						>
							✕
						</button>
						<iframe
							src={embedUrl}
							className="w-full h-full rounded-b"
							title="Conteúdo do Serviço"
						/>
					</div>
				</div>
			)}

			{/* AGENDAMENTOS FUTUROS */}
			<div>
				<h2 className="text-xl font-semibold text-blue-700 mt-10">📅 Agendamentos Futuros</h2>
				<div className="mt-4 space-y-3">
					{agendamentosFuturos.length === 0 ? (
						<p className="text-sm text-gray-600">Nenhum serviço agendado para o futuro.</p>
					) : (
						agendamentosFuturos.map((a) => (
							<div key={a.servico_id + a.data_execucao} className="border p-4 rounded bg-gray-50">
								<h3 className="text-md font-medium text-gray-800">{a.servico_nome}</h3>
								<p className="text-sm text-gray-600">Data: {format(new Date(a.data_execucao), 'dd/MM/yyyy')}</p>
							</div>
						))
					)}
				</div>
			</div>

			{/* HISTÓRICO DOS SERVIÇOS EXECUTADOS */}
			<div>
				<h2 className="text-xl font-semibold text-blue-700 mt-10">📁 Histórico de Serviços Executados</h2>
				<div className="mt-4 space-y-3">
					{agendamentosPassados.length === 0 ? (
						<p className="text-sm text-gray-600">Nenhum serviço executado até o momento.</p>
					) : (
						agendamentosPassados.map((a) => (
							<div key={a.servico_id + a.data_execucao} className="border p-4 rounded bg-gray-50">
								<h3 className="text-md font-medium text-gray-800">{a.servico_nome}</h3>
								<p className="text-sm text-gray-600">Data: {format(new Date(a.data_execucao), 'dd/MM/yyyy')}</p>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
