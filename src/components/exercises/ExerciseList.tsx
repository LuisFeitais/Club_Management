import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Clock, Users, Target } from 'lucide-react';
import { mockExercises } from '../../lib/mockData';
import { ExerciseForm } from './ExerciseForm';
import type { Exercise } from '../../types';

export function ExerciseList() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'warm_up', label: 'Aquecimento' },
    { value: 'technical', label: 'Técnico' },
    { value: 'tactical', label: 'Tático' },
    { value: 'physical', label: 'Físico' },
    { value: 'cool_down', label: 'Relaxamento' },
  ];

  const difficulties = [
    { value: 'all', label: 'Todas as Dificuldades' },
    { value: 'beginner', label: 'Iniciante' },
    { value: 'intermediate', label: 'Intermédio' },
    { value: 'advanced', label: 'Avançado' },
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      warm_up: 'Aquecimento',
      technical: 'Técnico',
      tactical: 'Tático',
      physical: 'Físico',
      cool_down: 'Relaxamento',
    };
    return categoryMap[category] || category;
  };

  const getDifficultyLabel = (difficulty: string) => {
    const difficultyMap: Record<string, string> = {
      beginner: 'Iniciante',
      intermediate: 'Intermédio',
      advanced: 'Avançado',
    };
    return difficultyMap[difficulty] || difficulty;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      warm_up: 'bg-orange-100 text-orange-800',
      technical: 'bg-blue-100 text-blue-800',
      tactical: 'bg-purple-100 text-purple-800',
      physical: 'bg-red-100 text-red-800',
      cool_down: 'bg-green-100 text-green-800',
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colorMap: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return colorMap[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const handleSaveExercise = (exerciseData: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingExercise) {
      // Editar exercício existente
      setExercises(prev => prev.map(ex => 
        ex.id === editingExercise.id 
          ? { ...exerciseData, id: editingExercise.id, created_at: editingExercise.created_at, updated_at: new Date().toISOString() }
          : ex
      ));
    } else {
      // Criar novo exercício
      const newExercise: Exercise = {
        ...exerciseData,
        id: `exercise-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setExercises(prev => [newExercise, ...prev]);
    }
    
    setShowForm(false);
    setEditingExercise(null);
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowForm(true);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (confirm('Tem a certeza que deseja eliminar este exercício?')) {
      setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <ExerciseForm
        exercise={editingExercise}
        onSave={handleSaveExercise}
        onCancel={() => {
          setShowForm(false);
          setEditingExercise(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Exercícios</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Exercício</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Pesquisar exercícios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{exercise.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{exercise.description}</p>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => handleEditExercise(exercise)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(exercise.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(exercise.category)}`}>
                    {getCategoryLabel(exercise.category)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                    {getDifficultyLabel(exercise.difficulty)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{exercise.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{exercise.age_groups.length} escalões</span>
                  </div>
                </div>

                {exercise.equipment.length > 0 && (
                  <div className="flex items-start space-x-1 text-sm text-gray-600">
                    <Target className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{exercise.equipment.join(', ')}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Escalões: {exercise.age_groups.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' 
                ? 'Nenhum exercício encontrado com os filtros aplicados' 
                : 'Ainda não há exercícios criados'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}