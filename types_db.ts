export type Usuario = {
	id: string;
	nome: string;
	email: string;
	senha: string;
	plano: 'Free' | 'Pro';
	ativo: boolean;
	role: 'admin' | 'user';
	dia_agendamento?: number;
};

export type Empresa = {
	id: string;
	user_id: string;
	nome: string;
	cnpj: string;
};

export type Certificado = {
	id: string;
	user_id: string;
	tipo: 'A1' | 'A3';
	vencimento: string;
};

export type Fatura = {
	id: number;
	user_id: string;
	valor: number;
	status: 'Pago' | 'Pendente';
	vencimento: string;
};

export type Servico = {
	id: number;
	user_id: string;
	servico: string;
	status: 'Sucesso' | 'Erro';
	data: string;
};

export type Agendamento = {
	id: number;
	user_id: string;
	servico_id: string;
	servico_nome: string;
	certificado_id: string;
	empresa_ids: string[];
	data_execucao: string;
	status: 'pendente' | 'concluido' | 'erro';
	arquivos_gerados: string[];
	data_geracao?: string;
};

export type ServicosDisponiveis = {
	id: string;
	nome: string;
	descricao: string;
	tipo: 'agendavel';
};

export type ServicosEstaticos = {
	id: string;
	nome: string;
	descricao: string;
	tipo: 'embed';
	embed_url: string;
};

export type ServicoDetalhado = ServicosDisponiveis | ServicosEstaticos;