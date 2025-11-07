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
  I18nManager,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User as UserIcon, Mail, Lock, Activity, Target, Ruler, Weight, CheckSquare, Square } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from 'react-i18next';
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
  const [acceptedLegal, setAcceptedLegal] = useState(false); // New state for legal acceptance
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    age?: string;
    weight?: string;
    height?: string;
    acceptedLegal?: string; // New error field
  }>({});
  
  const { signUp } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

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
      newErrors.name = t('alerts.nameRequired');
    }
    if (!email.trim()) {
      newErrors.email = t('alerts.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('alerts.emailInvalid');
    }
    if (!password) {
      newErrors.password = t('alerts.passwordRequired');
    } else if (password.length < 6) {
      newErrors.password = t('alerts.passwordLength');
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = t('alerts.confirmPasswordRequired');
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('alerts.passwordsMismatch');
    }
    if (!acceptedLegal) { // Validate legal acceptance
      newErrors.acceptedLegal = t('alerts.legalRequired');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  };

  const handleComplete = async () => {
    const newErrors: typeof errors = {};

    if (!age.trim()) {
      newErrors.age = t('alerts.ageRequired');
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 13 || ageNum > 100) {
        newErrors.age = t('alerts.ageRange');
      }
    }
    if (!weight.trim()) {
      newErrors.weight = t('alerts.weightRequired');
    } else {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum < 20 || weightNum > 300) {
        newErrors.weight = t('alerts.weightRange');
      }
    }
    if (!height.trim()) {
      newErrors.height = t('alerts.heightRequired');
    } else {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum) || heightNum < 50 || heightNum > 250) {
        newErrors.height = t('alerts.heightRange');
      }
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
          newErrors.email = t('alerts.emailInUse');
        } else {
          newErrors.email = t('alerts.unexpectedError');
        }
        setErrors(newErrors);
        setStep(1);
      }
    }
  };

  useEffect(() => {
    if (name || email || password || confirmPassword || age || weight || height || acceptedLegal) {
      setErrors({});
    }
  }, [name, email, password, confirmPassword, age, weight, height, acceptedLegal]);

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
          <Text style={styles.title}>{t('signup.title')}</Text>
          <Text style={styles.subtitle}>
            {step === 1 ? t('signup.subtitle') : 'Tell us about your fitness goals'}
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
                <Text style={styles.labelText}>{t('signup.username')} *</Text>
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
                <Text style={styles.labelText}>{t('signup.email')} *</Text>
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
                <Text style={styles.labelText}>{t('signup.password')} *</Text>
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

            {/* Legal Acceptance Checkbox and Links */}
            <View style={styles.legalContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAcceptedLegal(!acceptedLegal)}
              >
                {acceptedLegal ? (
                  <CheckSquare size={24} color={Colors.light.primary} />
                ) : (
                  <Square size={24} color={Colors.light.textSecondary} />
                )}
              </TouchableOpacity>
              <View style={{ flex: 1, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                <Text style={styles.legalText}>
                  {t('signup.iAgreeTo')}{' '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/docs/TermsAndConditions')}>
                  <Text style={styles.legalLink}>{t('signup.terms')}</Text>
                </TouchableOpacity>
                <Text style={styles.legalText}>
                  {' & '}
                </Text>
                <TouchableOpacity onPress={() => router.push('/docs/PrivacyPolicy')}>
                  <Text style={styles.legalLink}>{t('signup.privacyPolicy')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {errors.acceptedLegal && (
              <Text style={styles.errorText}>{errors.acceptedLegal}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{t('signup.button')}</Text>
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>{t('signup.hasAccount')}</Text>
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
                  <Text style={styles.labelText}>{t('signup.age')} *</Text>
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
                  <Text style={styles.labelText}>{t('signup.weight')} (kg) *</Text>
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
                <Text style={styles.labelText}>{t('signup.height')} (cm) *</Text>
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
                <Text style={styles.labelText}>{t('signup.yourGoal')} *</Text>
              </View>
              <View style={styles.options}>
                <TouchableOpacity
                  style={[styles.optionButton, goal === 'lose' && styles.optionButtonActive]}
                  onPress={() => setGoal('lose')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, goal === 'lose' && styles.optionTextActive]}>
                    {t('signup.loseWeight')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionButton, goal === 'maintain' && styles.optionButtonActive]}
                  onPress={() => setGoal('maintain')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, goal === 'maintain' && styles.optionTextActive]}>
                    {t('signup.maintain')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.optionButton, goal === 'gain' && styles.optionButtonActive]}
                  onPress={() => setGoal('gain')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, goal === 'gain' && styles.optionTextActive]}>
                    {t('signup.gainWeight')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.optionGroup}>
              <View style={styles.inputLabel}>
                <Activity size={20} color={Colors.light.text} />
                <Text style={styles.labelText}>{t('signup.activityLevel')} *</Text>
              </View>
              <View style={styles.options}>
                {[
                  { value: 'sedentary' as const, label: t('signup.sedentary') },
                  { value: 'light' as const, label: t('signup.light') },
                  { value: 'moderate' as const, label: t('signup.moderate') },
                  { value: 'active' as const, label: t('signup.active') },
                  { value: 'very-active' as const, label: t('signup.veryActive') },
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
                <Text style={styles.buttonSecondaryText}>{t('signup.back')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleComplete}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{t('signup.complete')}</Text>
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
  legalContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  checkbox: {
    marginRight: I18nManager.isRTL ? 0 : 10,
    marginLeft: I18nManager.isRTL ? 10 : 0,
  },
  legalText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    flexShrink: 1, // Re-added flexShrink
  },
  legalLink: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '700' as const,
    textDecorationLine: 'underline',
  },
});
