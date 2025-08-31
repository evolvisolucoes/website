// app\admin\faturamento\page
'use client';

import { pagarFatura, getFaturas, getUsuarioPorId } from '@/lib/supabaseService';
import { useState, useEffect } from 'react';
import { Fatura, Usuario } from '@/types_db';

export default function FaturamentoPage() {
	const [faturas, setFaturas] = useState<Fatura[]>([]);
    const [usuariosCache, setUsuariosCache] = useState<Map<string, Usuario>>(new Map());
    const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
            setLoading(true);
            const fetchedFaturas = await getFaturas();
            setFaturas(fetchedFaturas);

            const userIds = Array.from(new Set(fetchedFaturas.map(f => f.user_id))).filter((id): id is string => typeof id === 'string');
            const usersData = await Promise.all(userIds.map(id => getUsuarioPorId(id)));
            const userMap = new Map<string, Usuario>();
            usersData.forEach(user => {
                if (user) userMap.set(user.id, user);
            });
            setUsuariosCache(userMap);
            setLoading(false);
        };
		fetchData();
	}, []);

	const handlePagar = async (id: number) => {
		await pagarFatura(id);
        const updatedFaturas = await getFaturas();
		setFaturas(updatedFaturas);
	};

    if (loading) return <p>Carregando faturas...</p>;

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Faturamento</h2>
			<table className="w-full text-sm border-separate border-spacing-y-2">
				<thead>
					<tr className="text-left text-gray-500">
						<th>Usuário</th>
						<th>Valor</th>
						<th>Status</th>
						<th>Vencimento</th>
						<th>Ação</th>
					</tr>
				</thead>
				<tbody>
					{faturas.length === 0 ? (
						<tr>
							<td colSpan={5} className="p-4 text-center text-gray-500">Nenhuma fatura encontrada.</td>
						</tr>
					) : (
						faturas.map((f: Fatura) => { // Tipo explícito para 'f' 
                            const user = f.user_id ? usuariosCache.get(f.user_id) : undefined; // Acessa do cache
							return (
								<tr key={f.id} className="bg-white shadow rounded">
									<td className="p-2">{user?.nome ?? '-'}</td>
									<td className="p-2">R$ {f.valor.toFixed(2)}</td>
									<td className="p-2">{f.status}</td>
									<td className="p-2">{f.vencimento}</td>
									<td className="p-2">
										{f.status === 'Pendente' && (
											<button
												onClick={() => handlePagar(f.id)}
												className="text-green-600 border border-green-600 px-2 py-1 rounded text-xs hover:bg-green-50 transition"
											>
												Marcar como paga
											</button>
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