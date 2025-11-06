export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  servingSize: string;
  imageUri: string;
  timestamp: number;
}

export interface NutritionAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  servingSize: string;
  confidence: number;
}
