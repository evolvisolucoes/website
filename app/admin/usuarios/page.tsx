'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUsuarios } from '@/lib/supabaseService';
import { Usuario } from '@/types_db';

export default function UsuariosAdminPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedUsers = await getUsuarios();
      setUsuarios(fetchedUsers);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Usuários</h2>
      <ul className="space-y-2">
        {usuarios.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum usuário encontrado.</p>
        ) : (
          usuarios.map((user) => (
            <li key={user.id} className="bg-white p-4 rounded shadow flex justify-between">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">{user.plano} • {user.ativo ? 'Ativo' : 'Inativo'}</p>
              </div>
              <Link href={`/admin/usuarios/${user.id}`} className="text-blue-600 text-sm underline">Ver Detalhes</Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}