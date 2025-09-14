export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  team_id?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'admin' | 'coach' | 'player' | 'coordinator' | 'parent' | 'director';

export interface Team {
  id: string;
  name: string;
  category: 'masculine' | 'feminine';
  age_group: string;
  coach_id: string;
  season: string;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  user_id: string;
  team_id: string;
  jersey_number: number;
  position: string;
  birth_date: string;
  parent_contact?: string;
  medical_info?: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Training {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  training_id: string;
  player_id: string;
  status: 'present' | 'absent' | 'late' | 'justified';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  type: 'match' | 'tournament' | 'meeting' | 'other';
  team_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  player_id?: string;
  amount: number;
  description: string;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'overdue';
  payment_method?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerStats {
  id: string;
  player_id: string;
  match_id?: string;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  minutes_played: number;
  rating?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'physical' | 'tactical' | 'warm_up' | 'cool_down';
  duration: number; // em minutos
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  instructions: string;
  video_url?: string;
  image_url?: string;
  age_groups: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}