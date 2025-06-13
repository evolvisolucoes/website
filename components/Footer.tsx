'use client';

export default function Footer() {
  return (
<footer className="bg-white py-8 border-t">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm px-4">
          © {new Date().getFullYear()} Evolvi. Todos os direitos reservados. |{' '}
          <a href="#" className="underline">
            Política de Privacidade
          </a>
        </div>
      </footer>
  );
}
