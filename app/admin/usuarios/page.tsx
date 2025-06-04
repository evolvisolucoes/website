'use client';
import Link from 'next/link';

const mockUsers = [
  { id: 'joao', email: 'joao@empresa.com', plano: 'Pro', ativo: true },
  { id: 'maria', email: 'maria@empresa.com', plano: 'Free', ativo: false },
];

export default function UsuariosAdminPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Usuários</h2>
      <ul className="space-y-2">
        {mockUsers.map((user) => (
          <li key={user.id} className="bg-white p-4 rounded shadow flex justify-between">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-500">{user.plano} • {user.ativo ? 'Ativo' : 'Inativo'}</p>
            </div>
            <Link href={`/admin/usuarios/${user.id}`} className="text-blue-600 text-sm underline">Ver Detalhes</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
