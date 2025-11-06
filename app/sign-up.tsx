import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User as UserIcon, Mail, Lock, Activity, Target, Ruler, Weight } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'>('moderate');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    age?: string;
    weight?: string;
    height?: string;
  }>({});
  
  const { signUp } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const formAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    formAnim.setValue(0);
    Animated.spring(formAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [step]);

  const handleContinue = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleComplete = async () => {
    const newErrors: typeof errors = {};

    if (!age.trim()) {
      newErrors.age = 'Age is required';
    } else if (parseInt(age) < 13 || parseInt(age) > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!weight.trim()) {
      newErrors.weight = 'Weight is required';
    } else if (parseFloat(weight) <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    if (!height.trim()) {
      newErrors.height = 'Height is required';
    } else if (parseFloat(height) <= 0) {
      newErrors.height = 'Please enter a valid height';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const userData = {
          name,
          email,
          age: parseInt(age),
          weight: parseFloat(weight),
          height: parseFloat(height),
          goal,
          activityLevel,
        };
        await signUp(userData, password);
      } catch (error: any) {
        const newErrors: typeof errors = {};
        if (error.code === 'auth/email-already-in-use') {
          newErrors.email = 'This email is already in use.';
        } else {
          newErrors.email = 'An unexpected error occurred.';
        }
        setErrors(newErrors);
        setStep(1);
      }
    }
  };

  useEffect(() => {
    if (name || email || password || confirmPassword || age || weight || height) {
      setErrors({});
    }
  }, [name, email, password, confirmPassword, age, weight, height]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Activity size={48} color={Colors.light.primary} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            {step === 1 ? 'Enter your details to get started' : 'Tell us about your fitness goals'}
          </Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
            <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
          </View>
        </View>

        {step === 1 ? (
          <Animated.View
            style={[
              styles.form,
              {
                opacity: formAnim,
                transform: [
                  {
                    translateY: formAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <UserIcon size={20} color={Colors.light.text} />
                <Text style={styles.labelText}>Name *</Text>
              </View>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter your name"
                placeholderTextColor={Colors.light.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Mail size={20} color={Colors.light.text} />
                <Text style={styles.labelText}>Email *</Text>
              </View>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor={Colors.light.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Lock size={20} color={Colors.light.text} />
                <Text style={styles.labelText}>Password *</Text>
              </View>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Create a password"
                placeholderTextColor={Colors.light.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Lock size={20} color={Colors.light.text} />
                <Text style={styles.labelText}>Confirm Password *</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={Colors.light.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                <Text style={styles.signUpLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.form,
              {
                opacity: formAnim,
                transform: [
                  {
                    translateY: formAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <View style={styles.inputLabel}>
                  <UserIcon size={20} color={Colors.light.text} />
                  <Text style={styles.labelText}>Age *</Text>
                </View>
                <TextInput
                  style={[styles.input, errors.age && styles.inputError]}
                  placeholder="25"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
                {errors.age && (
                  <Text style={styles.errorText}>{errors.age}</Text>
                )}
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <View style={styles.inputLabel}>
                  <Weight size={20} color={Colors.light.text} />
                  <Text style={styles.labelText}>Weight (kg) *</Text>
                </View>
                <TextInput
                  style={[styles.input, errors.weight && styles.inputError]}
                  placeholder="70"
                  placeholderTextColor={Colors.light.textSecondary}
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                />
                {errors.weight && (
                  <Text style={styles.errorText}>{errors.weight}</Text>
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputLabel}>
                <Ruler size={20} color={Colors.light.text} />
                <Text style={styles.labelText}>Height (cm) *</Text>
              </View>
              <TextInput
                style={[styles.input, errors.height && styles.inputError]}
                placeholder="175"
                placeholderTextColor={Colors.light.textSecondary}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
              {errors.height && (
                <Text style={styles.errorText}>{errors.height}</Text>
              )}
            </View>

            <View style={styles.optionGroup}>
              <View style={styles.inputLabel}>
                <Target size={20} color={Colors.light.text} />
                <Text style={styles.labelText}>Your Goal *</Text>
              </View>
              <View style={styles.options}>
                <TouchableOpacity
                  style={[styles.optionButton, goal === 'lose' && styles.optionButtonActive]}
                  onPress={() => setGoal('lose')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, goal === 'lose' && styles.optionTextActive]}>
                    Lose Weight
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionButton, goal === 'maintain' && styles.optionButtonActive]}
                  onPress={() => setGoal('maintain')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, goal === 'maintain' && styles.optionTextActive]}>
                    Maintain
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionButton, goal === 'gain' && styles.optionButtonActive]}
                  onPress={() => setGoal('gain')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, goal === 'gain' && styles.optionTextActive]}>
                    Gain Weight
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.optionGroup}>
              <View style={styles.inputLabel}>
                <Activity size={20} color={Colors.light.text} />
                <Text style={styles.labelText}>Activity Level *</Text>
              </View>
              <View style={styles.options}>
                {[
                  { value: 'sedentary' as const, label: 'Sedentary' },
                  { value: 'light' as const, label: 'Light' },
                  { value: 'moderate' as const, label: 'Moderate' },
                  { value: 'active' as const, label: 'Active' },
                  { value: 'very-active' as const, label: 'Very Active' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.activityOption,
                      activityLevel === option.value && styles.optionButtonActive,
                    ]}
                    onPress={() => setActivityLevel(option.value)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        activityLevel === option.value && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setStep(1)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonSecondaryText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleComplete}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Math.min(width * 0.08, 32),
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
  },
  progressDotActive: {
    backgroundColor: Colors.light.primary,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginTop: -4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  optionGroup: {
    gap: 10,
  },
  options: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  optionButtonActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  activityOption: {
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700' as const,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderWidth: 2,
    borderColor: Colors.light.border,
    shadowOpacity: 0.1,
  },
  buttonPrimary: {
    flex: 1,
  },
  buttonSecondaryText: {
    color: Colors.light.text,
    fontSize: 17,
    fontWeight: '700' as const,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signUpText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  signUpLink: {
    fontSize: 15,
    color: Colors.light.primary,
    fontWeight: '700' as const,
  },
});
