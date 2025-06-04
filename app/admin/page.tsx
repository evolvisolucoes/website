'use client';

import {
  usuarios,
  faturas,
  getFaturasDoUsuario,
} from '@/lib/mockDB';

export default function AdminDashboard() {
  const totalUsuarios = usuarios.length;
  const usuariosAtivos = usuarios.filter((u) => u.ativo).length;
  const usuariosInativos = totalUsuarios - usuariosAtivos;

  const totalFaturado = faturas
    .filter((f) => f.status === 'Pago')
    .reduce((acc, f) => acc + f.valor, 0);

  const faturasPendentes = faturas.filter((f) => f.status === 'Pendente');
  const totalPendentes = faturasPendentes.length;

  const inadimplentes = usuarios.filter((u) =>
    getFaturasDoUsuario(u.id).some((f) => f.status === 'Pendente')
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📊 Visão Geral da Plataforma</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card titulo="Usuários Cadastrados" valor={totalUsuarios} />
        <Card titulo="Usuários Ativos" valor={usuariosAtivos} />
        <Card titulo="Usuários Inativos" valor={usuariosInativos} />
        <Card titulo="Faturamento Total" valor={`R$ ${totalFaturado.toFixed(2)}`} />
        <Card titulo="Faturas Pendentes" valor={totalPendentes} />
        <Card titulo="Usuários Inadimplentes" valor={inadimplentes.length} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mt-6 mb-2">📌 Usuários Inadimplentes</h2>
        {inadimplentes.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum usuário inadimplente.</p>
        ) : (
          <ul className="list-disc pl-5 text-sm text-red-600">
            {inadimplentes.map((u) => (
              <li key={u.id}>{u.nome} ({u.email})</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string | number }) {
  return (
    <div className="bg-white p-4 rounded shadow border">
      <h3 className="text-sm text-gray-600 mb-1">{titulo}</h3>
      <p className="text-2xl font-semibold text-blue-700">{valor}</p>
    </div>
  );
}
