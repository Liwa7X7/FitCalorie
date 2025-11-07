import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import Colors from '@/constants/colors';
import { FoodItem } from '@/types/food';
import { useTranslation } from 'react-i18next';

interface FoodAnalysisPopupProps {
  foodItem: FoodItem;
  onSkip: () => void;
  isVisible: boolean;
}

export default function FoodAnalysisPopup({ foodItem, onSkip, isVisible }: FoodAnalysisPopupProps) {
  const { t } = useTranslation();
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0], // Slide in from bottom
  });

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View style={[styles.overlay, { transform: [{ translateY }] }]}>
      <View style={styles.popupContainer}>
        <Text style={styles.title}>{t('foodAnalysisPopup.title')}</Text>
        <Image source={{ uri: foodItem.imageUri }} style={styles.foodImage} />
        <Text style={styles.foodName}>{foodItem.name}</Text>
        <Text style={styles.foodDescription}>{foodItem.description}</Text>

        <View style={styles.nutritionContainer}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{foodItem.calories}</Text>
            <Text style={styles.nutritionLabel}>kcal</Text>
          </View>
          <View style={styles.nutritionDivider} />
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(foodItem.protein)}g</Text>
            <Text style={styles.nutritionLabel}>{t('home.protein')}</Text>
          </View>
          <View style={styles.nutritionDivider} />
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(foodItem.carbs)}g</Text>
            <Text style={styles.nutritionLabel}>{t('home.carbs')}</Text>
          </View>
          <View style={styles.nutritionDivider} />
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(foodItem.fat)}g</Text>
            <Text style={styles.nutritionLabel}>{t('home.fat')}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>{t('foodAnalysisPopup.skip')}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1000,
  },
  popupContainer: {
    backgroundColor: Colors.light.background,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 20,
  },
  foodImage: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor: Colors.light.border,
  },
  foodName: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  foodDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 25,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.primary,
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
  skipButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as const,
  },
});
