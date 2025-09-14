import React, { useState, useEffect } from 'react';
import { Users, Trophy, Calendar, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

export function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalPlayers: 0,
    eventsThisMonth: 0,
    pendingPayments: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas
      const [teamsResult, playersResult, eventsResult, paymentsResult] = await Promise.all([
        supabase.from('teams').select('id', { count: 'exact' }),
        supabase.from('players').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }).gte('start_date', new Date().toISOString().slice(0, 7) + '-01'),
        supabase.from('payments').select('amount', { count: 'exact' }).eq('status', 'pending'),
      ]);

      setStats({
        totalTeams: teamsResult.count || 0,
        totalPlayers: playersResult.count || 0,
        eventsThisMonth: eventsResult.count || 0,
        pendingPayments: paymentsResult.data?.reduce((sum, p) => sum + p.amount, 0) || 0,
      });

      // Buscar próximos eventos
      const { data: events } = await supabase
        .from('events')
        .select(`
          *,
          teams (name)
        `)
        .gte('start_date', new Date().toISOString())
        .order('start_date')
        .limit(5);

      setUpcomingEvents(events || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (section: string) => {
    // Implementar navegação para seções específicas
    console.log(`Navigate to ${section}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => handleCardClick('teams')} className="cursor-pointer">
          <DashboardCard
            title="Total de Equipas"
            value={stats.totalTeams}
            icon={Users}
            color="blue"
          />
        </div>
        <div onClick={() => handleCardClick('players')} className="cursor-pointer">
          <DashboardCard
            title="Jogadores Ativos"
            value={stats.totalPlayers}
            icon={Trophy}
            color="green"
          />
        </div>
        <div onClick={() => handleCardClick('events')} className="cursor-pointer">
          <DashboardCard
            title="Eventos Este Mês"
            value={stats.eventsThisMonth}
            icon={Calendar}
            color="orange"
          />
        </div>
        {profile?.role !== 'player' && (
          <div onClick={() => handleCardClick('payments')} className="cursor-pointer">
            <DashboardCard
              title="Pagamentos Pendentes"
              value={`€${stats.pendingPayments.toFixed(2)}`}
              icon={CreditCard}
              color="red"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.teams?.name || 'Geral'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(event.start_date).toLocaleDateString('pt-PT')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.start_date).toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum evento próximo</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
              <p className="text-sm font-medium text-gray-900">Sistema atualizado com sucesso</p>
              <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
            </div>
            <div className="p-3 rounded-lg border bg-green-50 border-green-200">
              <p className="text-sm font-medium text-gray-900">Base de dados configurada</p>
              <p className="text-xs text-gray-500 mt-1">Há 1 dia</p>
            </div>
          </div>
        </div>
      </div>

      {upcomingEvents.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calendário de Eventos</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Evento</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Equipa</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Local</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                </tr>
              </thead>
              <tbody>
                {upcomingEvents.map((event) => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{event.title}</td>
                    <td className="py-3 px-4 text-gray-600">{event.teams?.name || 'Geral'}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(event.start_date).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{event.location || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        event.event_type === 'match' ? 'bg-blue-100 text-blue-800' :
                        event.event_type === 'training' ? 'bg-green-100 text-green-800' :
                        event.event_type === 'tournament' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {event.event_type === 'match' ? 'Jogo' :
                         event.event_type === 'training' ? 'Treino' :
                         event.event_type === 'tournament' ? 'Torneio' :
                         event.event_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}