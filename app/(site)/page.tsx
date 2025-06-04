'use client';

import Link from 'next/link';
import { Briefcase, FileText, ShieldCheck, Workflow, Zap, Settings } from 'lucide-react';

function Funcao({
  icon,
  titulo,
  descricao,
}: {
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4 transition hover:shadow-lg">
      <div className="text-blue-600">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800">{titulo}</h3>
      <p className="text-sm text-gray-600">{descricao}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="text-center space-y-20 md:space-y-24 px-4 py-16 bg-gray-50">
      {/* Hero */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-blue-800 leading-tight">
          Evolvi: Otimize processos e automatize sua contabilidade
        </h1>
        <p className="text-gray-700 text-lg">
          Plataforma inteligente desenvolvida para escritórios contábeis que desejam escalar a operação, reduzir retrabalho e executar serviços com eficiência, segurança e padronização.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Acessar Plataforma
        </Link>
      </section>

      {/* Destaques */}
      <section className="max-w-6xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-blue-700">Nossos Pilares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <Funcao
            icon={<Workflow className="w-8 h-8" />}
            titulo="Gestão de Processos Contábeis"
            descricao="Organize a rotina contábil com controle centralizado de empresas, certificados, procuradores e tarefas. Menos planilhas, mais eficiência."
          />
          <Funcao
            icon={<Zap className="w-8 h-8" />}
            titulo="Automatizações Inteligentes"
            descricao="Execução automática de obrigações como DET, EFD, serviços tomados, geração de livros e outros. Resultados com rapidez e consistência."
          />
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="max-w-6xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold text-blue-700">Funcionalidades da Plataforma</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Funcao
            icon={<ShieldCheck className="w-8 h-8" />}
            titulo="Gerenciamento de Certificados"
            descricao="Administre certificados digitais e procurações de forma segura e organizada, com notificações e vinculações automáticas."
          />
          <Funcao
            icon={<FileText className="w-8 h-8" />}
            titulo="Execução de Serviços"
            descricao="Execute atividades como DET, EFD, apuração de impostos, envio de obrigações acessórias e mais com poucos cliques."
          />
          <Funcao
            icon={<Briefcase className="w-8 h-8" />}
            titulo="Controle de Empresas"
            descricao="Cadastre empresas, monitore prazos, acompanhe serviços realizados e tenha visibilidade total da operação contábil."
          />
        </div>
      </section>

      {/* Como funciona */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700">Como funciona?</h2>
        <ol className="list-decimal text-left text-gray-700 space-y-3 ml-6 text-base">
          <li>Crie sua conta na plataforma e escolha o plano ideal.</li>
          <li>Cadastre seus certificados digitais e empresas.</li>
          <li>Selecione os serviços a serem executados ou automatizados.</li>
          <li>Acompanhe os resultados, baixe arquivos e mantenha o controle.</li>
        </ol>
      </section>
    </div>
  );
}
