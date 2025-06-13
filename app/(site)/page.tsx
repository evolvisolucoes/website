'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  FileText,
  ShieldCheck,
  Workflow,
  Zap,
  Settings,
  Phone,
  Users,
  Info,
  ThumbsUp,
  CalendarCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-100 transition-all duration-300 hover:shadow-lg"
    >
      <div className="text-blue-600">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800">{titulo}</h3>
      <p className="text-sm text-gray-600">{descricao}</p>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white sticky top-0 z-50">
        <Image src="/logo.svg" alt="Logo Evolvi" width={120} height={40} />
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <a href="#automacoes" className="hover:text-blue-600">
            Automações
          </a>
          <a href="#processos" className="hover:text-blue-600">
            Processos
          </a>
          <a href="#recursos" className="hover:text-blue-600">
            Recursos
          </a>
          <a href="#sobre" className="hover:text-blue-600">
            Sobre
          </a>
          <a href="#contato" className="hover:text-blue-600">
            Contato
          </a>
        </nav>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
        >
          Acessar Plataforma
        </Link>
      </header>

      <main className="text-center px-4 py-20 sm:px-6 lg:px-8 space-y-24 bg-gradient-to-b from-white to-blue-50">
        <section className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight text-blue-800">
            Contabilidade digital sem complicações
          </h1>
          <p className="text-gray-700 text-lg sm:text-xl max-w-2xl mx-auto">
            Centralize processos, automatize entregas e otimize seu escritório com a plataforma Evolvi.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Comece Agora
          </Link>
        </section>

        <section id="recursos" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto space-y-12 px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 text-center">
              Por que escolher a Evolvi?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <Funcao
                icon={<ThumbsUp className="w-8 h-8" />}
                titulo="Simples e Intuitiva"
                descricao="Interface feita para facilitar o dia a dia contábil com usabilidade real."
              />
              <Funcao
                icon={<FileText className="w-8 h-8" />}
                titulo="Geração de Documentos"
                descricao="Relatórios e obrigações acessíveis e organizados em um só lugar."
              />
              <Funcao
                icon={<CalendarCheck className="w-8 h-8" />}
                titulo="Controle Total"
                descricao="Acompanhe prazos e agendamentos em uma única visão consolidada."
              />
            </div>
          </div>
        </section>

        <section id="automacoes" className="max-w-6xl mx-auto px-4 space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-700">
            Automações Inteligentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <Funcao
              icon={<Zap className="w-8 h-8" />}
              titulo="Obrigações Automatizadas"
              descricao="Envio de DET, EFD, apurações e tarefas recorrentes com um clique."
            />
            <Funcao
              icon={<Settings className="w-8 h-8" />}
              titulo="Agendamentos Dinâmicos"
              descricao="Configure execuções mensais, personalizadas e com alertas inteligentes."
            />
          </div>
        </section>

        <section id="processos" className="max-w-6xl mx-auto px-4 space-y-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-700">
            Gestão de Processos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
            <Funcao
              icon={<Workflow className="w-8 h-8" />}
              titulo="Organização Centralizada"
              descricao="Empresas, certificados, tarefas e prazos: tudo num só lugar."
            />
            <Funcao
              icon={<ShieldCheck className="w-8 h-8" />}
              titulo="Segurança de Dados"
              descricao="Gerencie certificados com proteção e alertas automáticos."
            />
            <Funcao
              icon={<Briefcase className="w-8 h-8" />}
              titulo="Controle de Empresas"
              descricao="Monitore atividades e relatórios em tempo real."
            />
          </div>
        </section>

        <section id="sobre" className="max-w-4xl mx-auto space-y-6 text-left px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-700">Sobre a Evolvi</h2>
          <p className="text-gray-700 text-lg">
            A <strong className="text-blue-700">Evolvi</strong> é uma plataforma criada por especialistas em contabilidade e tecnologia para transformar o dia a dia de escritórios contábeis. Automatize rotinas, reduza riscos e alcance novos níveis de produtividade.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>100% online, sem necessidade de instalação</li>
            <li>Alta escalabilidade para sua base de clientes</li>
            <li>Suporte técnico com especialistas reais</li>
          </ul>
        </section>

        <section id="contato" className="bg-blue-50 py-20">
          <div className="max-w-4xl mx-auto space-y-6 text-left px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-700">Fale com a gente</h2>
            <p className="text-gray-700 text-lg">
              Estamos prontos para tirar dúvidas, apresentar a plataforma ou iniciar uma parceria.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <Phone className="w-5 h-5 text-blue-600" />
                <span>(32) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Info className="w-5 h-5 text-blue-600" />
                <span>evolvisolucoes@gmail.com</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
