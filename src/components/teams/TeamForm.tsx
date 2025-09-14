import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Team, Profile } from '../../lib/supabase';

interface TeamFormProps {
  team?: Team | null;
  onSave: () => void;
  onCancel: () => void;
}

export function TeamForm({ team, onSave, onCancel }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'masculine' as 'masculine' | 'feminine',
    age_group: '',
    coach_id: '',
    season: '2024/2025',
    description: '',
  });
  const [coaches, setCoaches] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ageGroups = [
    'Sub12 - M', 'Sub12 - F', 'Sub14 - M', 'Sub14 - F',
    'Sub16 - M', 'Sub16 - F', 'Sub18 - M', 'Sub18 - F',
    'Sen - M', 'Sen - F', 'Veteranas', 'Veteranos'
  ];

  useEffect(() => {
    fetchCoaches();
    if (team) {
      setFormData({
        name: team.name,
        category: team.category,
        age_group: team.age_group,
        coach_id: team.coach_id || '',
        season: team.season,
        description: team.description || '',
      });
    }
  }, [team]);

  const fetchCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['coach', 'admin'])
        .order('full_name');

      if (error) throw error;
      setCoaches(data || []);
    } catch (err) {
      console.error('Error fetching coaches:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const teamData = {
        ...formData,
        coach_id: formData.coach_id || null,
      };

      if (team) {
        // Atualizar equipa existente
        const { error } = await supabase
          .from('teams')
          .update(teamData)
          .eq('id', team.id);

        if (error) throw error;
      } else {
        // Criar nova equipa
        const { error } = await supabase
          .from('teams')
          .insert([teamData]);

        if (error) throw error;
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar equipa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {team ? 'Editar Equipa' : 'Nova Equipa'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Equipa *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="age_group" className="block text-sm font-medium text-gray-700 mb-2">
              Escalão *
            </label>
            <select
              id="age_group"
              value={formData.age_group}
              onChange={(e) => {
                const ageGroup = e.target.value;
                setFormData(prev => ({ 
                  ...prev, 
                  age_group: ageGroup,
                  category: ageGroup.includes(' - M') ? 'masculine' : 'feminine'
                }));
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">Selecionar escalão</option>
              {ageGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'masculine' | 'feminine' }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
              disabled
            >
              <option value="masculine">Masculino</option>
              <option value="feminine">Feminino</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Definido automaticamente pelo escalão</p>
          </div>

          <div>
            <label htmlFor="coach_id" className="block text-sm font-medium text-gray-700 mb-2">
              Treinador
            </label>
            <select
              id="coach_id"
              value={formData.coach_id}
              onChange={(e) => setFormData(prev => ({ ...prev, coach_id: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">Sem treinador atribuído</option>
              {coaches.map(coach => (
                <option key={coach.id} value={coach.id}>
                  {coach.full_name} ({coach.role === 'admin' ? 'Admin' : 'Treinador'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-2">
              Temporada *
            </label>
            <input
              type="text"
              id="season"
              value={formData.season}
              onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))}
              placeholder="2024/2025"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Informações adicionais sobre a equipa..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{team ? 'Atualizar' : 'Criar'} Equipa</span>
          </button>
        </div>
      </form>
    </div>
  );
}