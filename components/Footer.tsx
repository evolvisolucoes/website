'use client';

export default function Footer() {
  return (
    <footer className="text-sm text-center text-gray-500 border-t p-4">
      © {new Date().getFullYear()} Evolvi Soluções. Todos os direitos
      reservados.
    </footer>
  );
}
