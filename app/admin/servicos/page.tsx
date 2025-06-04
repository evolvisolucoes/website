'use client';

import { useEffect, useState } from 'react';
import {
	agendamentos,
	getUsuarioPorId,
	getEmpresasPorIds,
	certificados,
	simularExecucaoServico,
} from '@/lib/mockDB';

export default function AdminServicosPage() {
	type StatusFiltro = 'todos' | 'pendente' | 'concluido' | 'erro';

	const [lista, setLista] = useState<any[]>([]);
	const [filtro, setFiltro] = useState<StatusFiltro>('todos');
	const [busca, setBusca] = useState('');

	useEffect(() => {
		setLista(filtrarAgendamentos(filtro));
	}, [filtro]);

	const filtrarAgendamentos = (status: typeof filtro) => {
		if (status === 'todos') return agendamentos;
		return agendamentos.filter((a) => {
			const matchStatus = a.status === status;
			const user = getUsuarioPorId(a.user_id);
			const matchBusca =
				!busca ||
				a.servico_nome.toLowerCase().includes(busca.toLowerCase()) ||
				user?.nome?.toLowerCase().includes(busca.toLowerCase());

			return matchStatus && matchBusca;
		});

	};

	const handleExecutar = (id: number) => {
		simularExecucaoServico(id);
		setLista(filtrarAgendamentos(filtro));
	};

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-blue-700">🛠️ Gestão de Serviços</h1>

			{/* Filtro */}
			<div className="flex gap-4 items-center">
				<label className="text-sm font-medium">Filtrar por status:</label>
				<select
					className="border px-2 py-1 rounded"
					value={filtro}
					onChange={(e) => setFiltro(e.target.value as any)}
				>
					<option value="todos">Todos</option>
					<option value="pendente">Pendentes</option>
					<option value="concluido">Concluídos</option>
					<option value="erro">Erro</option>
				</select>

				<input
					type="text"
					placeholder="Buscar por serviço ou usuário"
					value={busca}
					onChange={(e) => setBusca(e.target.value)}
					className="border px-3 py-1 rounded w-full md:w-64"
				/>
			</div>

			{/* Tabela */}
			<table className="w-full text-sm border bg-white rounded shadow">
				<thead className="bg-gray-100">
					<tr>
						<th className="p-2 text-left">Serviço</th>
						<th className="p-2 text-left">Usuário</th>
						<th className="p-2 text-left">Empresas</th>
						<th className="p-2 text-left">Certificado</th>
						<th className="p-2 text-left">Data</th>
						<th className="p-2 text-left">Status</th>
						<th className="p-2 text-left">Ações</th>
					</tr>
				</thead>
				<tbody>
					{lista.length === 0 ? (
						<tr>
							<td colSpan={7} className="p-4 text-center text-gray-500">Nenhum serviço encontrado.</td>
						</tr>
					) : (
						lista.map((a) => {
							const user = getUsuarioPorId(a.user_id);
							const emp = getEmpresasPorIds(a.empresa_ids);
							const cert = certificados.find(c => c.id === a.certificado_id);

							return (
								<tr key={a.id} className="border-t">
									<td className="p-2">{a.servico_nome}</td>
									<td className="p-2">{user?.nome}</td>
									<td className="p-2">{emp.map(e => e.nome).join(', ')}</td>
									<td className="p-2">{cert?.id || '—'}</td>
									<td className="p-2">{a.data_execucao || a.data_geracao || '—'}</td>
									<td className="p-2 capitalize">{a.status}</td>
									<td className="p-2 space-y-1">
										{a.status === 'pendente' && (
											<button
												onClick={() => handleExecutar(a.id)}
												className="text-white bg-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-700"
											>
												Executar agora
											</button>
										)}

										{a.status === 'erro' && (
											<button
												onClick={() => handleExecutar(a.id)}
												className="text-orange-600 underline text-xs"
											>
												Reexecutar
											</button>
										)}

										{a.status === 'concluido' && (
											<ul className="text-xs">
												{a.arquivos_gerados.map((arq: string, i: number) => (
													<li key={i}>
														<a href={arq} download className="text-blue-600 underline">
															Arquivo {i + 1}
														</a>
													</li>
												))}
											</ul>
										)}
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
}
