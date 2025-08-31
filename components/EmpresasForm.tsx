'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseService';

export default function EmpresasForm() {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await supabaseBrowser.auth.getUser();
    await supabaseBrowser.from('empresas').insert({
      nome,
      cnpj,
      user_id: user.data.user?.id,
    });
    setNome('');
    setCnpj('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Nome da Empresa" value={nome} onChange={(e) => setNome(e.target.value)} required />
      <input type="text" placeholder="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} required />
      <button type="submit">Cadastrar Empresa</button>
    </form>
  );
}
