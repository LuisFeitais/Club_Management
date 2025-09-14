import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings,
  Trophy,
  ClipboardList,
  UserCheck,
  Bell,
  Target
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { Profile } from '../../lib/supabase';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userProfile: Profile;
}

const menuItems = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'teams', label: 'Equipas', icon: Users },
    { id: 'players', label: 'Jogadores', icon: Trophy },
    { id: 'exercises', label: 'Exercícios', icon: Target },
    { id: 'trainings', label: 'Treinos', icon: ClipboardList },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ],
  coach: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'team', label: 'Minha Equipa', icon: Users },
    { id: 'exercises', label: 'Exercícios', icon: Target },
    { id: 'trainings', label: 'Treinos', icon: ClipboardList },
    { id: 'attendance', label: 'Presenças', icon: UserCheck },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
  ],
  player: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Meu Perfil', icon: Trophy },
    { id: 'trainings', label: 'Treinos', icon: ClipboardList },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'stats', label: 'Minhas Stats', icon: BarChart3 },
  ],
  coordinator: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'teams', label: 'Equipas', icon: Users },
    { id: 'players', label: 'Jogadores', icon: Trophy },
    { id: 'exercises', label: 'Exercícios', icon: Target },
    { id: 'trainings', label: 'Treinos', icon: ClipboardList },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
  ],
  parent: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'children', label: 'Meus Filhos', icon: Trophy },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
  ],
  director: [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'team', label: 'Minha Equipa', icon: Users },
    { id: 'exercises', label: 'Exercícios', icon: Target },
    { id: 'trainings', label: 'Treinos', icon: ClipboardList },
    { id: 'events', label: 'Eventos', icon: Calendar },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
  ],
};

export function Sidebar({ activeSection, onSectionChange, userProfile }: SidebarProps) {
  const { user } = useAuth();

  if (!user || !userProfile) return null;

  const items = menuItems[userProfile.role] || [];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">SportClub</h2>
            <p className="text-sm text-gray-500 capitalize">{userProfile.role}</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {userProfile.full_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile.full_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}