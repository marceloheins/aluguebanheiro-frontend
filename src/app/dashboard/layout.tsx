// src/app/dashboard/layout.tsx
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Building2,
  ChevronDown
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { queryClient } from '@/lib/react-query';

interface TokenPayload {
  tenantName?: string;
  role?: string;
  name?: string; // Adicionado para ler o nome do usuário do token
}

// Mapeamento amigável dos cargos do Prisma
const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  DISPATCHER: 'Operador de Pátio',
  DRIVER: 'Motorista'
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Estados do Usuário e Tenant
  const [tenantName, setTenantName] = useState<string>('Minha Empresa');
  const [userName, setUserName] = useState<string>('Usuário');
  const [userRole, setUserRole] = useState<string>('');
  
  // Controle do Menu Dropdown do Perfil
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get('saas_token');
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        if (decoded.tenantName) setTenantName(decoded.tenantName);
        if (decoded.name) setUserName(decoded.name);
        if (decoded.role) setUserRole(decoded.role);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    queryClient.clear();
    Cookies.remove('saas_token', { path: '/'});
    window.location.href = '/login';
  };

  // Função para pegar as iniciais do nome (Ex: "Marcelo Alves" -> "MA")
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const menuItems = [
    { label: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Gestão de Pátio', href: '/dashboard/yard', icon: Truck },
    { label: 'Equipamentos', href: '/dashboard/equipments', icon: Package },
    { label: 'Clientes', href: '/dashboard/customers', icon: Users },
    { label: 'Locações', href: '/dashboard/rentals', icon: CalendarCheck },
    { label: 'Despachos & Entregas', href: '/dashboard/dispatches', icon: Send },
    { label: 'Faturamento', href: '/dashboard/billing', icon: Receipt },
    { label: 'Usuários & Permissões', href: '/dashboard/users', icon: ShieldUser },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex shadow-sm">
        <div>
          {/* Logo / Header da Marca e do Tenant */}
          <div className="p-6 border-b border-gray-100">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent" title={tenantName}>
              {tenantName}
            </span>
            
            <div className="mt-2 flex items-center gap-1.5 bg-blue-50/70 border border-blue-100 px-2.5 py-1 rounded-md">
             
              <span className="text-xs font-semibold text-blue-900 truncate" >
                byAlugue Banheiro
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

        
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar responsiva */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between md:justify-end relative">
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-sm font-bold text-gray-900">AlugueBanheiro</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">{tenantName}</span>
          </div>
          
          {/* Menu do Usuário (Dropdown) */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition border border-transparent hover:border-gray-200"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-medium flex items-center justify-center text-xs">
                {getInitials(userName)}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-bold text-gray-800 leading-none">{userName}</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase mt-1">
                  {roleLabels[userRole] || userRole || 'Usuário'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            {/* Dropdown Aberto */}
            {isProfileOpen && (
              <>
                {/* Overlay invisível para fechar ao clicar fora */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 sm:hidden">
                    <p className="text-sm font-bold text-gray-800 truncate">{userName}</p>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase">{roleLabels[userRole] || userRole}</p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da Conta
                  </button>
                </div>
              </>
            )}
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