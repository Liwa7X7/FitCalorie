import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User } from '@/types/user';
import { auth, db } from '@/constants/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  signUp: (userData: Omit<User, 'id'>, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  calculateBMR: () => number;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = useCallback(async (userData: Omit<User, 'id'>, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
    const firebaseUser = userCredential.user;
    const userProfile: User = { id: firebaseUser.uid, ...userData };
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    setUser(userProfile);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.id), updates);
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updates } : null));
  }, [user]);

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

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    calculateBMR,
    isLoading,
  }), [user, signUp, signIn, signOut, updateProfile, calculateBMR, isLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
