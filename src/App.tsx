import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/LoginForm';
import { supabase } from './lib/supabase';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TeamList } from './components/teams/TeamList';
import { ExerciseList } from './components/exercises/ExerciseList';
// import { TrainingList } from './components/trainings/TrainingList';

const sectionTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  teams: 'Equipas',
  players: 'Jogadores',
  exercises: 'Exercícios',
  trainings: 'Treinos',
  events: 'Eventos',
  payments: 'Pagamentos',
  stats: 'Estatísticas',
  settings: 'Configurações',
  team: 'Minha Equipa',
  profile: 'Meu Perfil',
  attendance: 'Presenças',
  children: 'Meus Filhos',
};

function App() {
  const { user, profile, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verificar conexão com Supabase
  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (error) throw error;
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Supabase connection error:', error);
        setConnectionStatus('error');
      }
    };
    
    checkConnection();
  }, []);

  if (connectionStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-red-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro de Conexão</h2>
          <p className="text-gray-600 mb-4">
            Não foi possível conectar ao Supabase. Verifique se:
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-1 mb-6">
            <li>• O Supabase está configurado</li>
            <li>• As variáveis de ambiente estão corretas</li>
            <li>• A migração da base de dados foi executada</li>
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'teams':
        return <TeamList />;
      case 'exercises':
        return <ExerciseList />;
      case 'trainings':
        return <TrainingList />;
      case 'players':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Jogadores</h3>
            <p className="text-gray-600">Esta funcionalidade será implementada em breve.</p>
          </div>
        );
      case 'events':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Eventos</h3>
            <p className="text-gray-600">Esta funcionalidade será implementada em breve.</p>
          </div>
        );
      case 'payments':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestão de Pagamentos</h3>
            <p className="text-gray-600">Esta funcionalidade será implementada em breve.</p>
          </div>
        );
      case 'stats':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Estatísticas</h3>
            <p className="text-gray-600">Esta funcionalidade será implementada em breve.</p>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Em Desenvolvimento</h3>
            <p className="text-gray-600">Esta secção será implementada em breve.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} userProfile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={sectionTitles[activeSection] || 'SportClub'} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;