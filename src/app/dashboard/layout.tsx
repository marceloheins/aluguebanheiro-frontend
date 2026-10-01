// src/app/dashboard/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Truck, 
  Package, 
  Users, 
  CalendarCheck, 
  Send, 
  Receipt, 
  ShieldUser, 
  LogOut,
  Building2
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Caso utilize para ler o token (ou ajuste conforme sua store/context)

interface TokenPayload {
  tenantName?: string;
  role?: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [tenantName, setTenantName] = useState<string>('Minha Empresa');

  useEffect(() => {
    const token = Cookies.get('saas_token');
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        if (decoded.tenantName) {
          setTenantName(decoded.tenantName);
        } else {
          // Fallback amigável caso o token traga o ID
          setTenantName('Empresa Conectada');
        }
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('saas_token');
    router.push('/login');
  };

  const menuItems = [
    { label: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Gestão de Pátio', href: '/dashboard/yard', icon: Truck },
    { label: 'Equipamentos', href: '/dashboard/equipments', icon: Package },
    { label: 'Clientes', href: '/dashboard/customers', icon: Users },
    { label: 'Locações / Rentals', href: '/dashboard/rentals', icon: CalendarCheck },
    { label: 'Despachos & Entregas', href: '/dashboard/dispatches', icon: Send },
    { label: 'Faturamento / Billing', href: '/dashboard/billing', icon: Receipt },
    { label: 'Usuários & Permissões', href: '/dashboard/users', icon: ShieldUser },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex shadow-sm">
        <div>
          {/* Logo / Header da Marca e do Tenant */}
          <div className="p-6 border-b border-gray-100">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AlugueBanheiro
            </span>
            
            {/* Indicador do Tenant (Empresa Compradora) */}
            <div className="mt-2 flex items-center gap-1.5 bg-blue-50/70 border border-blue-100 px-2.5 py-1 rounded-md">
              <Building2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-blue-900 truncate" title={tenantName}>
                {tenantName}
              </span>
            </div>
          </div>

          {/* Links de Navegação */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar / Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar responsiva */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between md:justify-end">
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-sm font-bold text-gray-900">AlugueBanheiro</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">{tenantName}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-medium flex items-center justify-center text-xs">
              AD
            </div>
            <span className="text-xs font-medium text-gray-700 hidden sm:inline">Administrador</span>
          </div>
        </header>

        {/* View dinâmica */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}