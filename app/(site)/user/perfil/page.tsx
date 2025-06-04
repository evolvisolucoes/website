'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getUsuarioLogado,
  alterarSenha,
  setNomeUsuario,
  getEmpresasDoUsuario,
  adicionarEmpresa,
  removerEmpresa,
  getCertificadosDoUsuario,
  atualizarNomeCertificado,
  Empresa,
  Certificado,
} from '@/lib/mockDB';
import { InfoEditUsuario } from '@/components/InfoEditUsuario';

export default function PaginaPerfilUsuario() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<ReturnType<typeof getUsuarioLogado> | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [certificado, setCertificado] = useState<Certificado | null>(null);

  const [novaEmpresa, setNovaEmpresa] = useState({ nome: '', cnpj: '' });

  useEffect(() => {
    const user = getUsuarioLogado();
    if (!user) {
      router.push('/login');
    } else {
      setUsuario(user);
      setEmpresas(getEmpresasDoUsuario(user.id));
      const certs = getCertificadosDoUsuario(user.id);
      if (certs.length > 0) setCertificado(certs[0]);
    }
  }, []);

  const handleAddEmpresa = () => {
    if (novaEmpresa.nome && novaEmpresa.cnpj && usuario) {
      adicionarEmpresa(usuario.id, novaEmpresa.nome, novaEmpresa.cnpj);
      setEmpresas(getEmpresasDoUsuario(usuario.id));
      setNovaEmpresa({ nome: '', cnpj: '' });
    }
  };

  const handleRemover = (id: string) => {
    if (usuario) {
      removerEmpresa(id);
      setEmpresas(getEmpresasDoUsuario(usuario.id));
    }
  };

  if (!usuario) {
    return <p>Carregando...</p>;
  }
  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-blue-700">Meu Perfil</h1>

      {/* Dados Pessoais */}
      <section>
        <h2 className="text-lg font-semibold mb-2">👤 Dados Pessoais</h2>
        <InfoEditUsuario
          label="Nome"
          valor={usuario?.nome || ''}
          onSalvar={(novo) => {
            setNomeUsuario(usuario!.id, novo);
            alert('Nome atualizado!');
          }}
        />
        <InfoEditUsuario
          label="Senha"
          valor="********"
          tipo="password"
          onSalvar={(nova) => {
            alterarSenha(usuario!.id, nova);
            alert('Senha atualizada!');
          }}
        />
      </section>

      {/* Certificado */}
      <section>
        <h2 className="text-lg font-semibold mb-2">🔐 Certificado Digital</h2>
        <InfoEditUsuario
          label="Identificador"
          valor={certificado?.id ?? 'Sem certificado'}
          onSalvar={(novoNome) => {
            atualizarNomeCertificado(usuario!.id, novoNome);
            alert('Certificado atualizado!');
          }}
        />
      </section>

      {/* Empresas */}
      <section>
        <h2 className="text-lg font-semibold mb-2">🏢 Empresas Vinculadas</h2>
        <table className="w-full text-sm border border-gray-300 rounded overflow-hidden mb-2">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-2 text-left">Nome</th>
              <th className="p-2 text-left">CNPJ</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{e.nome}</td>
                <td className="p-2">{e.cnpj}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleRemover(e.id)}
                    className="text-red-600 text-xs underline"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-2">
          <input
            type="text"
            value={novaEmpresa.nome}
            onChange={(e) => setNovaEmpresa({ ...novaEmpresa, nome: e.target.value })}
            placeholder="Nome da empresa"
            className="border px-2 py-1 rounded w-full"
          />
          <input
            type="text"
            value={novaEmpresa.cnpj}
            onChange={(e) => setNovaEmpresa({ ...novaEmpresa, cnpj: e.target.value })}
            placeholder="CNPJ"
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={handleAddEmpresa}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Adicionar
          </button>
        </div>
      </section>
    </div>
  );
}
