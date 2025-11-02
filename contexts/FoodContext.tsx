import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { FoodItem } from '@/types/food';

const STORAGE_KEY = 'food-history';

export const [FoodProvider, useFood] = createContextHook(() => {
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const foodsQuery = useQuery({
    queryKey: ['foods'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { mutate: syncMutate } = useMutation({
    mutationFn: async (foods: FoodItem[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
      return foods;
    }
  });

  useEffect(() => {
    if (foodsQuery.data) {
      setFoods(foodsQuery.data);
    }
  }, [foodsQuery.data]);

  const addFood = useCallback((food: FoodItem) => {
    const updated = [food, ...foods];
    setFoods(updated);
    syncMutate(updated);
  }, [foods, syncMutate]);

  const removeFood = useCallback((id: string) => {
    const updated = foods.filter(f => f.id !== id);
    setFoods(updated);
    syncMutate(updated);
  }, [foods, syncMutate]);

  const getTodayCalories = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return foods
      .filter(f => f.timestamp >= today.getTime())
      .reduce((sum, f) => sum + f.calories, 0);
  }, [foods]);

  const getTodayMacros = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayFoods = foods.filter(f => f.timestamp >= today.getTime());
    
    return {
      protein: todayFoods.reduce((sum, f) => sum + f.protein, 0),
      carbs: todayFoods.reduce((sum, f) => sum + f.carbs, 0),
      fat: todayFoods.reduce((sum, f) => sum + f.fat, 0),
    };
  }, [foods]);

  return useMemo(() => ({
    foods,
    addFood,
    removeFood,
    getTodayCalories,
    getTodayMacros,
    isLoading: foodsQuery.isLoading,
  }), [foods, addFood, removeFood, getTodayCalories, getTodayMacros, foodsQuery.isLoading]);
});
