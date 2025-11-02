import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { User } from '@/types/user';

const USER_STORAGE_KEY = 'user-profile';

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { mutate: syncUser } = useMutation({
    mutationFn: async (user: User | null) => {
      if (user) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
      return user;
    }
  });

  useEffect(() => {
    if (userQuery.data !== undefined) {
      setUser(userQuery.data);
    }
  }, [userQuery.data]);

  const signIn = useCallback((userData: User) => {
    setUser(userData);
    syncUser(userData);
  }, [syncUser]);

  const signOut = useCallback(() => {
    setUser(null);
    syncUser(null);
  }, [syncUser]);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    syncUser(updatedUser);
  }, [user, syncUser]);

  const calculateBMR = useCallback(() => {
    if (!user?.weight || !user?.height || !user?.age) return 0;
    
    const bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
    
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9,
    };
    
    const tdee = bmr * (activityMultipliers[user.activityLevel || 'moderate']);
    
    if (user.goal === 'lose') return Math.round(tdee - 500);
    if (user.goal === 'gain') return Math.round(tdee + 500);
    return Math.round(tdee);
  }, [user]);

  return useMemo(() => ({
    user,
    isAuthenticated: !!user,
    signIn,
    signOut,
    updateProfile,
    calculateBMR,
    isLoading: userQuery.isLoading,
  }), [user, signIn, signOut, updateProfile, calculateBMR, userQuery.isLoading]);
});
