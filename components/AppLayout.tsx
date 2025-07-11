import "styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Evolvi",
  description: "Gerencie certificados, empresas e serviços com facilidade.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
