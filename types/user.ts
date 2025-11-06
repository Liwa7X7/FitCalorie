export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: 'lose' | 'maintain' | 'gain';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  targetCalories?: number;
  avatar?: string;
}

export interface UserSettings {
  dailyCalorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  notifications: boolean;
}
