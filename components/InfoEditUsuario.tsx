'use client';
import { useState } from 'react';

export function InfoEditUsuario({
  label,
  valor,
  onSalvar,
  tipo = 'text',
}: {
  label: string;
  valor: string;
  onSalvar: (novo: string) => void;
  tipo?: 'text' | 'password';
}) {
  const [editando, setEditando] = useState(false);
  const [novoValor, setNovoValor] = useState(valor);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {editando ? (
        <div className="flex gap-2">
          <input
            type={tipo}
            value={novoValor}
            onChange={(e) => setNovoValor(e.target.value)}
            className="border px-2 py-1 rounded flex-1"
          />
          <button
            onClick={() => {
              onSalvar(novoValor);
              setEditando(false);
            }}
            className="text-white bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Salvar
          </button>
          <button
            onClick={() => setEditando(false)}
            className="text-gray-600 border px-3 py-1 rounded text-sm hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-800">
            {tipo === 'password' ? '••••••••' : valor}
          </span>
          <button
            onClick={() => setEditando(true)}
            className="text-blue-600 border border-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50 transition"
          >
            Alterar
          </button>
        </div>
      )}
    </div>
  );
}
