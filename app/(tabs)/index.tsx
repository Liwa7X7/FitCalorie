import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image, Platform, Animated } from 'react-native';
import { Camera, ImageIcon } from 'lucide-react-native';
import { useFood } from '@/contexts/FoodContext';
import { generateObject } from '@rork/toolkit-sdk';
import { z } from 'zod';
import { FoodItem } from '@/types/food';
import Colors from '@/constants/colors';

const nutritionSchema = z.object({
  foodName: z.string().describe('Name of the food item'),
  calories: z.number().describe('Total calories'),
  protein: z.number().describe('Protein in grams'),
  carbs: z.number().describe('Carbohydrates in grams'),
  fat: z.number().describe('Fat in grams'),
  fiber: z.number().optional().describe('Fiber in grams'),
  servingSize: z.string().describe('Serving size description'),
});

export default function ScanScreen() {
  const [facing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [analyzing, setAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const { addFood, getTodayCalories } = useFood();

  const scanFrameAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const captureButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(statsAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanFrameAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanFrameAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Camera size={64} color={Colors.light.primary} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need access to your camera to scan food and calculate calories
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const analyzeFood = async (imageUri: string) => {
    console.log('Starting food analysis for image:', imageUri);
    setAnalyzing(true);
    setCapturedImage(imageUri);

    try {
      let base64Image = '';
      
      if (imageUri.startsWith('data:')) {
        base64Image = imageUri;
      } else if (Platform.OS === 'web') {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();
        base64Image = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      } else {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const reader = new FileReader();
        base64Image = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      console.log('Analyzing food with AI...');
      const result = await generateObject({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this food image and provide nutritional information. Be as accurate as possible based on what you see. If multiple items, provide combined totals.' },
              { type: 'image', image: base64Image },
            ],
          },
        ],
        schema: nutritionSchema,
      });

      console.log('Food analysis complete:', result);

      const foodItem: FoodItem = {
        id: Date.now().toString(),
        name: result.foodName,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        fiber: result.fiber,
        servingSize: result.servingSize,
        imageUri,
        timestamp: Date.now(),
      };

      addFood(foodItem);
      setCapturedImage(null);
      console.log('Food item added to history');
    } catch (error) {
      console.error('Error analyzing food:', error);
      alert('Failed to analyze food. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) {
      console.log('Camera ref not available');
      return;
    }

    Animated.sequence([
      Animated.timing(captureButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(captureButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      console.log('Taking picture...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (photo) {
        console.log('Picture taken:', photo.uri);
        await analyzeFood(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      alert('Failed to take picture. Please try again.');
    }
  };

  const pickImage = async () => {
    console.log('Opening image picker...');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('Image selected:', result.assets[0].uri);
        await analyzeFood(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const todayCalories = getTodayCalories();

  const scanFrameOpacity = scanFrameAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.container}>
      {analyzing && capturedImage ? (
        <View style={styles.analyzingContainer}>
          <Image source={{ uri: capturedImage }} style={styles.analyzingImage} />
          <View style={styles.analyzingOverlay}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.analyzingText}>Analyzing food...</Text>
          </View>
        </View>
      ) : (
        <>
          <Animated.View
            style={[
              styles.statsHeader,
              {
                opacity: statsAnim,
                transform: [
                  {
                    translateY: statsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.statsCard}>
              <Text style={styles.statsLabel}>Today&apos;s Calories</Text>
              <Text style={styles.statsValue}>{todayCalories}</Text>
              <Text style={styles.statsUnit}>kcal</Text>
            </View>
          </Animated.View>

          <View style={styles.cameraContainer}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
              <View style={styles.cameraOverlay}>
                <Animated.View
                  style={[
                    styles.scanFrame,
                    { opacity: scanFrameOpacity },
                  ]}
                />
                <View style={styles.scanCorners}>
                  <View style={[styles.corner, styles.cornerTopLeft]} />
                  <View style={[styles.corner, styles.cornerTopRight]} />
                  <View style={[styles.corner, styles.cornerBottomLeft]} />
                  <View style={[styles.corner, styles.cornerBottomRight]} />
                </View>
              </View>
            </CameraView>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>Scan Your Food</Text>
            <Text style={styles.instructionsText}>
              Point your camera at your meal or upload a photo from your gallery
            </Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.galleryButton}
              onPress={pickImage}
              disabled={analyzing}
            >
              <ImageIcon size={28} color={Colors.light.primary} />
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: captureButtonScale }] }}>
              <TouchableOpacity
                style={[styles.captureButton, analyzing && styles.captureButtonDisabled]}
                onPress={takePicture}
                disabled={analyzing}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.galleryButton} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.light.background,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  statsHeader: {
    padding: 20,
  },
  statsCard: {
    backgroundColor: Colors.light.card,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  statsUnit: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.light.border,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  scanCorners: {
    position: 'absolute',
    width: 250,
    height: 250,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.light.primary,
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 24,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 24,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 24,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 24,
  },
  instructions: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  galleryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzingContainer: {
    flex: 1,
  },
  analyzingImage: {
    width: '100%',
    height: '100%',
  },
  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600' as const,
    marginTop: 16,
  },
});
