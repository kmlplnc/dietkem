export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  lastUpdate: string;
  goals: string[];
  medicalConditions?: string[];
  allergies?: string[];
  dietaryRestrictions?: string[];
  notes?: string;
}

export interface Measurement {
  id: string;
  clientId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  waist?: number;
  hips?: number;
  chest?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
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