import React, { useState } from 'react';
import { Trophy, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('player');
  const { signIn, signUp, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      await signUp(email, password, fullName, role);
    } else {
      await signIn(email, password);
    }
  };

  const testCredentials = [
    { email: 'admin@clube.pt', role: 'Administrador' },
    { email: 'treinador@clube.pt', role: 'Treinador' },
    { email: 'jogador@clube.pt', role: 'Jogador' },
    { email: 'coordenador@clube.pt', role: 'Coordenador' },
    { email: 'pai@clube.pt', role: 'Pai/Encarregado' },
    { email: 'dirigente@clube.pt', role: 'Dirigente' },
  ];

  const fillTestCredentials = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">SportClub</h1>
          <p className="text-blue-100">Sistema de Gestão do Clube</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {!isSignUp && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">Credenciais de Teste:</h4>
                <div className="space-y-2">
                  {testCredentials.map((cred) => (
                    <button
                      key={cred.email}
                      type="button"
                      onClick={() => fillTestCredentials(cred.email)}
                      className="w-full text-left px-3 py-2 text-sm bg-white border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium text-blue-900">{cred.role}</span>
                        <span className="text-blue-600">{cred.email}</span>
                      </div>
                    </button>
                  ))}
                  <p className="text-xs text-blue-800 mt-2 font-medium">
                    Password: 123456 (para todos)
                  </p>
                </div>
              </div>
            )}

            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            )}

            {isSignUp && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Perfil
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                >
                  <option value="player">Jogador</option>
                  <option value="coach">Treinador</option>
                  <option value="parent">Pai/Encarregado</option>
                  <option value="director">Dirigente</option>
                  <option value="coordinator">Coordenador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Erro de Autenticação</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <p className="text-red-600 text-xs mt-2">
                    Certifique-se de que o Supabase está configurado e que os utilizadores de teste foram criados.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{isSignUp ? 'Criar Conta' : 'Entrar'}</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {isSignUp ? 'Já tem conta? Faça login' : 'Não tem conta? Registe-se'}
              </button>
            </div>
          </div>
        </form>

        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {!isSignUp ? 'Clique numa credencial de teste acima para login rápido' : 'Problemas de acesso? Contacte o administrador do sistema.'}
          </p>
        </div>
      </div>
    </div>
  );
}