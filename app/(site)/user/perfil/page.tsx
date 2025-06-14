'use client';

import { useState, useEffect } from 'react';
import {
  getUsuarioLogado,
  alterarSenha,
  setNomeUsuario,
  getEmpresasDoUsuario,
  adicionarEmpresa,
  removerEmpresa,
  getCertificadosDoUsuario,
  atualizarNomeCertificado,
  importarEmpresasCSV,
  Usuario,
  Empresa,
  Certificado
} from '@/lib/mockDB';
import { InfoEditUsuario } from '@/components/InfoEditUsuario';

export default function PaginaPerfilUsuario() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [certificado, setCertificado] = useState<Certificado | null>(null);
  const [loading, setLoading] = useState(true);
  const [novaEmpresa, setNovaEmpresa] = useState({ nome: '', cnpj: '' });

  useEffect(() => {
    const usuarioLogado = getUsuarioLogado();
    setUsuario(usuarioLogado);
  }, []);

  useEffect(() => {
    if (usuario) {
      setEmpresas(getEmpresasDoUsuario(usuario.id));
      setCertificado(getCertificadosDoUsuario(usuario.id)[0] || null);
    }
    setLoading(false);
  }, [usuario]);

  const refreshEmpresas = () => {
    if (usuario) {
      setEmpresas(getEmpresasDoUsuario(usuario.id));
    }
  };
  
  const handleAddEmpresa = () => {
    if (novaEmpresa.nome && novaEmpresa.cnpj && usuario) {
      adicionarEmpresa(usuario.id, novaEmpresa.nome, novaEmpresa.cnpj);
      refreshEmpresas();
      setNovaEmpresa({ nome: '', cnpj: '' });
    }
  };

  const handleRemover = (id: string) => {
    removerEmpresa(id);
    refreshEmpresas();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuario) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      importarEmpresasCSV(usuario.id, text);
      refreshEmpresas();
    };
    reader.readAsText(file);
  };

  if (loading) {
    return <div className="p-6 text-center font-semibold">Carregando perfil...</div>;
  }

  if (!usuario) {
    return <div className="p-6 text-center text-red-600 font-semibold">Usuário não encontrado. Por favor, faça o login.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 border-b pb-2">Meu Perfil</h1>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">👤 Dados Pessoais</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <InfoEditUsuario
            label="Nome"
            valor={usuario.nome}
            onSalvar={(novo) => {
              setNomeUsuario(usuario.id, novo);
              alert('Nome atualizado!');
            }}
          />
          <InfoEditUsuario
            label="Senha"
            valor="********"
            tipo="password"
            onSalvar={(nova) => {
              alterarSenha(usuario.id, nova);
              alert('Senha atualizada!');
            }}
          />
        </div>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">🔐 Certificado Digital</h2>
        <InfoEditUsuario
          label="Identificador"
          valor={certificado?.id ?? 'Sem certificado'}
          onSalvar={(novoNome) => {
            atualizarNomeCertificado(usuario.id, novoNome);
            alert('Certificado atualizado!');
          }}
        />
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">🏢 Empresas Vinculadas</h2>
          <label className="text-sm text-blue-700 cursor-pointer hover:underline">
            Importar CSV
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 rounded mb-4">
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
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
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