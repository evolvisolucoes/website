'use client';

import { useEffect, useState, useCallback } from 'react';
import {
	getAgendamentos,
	getUsuarioPorId,
	getEmpresasPorIds,
	getCertificados,
	simularExecucaoServico,
} from '@/lib/supabaseService';
import { Agendamento, Usuario, Empresa, Certificado } from '@/types_db';

export default function AdminServicosPage() {
	type StatusFiltro = 'todos' | 'pendente' | 'concluido' | 'erro';

	const [lista, setLista] = useState<Agendamento[]>([]);
	const [filtro, setFiltro] = useState<StatusFiltro>('todos');
	const [busca, setBusca] = useState('');
    const [loading, setLoading] = useState(true);

    const [usuariosCache, setUsuariosCache] = useState<Map<string, Usuario>>(new Map());
    const [empresasCache, setEmpresasCache] = useState<Map<string, Empresa>>(new Map());
    const [certificadosCache, setCertificadosCache] = useState<Map<string, Certificado>>(new Map());


    const fetchDataAndPopulateCache = useCallback(async () => {
        setLoading(true);
        const fetchedAgendamentos = await getAgendamentos();
        setLista(fetchedAgendamentos);

        const userIds = Array.from(new Set(fetchedAgendamentos.map(a => a.user_id)));
        const usersData = await Promise.all(userIds.map(id => getUsuarioPorId(id)));
        const userMap = new Map<string, Usuario>();
        usersData.forEach(user => { if (user) userMap.set(user.id, user); });
        setUsuariosCache(userMap);

        const empresaIds = Array.from(new Set(fetchedAgendamentos.flatMap(a => a.empresa_ids || [])));
        const empresasData = await getEmpresasPorIds(empresaIds);
        const empresaMap = new Map<string, Empresa>();
        empresasData.forEach(emp => { if (emp) empresaMap.set(emp.id, emp); });
        setEmpresasCache(empresaMap);

        const certsData = await getCertificados();
        const certMap = new Map<string, Certificado>();
        certsData.forEach(cert => { if (cert) certMap.set(cert.id, cert); });
        setCertificadosCache(certMap);

        setLoading(false);
    }, []);


	useEffect(() => {
		fetchDataAndPopulateCache();
	}, [fetchDataAndPopulateCache, filtro, busca]);

    const agendamentosFiltrados = lista.filter((a) => {
        const matchStatus = filtro === 'todos' ? true : a.status === filtro;
        const user = usuariosCache.get(a.user_id);
        const matchBusca =
            !busca ||
            a.servico_nome.toLowerCase().includes(busca.toLowerCase()) ||
            user?.nome?.toLowerCase().includes(busca.toLowerCase());

        return matchStatus && matchBusca;
    });

	const handleExecutar = async (id: number) => {
		await simularExecucaoServico(id);
		await fetchDataAndPopulateCache();
	};

    if (loading) return <p>Carregando gestão de serviços...</p>;

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-blue-700">🛠️ Gestão de Serviços</h1>

			{/* Filtro */}
			<div className="flex gap-4 items-center">
				<label className="text-sm font-medium">Filtrar por status:</label>
				<select
					className="border px-2 py-1 rounded"
					value={filtro}
					onChange={(e) => setFiltro(e.target.value as StatusFiltro)}
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
					{agendamentosFiltrados.length === 0 ? (
						<tr>
							<td colSpan={7} className="p-4 text-center text-gray-500">Nenhum serviço encontrado.</td>
						</tr>
					) : (
						agendamentosFiltrados.map((a) => {
							const user = usuariosCache.get(a.user_id);
							const empNomes = a.empresa_ids?.map(id => empresasCache.get(id)?.nome || '').filter(Boolean).join(', ') || '—';
							const cert = certificadosCache.get(a.certificado_id);

							return (
								<tr key={a.id} className="border-t">
									<td className="p-2">{a.servico_nome}</td>
									<td className="p-2">{user?.nome || '—'}</td>
									<td className="p-2">{empNomes}</td>
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