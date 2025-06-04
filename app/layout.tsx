import "styles/globals.css";
import { ReactNode } from "react";
import AppLayout from "@/components/AppLayout";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
	title: "Plataforma SaaS",
	description: "Gerencie certificados, empresas e serviços com facilidade.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="pt-BR" className="h-full">
			<body className="h-full bg-white text-gray-900">
				<AuthProvider>
					<AppLayout>{children}</AppLayout>
				</AuthProvider>
			</body>
		</html>
	);
}
