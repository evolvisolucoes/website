'use client';

import { pagarFatura, faturas as faturasMock, getUsuarioPorId } from '@/lib/mockDB';
import { useState, useEffect } from 'react';

export default function FaturamentoPage() {
	const [faturas, setFaturas] = useState<any[]>([]);

	useEffect(() => {
		// carrega faturas mockadas
		setFaturas(faturasMock);
	}, []);

	const handlePagar = (id: number) => {
		pagarFatura(id);
		setFaturas([...faturasMock]); // atualiza localmente
	};

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
					{faturas.map((f) => {
						const user = getUsuarioPorId(f.user_id);
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
					})}
				</tbody>
			</table>
		</div>
	);
}
