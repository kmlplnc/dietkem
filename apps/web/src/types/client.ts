export interface Client {
  id: number;
  name: string | null;
  gender: string | null;
  birth_date: string | null;
  height_cm: number | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  diseases: string | null; // JSON stringified array
  allergies: string | null; // JSON stringified array
  medications: string | null; // JSON stringified array
  has_active_plan: boolean;
  status: string;
  created_at: string | null;
  activity_level: string | null;
}

export interface Measurement {
  id: number;
  client_id: number;
  measured_at: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  waist_cm: number | null;
  hips_cm: number | null;
  chest_cm: number | null;
  arms_cm: number | null;
  thighs_cm: number | null;
  notes: string | null;
}

export interface MealPlan {
  id: string;
  clientId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  meals: Meal[];
  notes?: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
  notes?: string;
}

export interface Food {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Log {
  id: string;
  clientId: string;
  date: string;
  type: 'weight' | 'measurement' | 'meal' | 'exercise' | 'note';
  content: string;
  notes?: string;
}

export interface Note {
  id: string;
  clientId: string;
  date: string;
  title: string;
  content: string;
  tags?: string[];
} 