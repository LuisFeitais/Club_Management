import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para TypeScript
export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'coach' | 'player' | 'coordinator' | 'parent' | 'director';
  team_id?: string;
  parent_id?: string;
  birth_date?: string;
  weight?: number;
  height?: number;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  category: 'masculine' | 'feminine';
  age_group: string;
  coach_id?: string;
  season: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  profile_id: string;
  team_id: string;
  jersey_number?: number;
  position?: string;
  medical_info?: string;
  emergency_contact?: string;
  
  // Dados antropométricos
  height?: number;
  weight?: number;
  bmi?: number;
  wingspan?: number;
  trunk_length?: number;
  
  // Perímetros corporais
  neck_circumference?: number;
  shoulder_circumference?: number;
  chest_circumference?: number;
  relaxed_arm_circumference?: number;
  contracted_arm_circumference?: number;
  forearm_circumference?: number;
  waist_circumference?: number;
  hip_circumference?: number;
  proximal_thigh_circumference?: number;
  
  // Comprimentos segmentares
  arm_length?: number;
  forearm_length?: number;
  thigh_length?: number;
  leg_length?: number;
  foot_length?: number;
  
  // Proporções corporais
  waist_hip_ratio?: number;
  wingspan_height_ratio?: number;
  conicity_index?: number;
  
  // Somatotipo
  endomorphy?: number;
  mesomorphy?: number;
  ectomorphy?: number;
  
  created_at: string;
  updated_at: string;
  
  // Relações
  profile?: Profile;
  team?: Team;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'physical' | 'tactical' | 'warm_up' | 'cool_down';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  instructions: string;
  video_url?: string;
  image_url?: string;
  age_groups: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: 'training' | 'match' | 'tournament' | 'meeting' | 'other';
  start_date: string;
  end_date: string;
  location?: string;
  team_id?: string;
  created_by: string;
  is_recurring?: boolean;
  recurrence_pattern?: any;
  parent_event_id?: string;
  created_at: string;
  updated_at: string;
  
  // Relações
  team?: Team;
  training_exercises?: TrainingExercise[];
}

export interface TrainingExercise {
  id: string;
  event_id: string;
  exercise_id: string;
  order_position: number;
  duration_minutes: number;
  notes?: string;
  created_at: string;
  
  // Relações
  exercise?: Exercise;
}

export interface Attendance {
  id: string;
  event_id: string;
  player_id: string;
  status: 'present' | 'absent' | 'late' | 'justified';
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relações
  player?: Player;
}

export interface Match {
  id: string;
  event_id: string;
  opponent_team: string;
  home_away: 'home' | 'away';
  our_score?: number;
  opponent_score?: number;
  match_status: 'scheduled' | 'in_progress' | 'finished' | 'cancelled';
  referee?: string;
  created_at: string;
  updated_at: string;
  
  // Relações
  event?: Event;
  player_stats?: PlayerStats[];
  team_stats?: TeamStats;
}

export interface PlayerStats {
  id: string;
  match_id: string;
  player_id: string;
  
  // Estatísticas gerais
  goals: number;
  assists: number;
  shots_missed: number;
  ball_losses: number;
  ball_recoveries: number;
  exclusions_2min: number;
  yellow_cards: number;
  red_cards: number;
  blue_cards: number;
  fouls_committed: number;
  
  // Estatísticas de guarda-redes
  saves: number;
  saves_7m: number;
  goals_conceded: number;
  goalkeeper_exits: number;
  
  minutes_played: number;
  rating?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relações
  player?: Player;
}

export interface TeamStats {
  id: string;
  match_id: string;
  ball_possession_percentage?: number;
  offensive_efficiency?: number;
  defensive_efficiency?: number;
  counter_attacks: number;
  counter_attacks_successful: number;
  seven_meters_obtained: number;
  seven_meters_converted: number;
  turnovers: number;
  formation_6_0_time: number;
  formation_5_1_time: number;
  formation_3_2_1_time: number;
  positional_attack_success?: number;
  counter_attack_success?: number;
  fast_break_success?: number;
  zone_defense_success?: number;
  individual_defense_success?: number;
  mixed_defense_success?: number;
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
  
  // Relações
  player?: Player;
}