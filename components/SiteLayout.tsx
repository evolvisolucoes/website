'use client';

import { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export default function SiteLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const [isPublicRoute, setisPublicRoute] = useState(false);

	useEffect(() => {
		// Defina aqui as rotas sem header
		const noFooterRoutes = ['/', '/login', '/admin/login'];
		setisPublicRoute(!noFooterRoutes.includes(pathname));
	}, [pathname]);

	return (
		<div className="flex flex-col min-h-screen bg-gray-50">
			<main className="flex-1">{children}</main>
			{!isPublicRoute && <Footer />}
		</div>
	);
}
