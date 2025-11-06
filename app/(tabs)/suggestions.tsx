import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { Sparkles, ChefHat, Apple, Salad, Coffee, Cookie } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { useFood } from '@/contexts/FoodContext';
import { useMutation } from '@tanstack/react-query';
import { generateText } from '@rork/toolkit-sdk';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MealSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export default function SuggestionsScreen() {
  const { user, calculateBMR } = useUser();
  const { getTodayCalories, getTodayMacros } = useFood();
  const insets = useSafeAreaInsets();
  const [suggestions, setSuggestions] = useState<MealSuggestion[]>([]);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(statsAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(buttonsAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, []);

  const todayCalories = getTodayCalories();
  const todayMacros = getTodayMacros();
  const targetCalories = calculateBMR();
  const remainingCalories = Math.max(0, targetCalories - todayCalories);

  const suggestMutation = useMutation({
    mutationFn: async (mealType: string) => {
      const prompt = `Generate 3 ${mealType} meal suggestions for someone with:
- Remaining calories: ${remainingCalories} kcal
- Goal: ${user?.goal || 'maintain'} weight
- Activity level: ${user?.activityLevel || 'moderate'}
- Current protein: ${Math.round(todayMacros.protein)}g
- Current carbs: ${Math.round(todayMacros.carbs)}g
- Current fat: ${Math.round(todayMacros.fat)}g

For each meal, provide:
1. Meal name
2. Estimated calories
3. Protein (g)
4. Carbs (g)
5. Fat (g)
6. Brief description

Format: NAME | CALORIES | PROTEIN | CARBS | FAT | DESCRIPTION
(One meal per line)`;

      const response = await generateText(prompt);
      const lines = response.trim().split('\n');
      
      const meals: MealSuggestion[] = [];
      for (const line of lines) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length === 6) {
          meals.push({
            name: parts[0],
            calories: parseInt(parts[1]) || 0,
            protein: parseFloat(parts[2]) || 0,
            carbs: parseFloat(parts[3]) || 0,
            fat: parseFloat(parts[4]) || 0,
            description: parts[5],
            mealType: mealType as MealSuggestion['mealType'],
          });
        }
      }
      
      return meals;
    },
    onSuccess: (data) => {
      setSuggestions(data);
    },
    onError: (error) => {
      console.error('Error generating suggestions:', error);
    },
  });

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return Coffee;
      case 'lunch':
        return Salad;
      case 'dinner':
        return ChefHat;
      case 'snack':
        return Cookie;
      default:
        return Apple;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.headerTop}>
          <Sparkles size={32} color={Colors.light.primary} />
          <Text style={styles.headerTitle}>Meal Suggestions</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          AI-powered recommendations based on your goals
        </Text>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.statsCard,
            {
              opacity: statsAnim,
              transform: [
                {
                  scale: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Remaining Today</Text>
              <Text style={styles.statValue}>{remainingCalories}</Text>
              <Text style={styles.statUnit}>kcal</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Target</Text>
              <Text style={styles.statValue}>{targetCalories}</Text>
              <Text style={styles.statUnit}>kcal</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.mealTypes,
            {
              opacity: buttonsAnim,
              transform: [
                {
                  translateY: buttonsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Get Suggestions For</Text>
          <View style={styles.mealTypeGrid}>
            {[
              { type: 'breakfast', label: 'Breakfast', icon: Coffee },
              { type: 'lunch', label: 'Lunch', icon: Salad },
              { type: 'dinner', label: 'Dinner', icon: ChefHat },
              { type: 'snack', label: 'Snack', icon: Cookie },
            ].map((meal) => {
              const Icon = meal.icon;
              return (
                <TouchableOpacity
                  key={meal.type}
                  style={styles.mealTypeButton}
                  onPress={() => suggestMutation.mutate(meal.type)}
                  disabled={suggestMutation.isPending}
                >
                  <Icon size={28} color={Colors.light.primary} />
                  <Text style={styles.mealTypeLabel}>{meal.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {suggestMutation.isPending && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>Generating personalized suggestions...</Text>
          </View>
        )}

        {suggestions.length > 0 && (
          <View style={styles.suggestions}>
            <Text style={styles.sectionTitle}>Recommended Meals</Text>
            {suggestions.map((suggestion, index) => {
              const Icon = getMealIcon(suggestion.mealType);
              return (
                <View key={index} style={styles.suggestionCard}>
                  <View style={styles.suggestionHeader}>
                    <View style={styles.suggestionIcon}>
                      <Icon size={24} color={Colors.light.primary} />
                    </View>
                    <View style={styles.suggestionInfo}>
                      <Text style={styles.suggestionName}>{suggestion.name}</Text>
                      <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
                    </View>
                  </View>

                  <View style={styles.suggestionNutrition}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{suggestion.calories}</Text>
                      <Text style={styles.nutritionLabel}>kcal</Text>
                    </View>
                    <View style={styles.nutritionDivider} />
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{Math.round(suggestion.protein)}g</Text>
                      <Text style={styles.nutritionLabel}>protein</Text>
                    </View>
                    <View style={styles.nutritionDivider} />
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{Math.round(suggestion.carbs)}g</Text>
                      <Text style={styles.nutritionLabel}>carbs</Text>
                    </View>
                    <View style={styles.nutritionDivider} />
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{Math.round(suggestion.fat)}g</Text>
                      <Text style={styles.nutritionLabel}>fat</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {!suggestMutation.isPending && suggestions.length === 0 && (
          <View style={styles.emptyState}>
            <Sparkles size={64} color={Colors.light.border} />
            <Text style={styles.emptyStateTitle}>No Suggestions Yet</Text>
            <Text style={styles.emptyStateText}>
              Select a meal type above to get personalized recommendations based on your daily goals
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  statUnit: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
  },
  mealTypes: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealTypeButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  mealTypeLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 16,
  },
  suggestions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  suggestionCard: {
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  suggestionHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  suggestionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  suggestionDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  suggestionNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  nutritionDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: 32,
  },
});
