'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseService';

export default function CertificadosForm() {
  const [nome, setNome] = useState('');
  const [arquivo, setArquivo] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!arquivo) return;

    const user = await supabaseBrowser.auth.getUser();
    const fileExt = arquivo.name.split('.').pop();
    const filePath = `${user.data.user?.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseBrowser.storage
      .from('certificados')
      .upload(filePath, arquivo);

    if (!error) {
      await supabaseBrowser.from('certificados').insert({
        nome,
        user_id: user.data.user?.id,
        arquivo_url: data.path,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" placeholder="Nome do Certificado" value={nome} onChange={(e) => setNome(e.target.value)} required />
      <input type="file" accept=".pfx,.pem" onChange={(e) => setArquivo(e.target.files?.[0] || null)} required />
      <button type="submit">Salvar Certificado</button>
    </form>
  );
}
