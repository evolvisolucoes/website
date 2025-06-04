'use client';
import { Key, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AgendamentoForm from '@/components/AgendamentoForm';
import { getUsuarioLogado, getAgendamentosPorServico, getEmpresasDoUsuario, simularExecucaoServico } from '@/lib/mockDB';

export default function ServicoDetalhe() {
	const { slug } = useParams();
	const [usuario, setUsuario] = useState<any>(null);
	const [agendamentos, setAgendamentos] = useState<any[]>([]);

	useEffect(() => {
		const user = getUsuarioLogado();
		if (user) {
			setUsuario(user);
			setAgendamentos(getAgendamentosPorServico(user.id, slug as string));
		}
	}, [slug]);

	const handleSimularExecucao = (id: number) => {
		simularExecucaoServico(id);
		const user = getUsuarioLogado();
		if (user) {
			setAgendamentos(getAgendamentosPorServico(user.id, slug as string));
		}
	};


	if (!usuario) return <p>Carregando...</p>;

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">🔧 Serviço: {slug}</h1>

			<AgendamentoForm servicoId={slug as string} />

			<div className="mt-6">
				<h2 className="text-lg font-semibold">Agendamentos Realizados</h2>
				<ul className="space-y-4">
					{agendamentos.map((ag) => (
						<li key={ag.id} className="p-4 bg-white shadow rounded">
							<p><strong>Data:</strong> {ag.data_execucao}</p>
							<p><strong>Empresas:</strong> {ag.empresa_ids.length}</p>
							<p><strong>Status:</strong> {ag.status}</p>
							{ag.arquivos_gerados?.length > 0 ? (
								<div className="mt-2">
									<p><strong>Arquivos:</strong></p>
									<ul className="list-disc ml-6">
										{ag.arquivos_gerados.map((file: string | undefined, i: number) => (
											<li key={i}><a href={file} download className="text-blue-600 underline">Arquivo {i + 1}</a></li>
										))}
									</ul>
									<button
										onClick={() => handleSimularExecucao(ag.id)}
										className="mt-2 text-sm text-blue-600 underline"
									>
										Simular execução
									</button>

								</div>
							) : (
								<p className="text-sm text-gray-500">Nenhum arquivo disponível ainda.</p>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
