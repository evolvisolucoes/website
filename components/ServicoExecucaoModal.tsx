'use client';

import { useEffect, useState } from 'react';
import { Empresa, Certificado, Agendamento } from '@/types_db';

type Props = {
	servico: any;
	onClose: () => void;
	onExecutar: (info: { certificadoId: string; empresasSelecionadas: string[]; dataExecucao: string }) => void;
	empresas: Empresa[];
	certificados: Certificado[];
	existingAgendamento?: Agendamento | null;
};

export default function ServicoExecucaoModal({
	servico,
	onClose,
	onExecutar,
	empresas,
	certificados,
	existingAgendamento = null,
}: Props) {
	const [certificadoSelecionado, setCertificadoSelecionado] = useState<string>('');
	const [empresasSelecionadas, setEmpresasSelecionadas] = useState<string[]>([]);
	const [dataExecucao, setDataExecucao] = useState<string>('');

	useEffect(() => {
		if (existingAgendamento) {
			setCertificadoSelecionado(existingAgendamento.certificado_id);
			setEmpresasSelecionadas(existingAgendamento.empresa_ids);
			setDataExecucao(existingAgendamento.data_execucao);
		} else {
			setCertificadoSelecionado('');
			setEmpresasSelecionadas([]);
			setDataExecucao('');
		}
	}, [existingAgendamento]);

	function toggleEmpresa(id: string) {
		if (empresasSelecionadas.includes(id)) {
			setEmpresasSelecionadas(empresasSelecionadas.filter((e) => e !== id));
		} else {
			setEmpresasSelecionadas([...empresasSelecionadas, id]);
		}
	}

	function handleSubmit() {
		if (!certificadoSelecionado) {
			alert('Selecione um certificado.');
			return;
		}
		if (empresasSelecionadas.length === 0) {
			alert('Selecione ao menos uma empresa.');
			return;
		}
		if (!dataExecucao) {
			alert('Selecione uma data de execução.');
			return;
		}

		onExecutar({
			certificadoId: certificadoSelecionado,
			empresasSelecionadas,
			dataExecucao,
		});
	}

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
				<h2 className="text-xl font-semibold mb-4 text-blue-700">
					{existingAgendamento ? 'Alterar Agendamento' : 'Novo Agendamento'} - {servico.nome}
				</h2>

				{/* Certificado */}
				<div className="mb-4">
					<label className="block mb-1 font-medium text-gray-700">Certificado</label>
					<select
						value={certificadoSelecionado}
						onChange={(e) => setCertificadoSelecionado(e.target.value)}
						className="w-full border border-gray-300 rounded px-3 py-2"
					>
						<option value="">-- Selecione --</option>
						{certificados.map((cert) => (
							<option key={cert.id} value={cert.id}>
								{cert.id}
							</option>
						))}
					</select>
				</div>

				{/* Empresas */}
				<div className="mb-4">
					<label className="block mb-1 font-medium text-gray-700">Empresas</label>
					<div className="max-h-40 overflow-auto border border-gray-300 rounded p-2">
						{empresas.map((empresa) => (
							<label
								key={empresa.id}
								className="flex items-center mb-1 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={empresasSelecionadas.includes(empresa.id)}
									onChange={() => toggleEmpresa(empresa.id)}
									className="mr-2"
								/>
								<span>{empresa.nome}</span>
							</label>
						))}
					</div>
				</div>

				{/* Data de Execução */}
				<div className="mb-4">
					<label className="block mb-1 font-medium text-gray-700">Data de Execução</label>
					<input
						type="date"
						value={dataExecucao}
						onChange={(e) => setDataExecucao(e.target.value)}
						className="w-full border border-gray-300 rounded px-3 py-2"
					/>
				</div>

				{/* Botões */}
				<div className="flex justify-end space-x-3 mt-6">
					<button
						onClick={onClose}
						className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
					>
						Cancelar
					</button>
					<button
						onClick={handleSubmit}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						{existingAgendamento ? 'Salvar Alterações' : 'Agendar'}
					</button>
				</div>
			</div>
		</div>
	);
}
