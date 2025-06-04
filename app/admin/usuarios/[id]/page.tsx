'use client';
import { useParams } from 'next/navigation';
import {
  getUsuarioPorId,
  getEmpresasDoUsuario,
  getFaturasDoUsuario,
  getAgendamentosDoUsuario,
  certificados,
} from '@/lib/mockDB';
import { useState } from 'react';
import { InfoEditavel } from '@/components/InfoEditavel';

export default function UsuarioDetalhesPage() {
  const { id } = useParams();
  const user = getUsuarioPorId(id as string);
  const [novaSenha, setNovaSenha] = useState('');
  const [novoCert, setNovoCert] = useState('');

  if (!user) return <p>Usuário não encontrado</p>;

  const empresas = getEmpresasDoUsuario(user.id);
  const faturas = getFaturasDoUsuario(user.id);
  const agendamentos = getAgendamentosDoUsuario(user.id);
  const certificado = certificados.find(c => c.user_id === user.id);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">👤 Usuário: {user.nome}</h2>

      {/* Info e edição */}
      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Plano:</strong> {user.plano}</p>
        <p><strong>Status:</strong> {user.ativo ? 'Ativo' : 'Inativo'}</p>

        <InfoEditavel
          label="Senha"
          valor="********"
          tipo="password"
          onSalvar={(nova) => {
            setNovaSenha(nova);
            alert('Senha atualizada!');
          }}
        />

        <InfoEditavel
          label="Certificado"
          valor={certificado?.id ?? 'Sem certificado'}
          onSalvar={(novo) => {
            setNovoCert(novo);
            alert('Certificado atualizado!');
          }}
        />
      </div>

      {/* Empresas */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">🏢 Empresas Vinculadas</h3>
        <ul className="list-disc pl-5 text-sm">
          {empresas.map((e) => (
            <li key={e.id}>{e.nome} ({e.cnpj})</li>
          ))}
        </ul>
      </div>

      {/* Faturas */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">💳 Faturas</h3>
        <ul className="text-sm space-y-1">
          {faturas.map((f) => (
            <li key={f.id}>
              R$ {f.valor.toFixed(2)} - {f.status} ({f.vencimento})
            </li>
          ))}
        </ul>
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
