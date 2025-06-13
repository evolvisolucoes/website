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

function salvar<T>(chave: string, dados: T[]) {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(chave, JSON.stringify(dados));
	}
}

function carregar<T>(chave: string, padrao: T[]): T[] {
	if (typeof localStorage !== 'undefined') {
		const dados = localStorage.getItem(chave);
		if (dados) return JSON.parse(dados);
	}
	return padrao;
}

function gerarId() {
	return Math.random().toString(36).substring(2, 9);
}

export let usuarios: Usuario[] = carregar('usuarios', [
	{ id: 'joao', nome: 'João Silva', email: 'joao@empresa.com', senha: '123456', plano: 'Pro', ativo: true, role: 'user', dia_agendamento: 5 },
	{ id: 'maria', nome: 'Maria Souza', email: 'maria@empresa.com', senha: '123456', plano: 'Free', ativo: false, role: 'user', dia_agendamento: 10 },
	{ id: 'admin', nome: 'Administrador', email: 'admin@admin', senha: 'admin123', plano: 'Pro', ativo: true, role: 'admin', dia_agendamento: 1 },
]);

export let empresas: Empresa[] = carregar('empresas', [
	{ id: 'e1', user_id: 'joao', nome: 'Empresa João Ltda', cnpj: '12.345.678/0001-99' },
	{ id: 'e2', user_id: 'maria', nome: 'Negócios Maria ME', cnpj: '98.765.432/0001-00' },
]);

export let certificados: Certificado[] = carregar('certificados', [
	{ id: 'c1', user_id: 'joao', tipo: 'A1', vencimento: '2025-12-31' },
	{ id: 'c2', user_id: 'maria', tipo: 'A3', vencimento: '2024-10-15' },
]);

export let faturas: Fatura[] = carregar('faturas', [
	{ id: 1, user_id: 'joao', valor: 99.9, status: 'Pago', vencimento: '2025-05-10' },
	{ id: 2, user_id: 'joao', valor: 99.9, status: 'Pendente', vencimento: '2025-06-10' },
	{ id: 3, user_id: 'maria', valor: 49.9, status: 'Pendente', vencimento: '2025-06-10' },
]);

export let servicos: Servico[] = carregar('servicos', [
	{ id: 1, user_id: 'joao', servico: 'Consulta DET', status: 'Sucesso', data: '2025-05-20' },
	{ id: 2, user_id: 'joao', servico: 'Verificar DAPI', status: 'Erro', data: '2025-05-22' },
	{ id: 3, user_id: 'maria', servico: 'Automatizar PJF', status: 'Sucesso', data: '2025-05-21' },
]);

export let agendamentos: Agendamento[] = carregar('agendamentos', [
	{ id: 1, user_id: 'joao', servico_id: '1', servico_nome: 'Consulta DET', certificado_id: '', empresa_ids: [], data_execucao: '2025-03-02', status: 'concluido', arquivos_gerados: ['/mock/retorno_1_01.xml', '/mock/retorno_1_02.xml'], data_geracao: '2025-05-20' },
	{ id: 2, user_id: 'joao', servico_id: '2', servico_nome: 'Verificar DAPI', certificado_id: '', empresa_ids: [], data_execucao: '2025-04-30', status: 'erro', arquivos_gerados: ['/mock/retorno_erro.xml'], data_geracao: '2025-05-22' },
	{ id: 3, user_id: 'joao', servico_id: '1', servico_nome: 'Consulta DET', certificado_id: '', empresa_ids: [], data_execucao: '2025-05-10', status: 'pendente', arquivos_gerados: ['/mock/pendente.xml'], data_geracao: '2025-05-23' },
	{ id: 4, user_id: 'maria', servico_id: '3', servico_nome: 'Automatizar PJF', certificado_id: '', empresa_ids: [], data_execucao: '2025-05-20', status: 'concluido', arquivos_gerados: ['/mock/retorno_1_01.xml', '/mock/retorno_1_02.xml'], data_geracao: '2025-05-21' },
]);

export const servicosDisponiveis = [
	{ id: '1', nome: 'Consulta DET', descricao: 'Automatizar a consulta ao DET.' },
	{ id: '2', nome: 'Verificar DAPI', descricao: 'Verificar desobrigação DAPI.' },
	{ id: '3', nome: 'Automatizar PJF', descricao: 'Aceite de notas, download do Livro Fiscal e XML de notas na PJF.' }
];

export function login(email: string, senha: string): Usuario | null {
	const usuario = usuarios.find((u) => u.email === email && u.senha === senha) || null;

	if (typeof window !== 'undefined' && usuario) {
		document.cookie = `auth_user_id=${usuario.id}; path=/`;
		document.cookie = `auth_user_role=${usuario.role}; path=/`;
	}

	return usuario;
}

export function logoutUsuario() {
	if (typeof window !== 'undefined') {
		document.cookie = 'auth_user_id=; path=/; Max-Age=0';
		document.cookie = 'auth_user_role=; path=/; Max-Age=0';
	}
}

export function getUsuarioPorId(userId: string): Usuario | undefined {
	return usuarios.find((u) => u.id === userId);
}

export function getUsuarioLogado(): Usuario | null {
	if (typeof window === 'undefined') return null;
	const cookieString = document.cookie;
	const match = cookieString.match(/auth_user_id=([^;]+)/);
	const userId = match ? match[1] : null;
	return userId ? getUsuarioPorId(userId) || null : null;
}

export function getFaturasDoUsuario(userId: string): Fatura[] {
	return faturas.filter((f) => f.user_id === userId);
}

export function getEmpresasDoUsuario(userId: string): Empresa[] {
	return empresas.filter((e) => e.user_id === userId);
}

export function getCertificadosDoUsuario(userId: string): Certificado[] {
	return certificados.filter((c) => c.user_id === userId);
}

export function getServicosDoUsuario(userId: string): Servico[] {
	return servicos.filter((s) => s.user_id === userId);
}

export function agendarServico(ag: Omit<Agendamento, 'id'>) {
	const novo = { ...ag, id: agendamentos.length + 1 };
	agendamentos.push(novo);
	salvar('agendamentos', agendamentos);
	return novo;
}

export function getAgendamentosPorServico(userId: string, servicoId: string): Agendamento[] {
	return agendamentos.filter((a) => a.user_id === userId && a.servico_id === servicoId);
}

export function simularExecucaoServico(id: number): void {
  const index = agendamentos.findIndex((a) => a.id === id);
  if (index !== -1) {
    agendamentos[index].status = 'concluido';
    agendamentos[index].data_geracao = new Date().toISOString().slice(0, 10);
    agendamentos[index].arquivos_gerados = [
      `/mock/retorno_${id}_1.xml`,
      `/mock/retorno_${id}_2.xml`
    ];
    salvar('agendamentos', agendamentos);
  }
}

// export function simularExecucaoServico(agendamentoId: number) {
// 	const agendamento = agendamentos.find((a) => a.id === agendamentoId);
// 	if (!agendamento) return;
// 	agendamento.status = 'concluido';
// 	agendamento.data_geracao = new Date().toISOString().split('T')[0];
// 	agendamento.arquivos_gerados = [`/mock/retorno_${agendamento.id}_01.xml`, `/mock/retorno_${agendamento.id}_02.xml`];
// 	salvar('agendamentos', agendamentos);
// }

export function alterarSenha(userId: string, novaSenha: string) {
	const user = usuarios.find(u => u.id === userId);
	if (user) user.senha = novaSenha;
	salvar('usuarios', usuarios);
}

export function atualizarNomeCertificado(userId: string, novoNome: string) {
	const cert = certificados.find(c => c.user_id === userId);
	if (cert) cert.id = novoNome;
	salvar('certificados', certificados);
}

export function setNomeUsuario(userId: string, novoNome: string): void {
	const user = usuarios.find(u => u.id === userId);
	if (user) user.nome = novoNome;
	salvar('usuarios', usuarios);
}

export function setStatusUsuario(userId: string, ativo: boolean): void {
	const user = usuarios.find(u => u.id === userId);
	if (user) user.ativo = ativo;
	salvar('usuarios', usuarios);
}

export function setStatusFatura(faturaId: number, novoStatus: 'Pago' | 'Pendente'): void {
	const fatura = faturas.find(f => f.id === faturaId);
	if (fatura) fatura.status = novoStatus;
	salvar('faturas', faturas);
}

export function pagarFatura(faturaId: number) {
	const fatura = faturas.find(f => f.id === faturaId);
	if (fatura) {
		fatura.status = 'Pago';
		const pendentes = faturas.filter(f => f.user_id === fatura.user_id && f.status === 'Pendente');
		if (pendentes.length === 0) {
			const user = usuarios.find(u => u.id === fatura.user_id);
			if (user) user.ativo = true;
			salvar('usuarios', usuarios);
		}
		salvar('faturas', faturas);
	}
}

export function adicionarEmpresa(userId: string, nome: string, cnpj: string): void {
	empresas.push({ id: gerarId(), user_id: userId, nome, cnpj });
	salvar('empresas', empresas);
}

export function removerEmpresa(empresaId: string): void {
	const index = empresas.findIndex((e) => e.id === empresaId);
	if (index !== -1) empresas.splice(index, 1);
	salvar('empresas', empresas);
}

export function getAgendamentosDoUsuario(userId: string) {
	return agendamentos.filter(a => a.user_id === userId);
}

let idAgendamentoAutoIncrement = 1000;

export function adicionarAgendamento({
  id,
  user_id,
  servico_id,
  servico_nome,
  certificado_id,
  empresa_ids,
  data_execucao,
  forcar = false,
}: {
  id?: number;
  user_id: string;
  servico_id: string;
  servico_nome: string;
  certificado_id: string;
  empresa_ids: string[];
  data_execucao: string;
  forcar?: boolean;
}) {
  const mes = data_execucao.slice(0, 7);

  if (id !== undefined) {
    const index = agendamentos.findIndex((a) => a.id === id);
    if (index !== -1) {
      agendamentos.splice(index, 1);
    }
  }

  const existente = agendamentos.find(
    (a) =>
      a.user_id === user_id &&
      a.servico_id === servico_id &&
      a.data_execucao.slice(0, 7) === mes
  );

  if (existente && !forcar) {
    throw new Error('Já existe um agendamento deste serviço para este mês.');
  }

  const novoId = id !== undefined ? id : idAgendamentoAutoIncrement++;

  agendamentos.push({
    id: novoId,
    user_id,
    servico_id,
    servico_nome,
    certificado_id,
    empresa_ids,
    status: 'pendente',
    data_execucao,
    arquivos_gerados: [],
    data_geracao: '',
  });

  salvar('agendamentos', agendamentos);
}

export function setDiaAgendamento(userId: string, dia: number) {
	const user = usuarios.find(u => u.id === userId);
	if (user) user.dia_agendamento = dia;
	salvar('usuarios', usuarios);
}
export function atualizarAgendamento(id: string, novosDados: Partial<Agendamento>) {
	const index = agendamentos.findIndex((a) => a.id === Number(id));
	if (index !== -1) {
		agendamentos[index] = { ...agendamentos[index], ...novosDados };
		salvar('agendamentos', agendamentos);
	}
}


export function getEmpresasPorIds(ids: string[]) {
	return empresas.filter((e) => ids.includes(e.id));
}

export function getCertificadoPorIds(ids: string[]) {
	return certificados.filter((e) => ids.includes(e.id));
}

export const staticServices = [
  {
    id: 'servico-embedado-1',
    nome: 'Informações REINF',
    descricao: 'Serviço para consultar informações da REINF.',
    tipo: 'embed',
    embedUrl: "https://conplusgestao.notion.site/ebd/675e177f73e14132b19344d3e55cee8e?v=c4dabefa8b634ad6b4e568e42142b480"
  },
];

export function getServicoDisponivelPorId(id: string) {
  return servicosDisponiveis.find((s) => s.id === id);
}

export function getSlugServicoPorId(id: string): string {
  return `/user/servicos/${id}`;
}

export function getProximoAgendamentoServico(userId: string, servicoId: string): Agendamento | undefined {
  return agendamentos
	.filter(a => a.user_id === userId && a.servico_id === servicoId && a.status === 'pendente')
	.sort((a, b) => a.data_execucao.localeCompare(b.data_execucao))[0];
}

export function importarEmpresasCSV(usuarioId: string, csv: string) {
  const linhas = csv.split('\n').map((linha) => linha.trim()).filter(Boolean);

  for (const linha of linhas) {
    const [nome, cnpj] = linha.split(',').map((parte) => parte.trim());

    if (nome && cnpj && validarCNPJ(cnpj)) {
      adicionarEmpresa(usuarioId, nome, cnpj);
    }
  }
}

export function validarCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) return false;

  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== Number(digitos.charAt(0))) return false;

  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === Number(digitos.charAt(1));
}
