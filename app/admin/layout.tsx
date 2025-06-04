'use client';

import { ReactNode } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import SiteLayout from '@/components/SiteLayout';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default function AdminLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	if (pathname === '/admin/login') {
		return (
			<AdminAuthProvider>
				<div className="flex flex-col min-h-screen bg-gray-50">
					<SiteLayout>
						<main className="flex-1 flex items-center justify-center">{children}</main>
					</SiteLayout>
				</div>
			</AdminAuthProvider>
		);
	}

	return (
		<AdminAuthProvider>
			<div className="flex min-h-screen">
				<AdminSidebar />
				<div className="flex-1 flex flex-col">
					<Header />
					<main className="flex-1 p-8 bg-gray-50">{children}</main>
					<Footer />
				</div>
			</div>
		</AdminAuthProvider>
	);
}
