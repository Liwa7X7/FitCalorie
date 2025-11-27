import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
import { Trash2, TrendingUp } from 'lucide-react-native';
import { useFood } from '@/contexts/FoodContext';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
export default function HistoryScreen() {
  const { foods, removeFood, getTodayCalories, getTodayMacros } = useFood();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const todayCalories = getTodayCalories();
  const macros = getTodayMacros();

  const headerAnim = useRef(new Animated.Value(0)).current;
  const summaryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(summaryAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, [headerAnim, summaryAnim]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date >= today) {
      return date.toLocaleTimeString(i18n.language, { hour: 'numeric', minute: '2-digit' });
    }
    
    return date.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' });
  };

  const groupedFoods = foods.reduce((acc, food) => {
    const date = new Date(food.timestamp);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.getTime();
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(food);
    return acc;
  }, {} as Record<number, typeof foods>);

  const sortedDateKeys = Object.keys(groupedFoods)
    .map(Number)
    .sort((a, b) => b - a);

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
        <Text style={styles.headerTitle}>{t('history.title')}</Text>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.summaryCard,
            {
              opacity: summaryAnim,
              transform: [
                {
                  scale: summaryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.summaryHeader}>
            <TrendingUp size={24} color={Colors.light.primary} />
            <Text style={styles.summaryTitle}>{t('history.summaryTitle')}</Text>
          </View>
          
          <View style={styles.caloriesDisplay}>
            <Text style={styles.caloriesValue}>{todayCalories}</Text>
            <Text style={styles.caloriesLabel}>{t('home.calories')}</Text>
          </View>

          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(macros.protein)}g</Text>
              <Text style={styles.macroLabel}>{t('home.protein')}</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(macros.carbs)}g</Text>
              <Text style={styles.macroLabel}>{t('home.carbs')}</Text>
            </View>
            <View style={styles.macroDivider} />
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(macros.fat)}g</Text>
              <Text style={styles.macroLabel}>{t('home.fat')}</Text>
            </View>
          </View>
        </Animated.View>

        {sortedDateKeys.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>{t('history.noFood')}</Text>
            <Text style={styles.emptyStateText}>
              Start scanning your meals to track your nutrition
            </Text>
          </View>
        ) : (
          <View style={styles.foodList}>
            {sortedDateKeys.map((dateKey) => {
              const date = new Date(dateKey);
              const isToday = date.toDateString() === new Date().toDateString();
              const dateLabel = isToday ? t('history.today') : date.toLocaleDateString(i18n.language, { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              });

              return (
                <View key={dateKey} style={styles.dateSection}>
                  <Text style={styles.dateLabel}>{dateLabel}</Text>
                  
                  {groupedFoods[dateKey].map((food) => (
                    <View key={food.id} style={styles.foodCard}>
                      <Image source={{ uri: food.imageUri }} style={styles.foodImage} />
                      
                      <View style={styles.foodInfo}>
                        <Text style={styles.foodName}>{food.name}</Text>
                        <Text style={styles.foodServing}>{food.servingSize}</Text>
                        <Text style={styles.foodDescription}>{food.description}</Text>
                        <Text style={styles.foodTime}>{formatDate(food.timestamp)}</Text>
                      </View>

                      <View style={styles.foodStats}>
                        <Text style={styles.foodCalories}>{food.calories}</Text>
                        <Text style={styles.foodCaloriesLabel}>kcal</Text>
                        
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => removeFood(food.id)}
                        >
                          <Trash2 size={20} color={Colors.light.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })}
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
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
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
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginLeft: 12,
  },
  caloriesDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  caloriesValue: {
    fontSize: 56,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  caloriesLabel: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500' as const,
  },
  macroDivider: {
    width: 1,
    height: 40,
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
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  foodList: {
    paddingHorizontal: 20,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 12,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.light.border,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  foodServing: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  foodTime: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  foodStats: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  foodCalories: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  foodCaloriesLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  bottomPadding: {
    height: 32,
  },
});
