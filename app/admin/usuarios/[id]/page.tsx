'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import {
  getUsuarioPorId,
  getEmpresasDoUsuario,
  getFaturasDoUsuario,
  getAgendamentosDoUsuario,
  getCertificadosDoUsuario,
  alterarSenha,
  atualizarNomeCertificado,
  setNomeUsuario,
  setStatusUsuario
} from '@/lib/supabaseService';
import { InfoEditavel } from '@/components/InfoEditavel';
import { Usuario, Empresa, Fatura, Agendamento, Certificado } from '@/types_db';

export default function UsuarioDetalhesPage() {
  const { id } = useParams();
  const [user, setUser] = useState<Usuario | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [certificado, setCertificado] = useState<Certificado | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    setLoading(true);
    const fetchedUser = await getUsuarioPorId(userId);
    setUser(fetchedUser);

    if (fetchedUser) {
      setEmpresas(await getEmpresasDoUsuario(fetchedUser.id));
      setFaturas(await getFaturasDoUsuario(fetchedUser.id));
      setAgendamentos(await getAgendamentosDoUsuario(fetchedUser.id));
      const userCertificates = await getCertificadosDoUsuario(fetchedUser.id);
      setCertificado(userCertificates[0] || null);
    }
    setLoading(false);
  }, []);


  useEffect(() => {
    if (id) {
        fetchUserData(id as string);
    }
  }, [id, fetchUserData]);

  if (loading || !user) return <p>Carregando usuário...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">👤 Usuário: {user.nome}</h2>

      {/* Info e edição */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Plano:</strong> {user.plano}</p>
        <p>
          <strong>Status:</strong> {user.ativo ? 'Ativo' : 'Inativo'}
          <button
              onClick={async () => {
                  await setStatusUsuario(user.id, !user.ativo);
                  await fetchUserData(user.id);
                  alert(`Status do usuário alterado para ${!user.ativo ? 'Ativo' : 'Inativo'}!`);
              }}
              className="ml-4 text-blue-600 underline text-xs"
          >
              Alterar Status
          </button>
        </p>

        <InfoEditavel
          label="Nome"
          valor={user.nome}
          onSalvar={async (novoNome) => {
              await setNomeUsuario(user.id, novoNome);
              await fetchUserData(user.id);
              alert('Nome atualizado!');
          }}
        />

        <InfoEditavel
          label="Senha"
          valor="********"
          tipo="password"
          onSalvar={async (nova) => {
            await alterarSenha(user.id, nova);
            alert('Senha atualizada!');
          }}
        />

        <InfoEditavel
          label="Certificado"
          valor={certificado?.id ?? 'Sem certificado'}
          onSalvar={async (novoIdCertificado) => {
            if (certificado) {
                 await atualizarNomeCertificado(user.id, novoIdCertificado);
                 await fetchUserData(user.id);
                 alert('Certificado atualizado!');
            } else {
                 alert('Nenhum certificado para atualizar. Por favor, adicione um primeiro.');
            }
          }}
        />
      </div>

      {/* Empresas */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">🏢 Empresas Vinculadas</h3>
        {empresas.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma empresa vinculada.</p>
        ) : (
          <ul className="list-disc pl-5 text-sm">
            {empresas.map((e) => (
              <li key={e.id}>{e.nome} ({e.cnpj})</li>
            ))}
          </ul>
        )}
      </div>

      {/* Faturas */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">💳 Faturas</h3>
        {faturas.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma fatura encontrada.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {faturas.map((f) => (
              <li key={f.id}>
                R$ {f.valor.toFixed(2)} - {f.status} ({f.vencimento})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Serviços */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">🧾 Serviços</h3>
        {agendamentos.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum serviço executado ou pendente.</p>
        ) : (
          <table className="w-full text-sm border bg-white rounded shadow mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Serviço</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Data</th>
                <th className="p-2 text-left">Arquivos</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.servico_nome}</td>
                  <td className="p-2 capitalize">{a.status}</td>
                  <td className="p-2">{a.data_execucao || a.data_geracao || '—'}</td>
                  <td className="p-2 space-y-1 text-xs">
                    {a.arquivos_gerados.length > 0 ? (
                      a.arquivos_gerados.map((arq: string, i: number) => (
                        <div key={i}>
                          <a href={arq} download className="text-blue-600 underline">
                            Arquivo {i + 1}
                          </a>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}