'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutUsuario } from '@/lib/mockDB';
import { useRouter } from 'next/navigation';

const links = [
  { label: 'Dashboard', href: '/user' },
  { label: 'Histórico', href: '/user/historico' },
  { label: 'Serviços', href: '/user/servicos' },
  { label: 'Perfil', href: '/user/perfil' },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logoutUsuario();
    router.replace('/login');
  };

  return (
    <aside className="w-64 bg-white border-r h-screen fixed top-0 left-0 flex flex-col justify-between px-4 py-6 z-40">
      <div>
        <h1 className="text-2xl font-bold text-blue-700 mb-6 pl-4">Menu</h1>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`block px-4 py-2 rounded text-sm cursor-pointer hover:bg-blue-50 ${
                  pathname === link.href
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50 transition"
      >
        Sair
      </button>
    </aside>
  );
}

// 'use client';

// import type { FC } from "react";
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { logoutUsuario } from '@/lib/mockDB';
// import { useRouter } from 'next/navigation';

// interface UserSidebarProps {
//   className?: string;
// }

// const links = [
//   { label: 'Dashboard', href: '/user' },
//   { label: 'Histórico', href: '/user/historico' },
//   { label: 'Serviços', href: '/user/servicos' },
//   { label: 'Perfil', href: '/user/perfil' },
// ];

// const UserSidebar: FC<UserSidebarProps> = ({ className }) => {
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleLogout = () => {
//     logoutUsuario();
//     router.replace('/login');
//   };

//   return (
//     <aside className={`bg-white shadow h-full ${className ?? ""}`}>
//       <div>
//         <h1 className="text-2xl font-bold text-blue-700 mb-6">Evolvi</h1>
//         <nav className="space-y-2">
//           {links.map((link) => (
//             <Link key={link.href} href={link.href}>
//               <span
//                 className={`block px-4 py-2 rounded text-sm cursor-pointer hover:bg-blue-50 ${
//                   pathname === link.href ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'
//                 }`}
//               >
//                 {link.label}
//               </span>
//             </Link>
//           ))}
//         </nav>
//       </div>
//       <button
//         onClick={handleLogout}
//         className="text-sm text-red-600 border border-red-600 px-4 py-2 rounded hover:bg-red-50 transition"
//       >
//         Sair
//       </button>
//     </aside>
//   );
// }
// export default UserSidebar;