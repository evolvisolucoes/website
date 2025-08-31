import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Usuario, Empresa, Certificado, Fatura, Servico, Agendamento, ServicosDisponiveis, ServicosEstaticos } from 'types_db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL e/ou Anon Key não definidos nas variáveis de ambiente.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// --- Funções de Autenticação (adaptadas do mock, usar supabase.auth para produção) ---
export async function login(email: string, senha: string): Promise<Usuario | null> {
    const { data, error } = await supabase.from('usuarios').select('*').eq('email', email).eq('senha', senha).single();

    if (error) {
        console.error('Erro ao fazer login:', error);
        return null;
    }

    if (data) {
        // usar Supabase Auth para login (seguro e com sessões).
        // Para demonstração, simulando a configuração de cookie baseado no mock.
        if (typeof window !== 'undefined') {
            document.cookie = `auth_user_id=${data.id}; path=/`;
            document.cookie = `auth_user_role=${data.role}; path=/`;
        }
        return data as Usuario;
    }
    return null;
}

export function logoutUsuario(): void {
    // Usar o método signOut do Supabase Auth.
    if (typeof window !== 'undefined') {
        document.cookie = 'auth_user_id=; path=/; Max-Age=0';
        document.cookie = 'auth_user_role=; path=/; Max-Age=0';
    }
}

export async function getUsuarioPorId(userId: string): Promise<Usuario | null> {
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', userId).single();
    if (error) {
        console.error('Erro ao buscar usuário por ID:', error);
        return null;
    }
    return data as Usuario;
}

export async function getUsuarioLogado(): Promise<Usuario | null> {
    if (typeof window === 'undefined') return null;
    const cookieString = document.cookie;
    const match = cookieString.match(/auth_user_id=([^;]+)/);
    const userId = match ? match[1] : null;

    if (userId) {
        return getUsuarioPorId(userId);
    }
    return null;
}

// --- Funções de Recuperação de Dados ---
export async function getFaturasDoUsuario(userId: string): Promise<Fatura[]> {
    const { data, error } = await supabase.from('faturas').select('*').eq('user_id', userId);
    if (error) {
        console.error('Erro ao buscar faturas do usuário:', error);
        return [];
    }
    return data as Fatura[];
}

export async function getEmpresasDoUsuario(userId: string): Promise<Empresa[]> {
    const { data, error } = await supabase.from('empresas').select('*').eq('user_id', userId);
    if (error) {
        console.error('Erro ao buscar empresas do usuário:', error);
        return [];
    }
    return data as Empresa[];
}

export async function getCertificadosDoUsuario(userId: string): Promise<Certificado[]> {
    const { data, error } = await supabase.from('certificados').select('*').eq('user_id', userId);
    if (error) {
        console.error('Erro ao buscar certificados do usuário:', error);
        return [];
    }
    return data as Certificado[];
}

export async function getServicosDoUsuario(userId: string): Promise<Servico[]> {
    const { data, error } = await supabase.from('servicos_registrados').select('*').eq('user_id', userId);
    if (error) {
        console.error('Erro ao buscar serviços do usuário:', error);
        return [];
    }
    return data as Servico[];
}

export async function getAgendamentosDoUsuario(userId: string): Promise<Agendamento[]> {
    const { data, error } = await supabase.from('agendamentos').select('*').eq('user_id', userId);
    if (error) {
        console.error('Erro ao buscar agendamentos do usuário:', error);
        return [];
    }
    return data as Agendamento[];
}

export async function getAgendamentosPorServico(userId: string, servicoId: string): Promise<Agendamento[]> {
    const { data, error } = await supabase.from('agendamentos').select('*').eq('user_id', userId).eq('servico_id', servicoId);
    if (error) {
        console.error('Erro ao buscar agendamentos por serviço:', error);
        return [];
    }
    return data as Agendamento[];
}

export async function getEmpresasPorIds(ids: string[]): Promise<Empresa[]> {
    const { data, error } = await supabase.from('empresas').select('*').in('id', ids);
    if (error) {
        console.error('Erro ao buscar empresas por IDs:', error);
        return [];
    }
    return data as Empresa[];
}

export async function getCertificadoPorIds(ids: string[]): Promise<Certificado[]> {
    const { data, error } = await supabase.from('certificados').select('*').in('id', ids);
    if (error) {
        console.error('Erro ao buscar certificados por IDs:', error);
        return [];
    }
    return data as Certificado[];
}

export async function getProximoAgendamentoServico(userId: string, servicoId: string): Promise<Agendamento | undefined> {
    const { data, error } = await supabase.from('agendamentos')
        .select('*')
        .eq('user_id', userId)
        .eq('servico_id', servicoId)
        .eq('status', 'pendente')
        .order('data_execucao', { ascending: true })
        .limit(1);

    if (error) {
        console.error('Erro ao buscar próximo agendamento de serviço:', error);
        return undefined;
    }
    return data?.[0] as Agendamento;
}

// --- Funções de Modificação de Dados ---
export async function agendarServico(ag: Omit<Agendamento, 'id' | 'status' | 'arquivos_gerados' | 'data_geracao'>): Promise<Agendamento | null> {
    const { data, error } = await supabase.from('agendamentos').insert({
        ...ag,
        status: 'pendente',
        arquivos_gerados: [],
        data_geracao: null,
    }).select().single();

    if (error) {
        console.error('Erro ao agendar serviço:', error);
        return null;
    }
    return data as Agendamento;
}

export async function simularExecucaoServico(id: number): Promise<void> {
    const { error } = await supabase.from('agendamentos')
        .update({
            status: 'concluido',
            data_geracao: new Date().toISOString().slice(0, 10), // Formato 'YYYY-MM-DD'
            arquivos_gerados: [`/mock/retorno_${id}_1.xml`, `/mock/retorno_${id}_2.xml`]
        })
        .eq('id', id);

    if (error) {
        console.error('Erro ao simular execução de serviço:', error);
    }
}

export async function alterarSenha(userId: string, novaSenha: string): Promise<void> {
    const { error } = await supabase.from('usuarios').update({ senha: novaSenha }).eq('id', userId);
    if (error) {
        console.error('Erro ao alterar senha:', error);
    }
}

export async function atualizarNomeCertificado(userId: string, novoNome: string): Promise<void> {
    const { error } = await supabase.from('certificados').update({ id: novoNome }).eq('user_id', userId);
    if (error) {
        console.error('Erro ao atualizar nome do certificado:', error);
    }
}

export async function setNomeUsuario(userId: string, novoNome: string): Promise<void> {
    const { error } = await supabase.from('usuarios').update({ nome: novoNome }).eq('id', userId);
    if (error) {
        console.error('Erro ao definir nome de usuário:', error);
    }
}

export async function setStatusUsuario(userId: string, ativo: boolean): Promise<void> {
    const { error } = await supabase.from('usuarios').update({ ativo: ativo }).eq('id', userId);
    if (error) {
        console.error('Erro ao definir status do usuário:', error);
    }
}

export async function setStatusFatura(faturaId: number, novoStatus: 'Pago' | 'Pendente'): Promise<void> {
    const { error } = await supabase.from('faturas').update({ status: novoStatus }).eq('id', faturaId);
    if (error) {
        console.error('Erro ao definir status da fatura:', error);
    }
}

export async function pagarFatura(faturaId: number): Promise<void> {
    const { data: faturaData, error: faturaError } = await supabase.from('faturas').select('*').eq('id', faturaId).single();

    if (faturaError || !faturaData) {
        console.error('Erro ao buscar fatura para pagamento:', faturaError);
        return;
    }

    const { error: updateFaturaError } = await supabase.from('faturas').update({ status: 'Pago' }).eq('id', faturaId);
    if (updateFaturaError) {
        console.error('Erro ao atualizar status da fatura para pago:', updateFaturaError);
        return;
    }

    const { data: pendentesData, error: pendentesError } = await supabase.from('faturas')
        .select('id')
        .eq('user_id', faturaData.user_id)
        .eq('status', 'Pendente');

    if (pendentesError) {
        console.error('Erro ao verificar faturas pendentes:', pendentesError);
        return;
    }

    if (pendentesData.length === 0) {
        const { error: updateUserError } = await supabase.from('usuarios').update({ ativo: true }).eq('id', faturaData.user_id);
        if (updateUserError) {
            console.error('Erro ao definir status ativo do usuário após pagamento:', updateUserError);
        }
    }
}

export async function adicionarEmpresa(userId: string, nome: string, cnpj: string): Promise<Empresa | null> {
    const { data, error } = await supabase.from('empresas').insert({ user_id: userId, nome, cnpj }).select().single();
    if (error) {
        console.error('Erro ao adicionar empresa:', error);
        return null;
    }
    return data as Empresa;
}

export async function removerEmpresa(empresaId: string): Promise<void> {
    const { error } = await supabase.from('empresas').delete().eq('id', empresaId);
    if (error) {
        console.error('Erro ao remover empresa:', error);
    }
}

export async function adicionarAgendamento({
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
}): Promise<Agendamento | null> {
    const mes = data_execucao.slice(0, 7);

    if (id !== undefined) {
        const { error: deleteError } = await supabase.from('agendamentos').delete().eq('id', id);
        if (deleteError) {
            console.warn('Aviso: Erro ao tentar deletar agendamento existente pelo ID, continuando com insert:', deleteError);
        }
    }

    if (!forcar) {
        const { data: existente, error: existenteError } = await supabase.from('agendamentos')
            .select('id')
            .eq('user_id', user_id)
            .eq('servico_id', servico_id)
            .ilike('data_execucao', `${mes}%`);

        if (existenteError) {
            console.error('Erro ao verificar agendamento existente:', existenteError);
            throw new Error('Erro ao verificar agendamento existente.');
        }

        if (existente && existente.length > 0) {
            throw new Error('Já existe um agendamento deste serviço para este mês.');
        }
    }

    const { data, error } = await supabase.from('agendamentos').insert({
        user_id,
        servico_id,
        servico_nome,
        certificado_id,
        empresa_ids,
        status: 'pendente',
        data_execucao,
        arquivos_gerados: [],
        data_geracao: null,
    }).select().single();

    if (error) {
        console.error('Erro ao adicionar agendamento:', error);
        return null;
    }
    return data as Agendamento;
}

export async function setDiaAgendamento(userId: string, dia: number): Promise<void> {
    const { error } = await supabase.from('usuarios').update({ dia_agendamento: dia }).eq('id', userId);
    if (error) {
        console.error('Erro ao definir dia de agendamento:', error);
    }
}

export async function atualizarAgendamento(id: number, novosDados: Partial<Agendamento>): Promise<void> {
    const { error } = await supabase.from('agendamentos').update(novosDados).eq('id', id);
    if (error) {
        console.error('Erro ao atualizar agendamento:', error);
    }
}

// --- Dados Estáticos e Funções Utilitárias ---
export async function getServicosDisponiveis(): Promise<ServicosDisponiveis[]> {
    const { data, error } = await supabase.from('servicos_disponiveis').select('*');
    if (error) {
        console.error('Erro ao buscar serviços disponíveis:', error);
        return [];
    }
    return data as ServicosDisponiveis[];
}

export async function getServicoDisponivelPorId(id: string): Promise<ServicosDisponiveis | undefined> {
    const { data, error } = await supabase.from('servicos_disponiveis').select('*').eq('id', id).single();
    if (error) {
        console.error('Erro ao buscar serviço disponível por ID:', error);
        return undefined;
    }
    return data as ServicosDisponiveis;
}

export async function getServicosEstaticos(): Promise<ServicosEstaticos[]> {
    const { data, error } = await supabase.from('servicos_estaticos').select('*');
    if (error) {
        console.error('Erro ao buscar serviços estáticos:', error);
        return [];
    }
    return data as ServicosEstaticos[];
}

export function getSlugServicoPorId(id: string): string {
    return `/user/servicos/${id}`;
}

export async function importarEmpresasCSV(usuarioId: string, csv: string): Promise<void> {
    const linhas = csv.split('\n').map((linha) => linha.trim()).filter(Boolean);
    const empresasToInsert = [];

    for (const linha of linhas) {
        const [nome, cnpj] = linha.split(',').map((parte) => parte.trim());

        if (nome && cnpj && validarCNPJ(cnpj)) {
            empresasToInsert.push({ user_id: usuarioId, nome, cnpj });
        }
    }

    if (empresasToInsert.length > 0) {
        const { error } = await supabase.from('empresas').insert(empresasToInsert);
        if (error) {
            console.error('Erro ao importar empresas do CSV:', error);
            throw new Error('Erro ao importar empresas do CSV.');
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

export async function getFaturas(): Promise<Fatura[]> {
    const { data, error } = await supabase.from('faturas').select('*');
    if (error) {
        console.error('Erro ao buscar todas as faturas:', error);
        return [];
    }
    return data as Fatura[];
}

export async function getUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase.from('usuarios').select('*');
    if (error) {
        console.error('Erro ao buscar todos os usuários:', error);
        return [];
    }
    return data as Usuario[];
}

export async function getAgendamentos(): Promise<Agendamento[]> {
    const { data, error } = await supabase.from('agendamentos').select('*');
    if (error) {
        console.error('Erro ao buscar todos os agendamentos:', error);
        return [];
    }
    return data as Agendamento[];
}

export async function getCertificados(): Promise<Certificado[]> {
    const { data, error } = await supabase.from('certificados').select('*');
    if (error) {
        console.error('Erro ao buscar todos os certificados:', error);
        return [];
    }
    return data as Certificado[];
}