// Sistema de autenticação mock para desenvolvimento/testes
export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'coach' | 'player' | 'coordinator' | 'parent' | 'director';
  team_id?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

// Usuários de teste para cada perfil
export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@clube.pt',
    full_name: 'João Administrador',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'treinador@clube.pt',
    full_name: 'Maria Treinadora',
    role: 'coach',
    team_id: 'team-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'jogador@clube.pt',
    full_name: 'Pedro Jogador',
    role: 'player',
    team_id: 'team-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    email: 'coordenador@clube.pt',
    full_name: 'Ana Coordenadora',
    role: 'coordinator',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    email: 'pai@clube.pt',
    full_name: 'Carlos Pai',
    role: 'parent',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    email: 'dirigente@clube.pt',
    full_name: 'Sofia Dirigente',
    role: 'director',
    team_id: 'team-1',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export class MockAuthService {
  private currentUser: MockUser | null = null;
  private listeners: ((user: MockUser | null) => void)[] = [];

  async signIn(email: string, password: string): Promise<{ user: MockUser | null; error: string | null }> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Qualquer password funciona para demo
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return { user: null, error: 'Email não encontrado' };
    }

    this.currentUser = user;
    this.notifyListeners();
    
    return { user, error: null };
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners();
  }

  getCurrentUser(): MockUser | null {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback);
    
    // Retorna função para remover listener
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export const mockAuth = new MockAuthService();