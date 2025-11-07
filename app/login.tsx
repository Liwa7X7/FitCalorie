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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, Mail, Lock } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from 'react-i18next';
import Colors from '@/constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ✅ Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDY7id__qnECAMHnRQt6HCPwHgvHufsGtk",
  authDomain: "enviroclean-419320.firebaseapp.com",
  projectId: "enviroclean-419320",
  storageBucket: "enviroclean-419320.firebasestorage.app",
  messagingSenderId: "156024245048",
  appId: "1:156024245048:web:c240dd90750bb3335d0fcd",
  measurementId: "G-NGVWJ8CPRD",
};

// ✅ Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();

  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.spring(logoAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, []);

  // ✅ Real Firebase login handler
  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);

    try {
      // 1️⃣ Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Fetch Firestore user profile
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        Alert.alert('Error', 'User data not found in Firestore.');
        setLoading(false);
        return;
      }

      // 3️⃣ Combine data and update context
      const userData = { id: user.uid, email: user.email, ...userDoc.data() };
      signIn (email,password);

      // 4️⃣ Navigate to home or dashboard
      router.replace('/(tabs)/home' as any);
    } catch (error: any) {
      let message = t('alerts.unexpectedError');
      if (error.code === 'auth/invalid-email') message = t('alerts.invalidEmail');
      else if (error.code === 'auth/user-not-found') message = t('alerts.userNotFound');
      else if (error.code === 'auth/wrong-password') message = t('alerts.incorrectPassword');
      Alert.alert(t('alerts.loginFailedTitle'), message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/sign-up' as any);
  };

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
        <Animated.View
          style={[
            styles.header,
            {
              opacity: logoAnim,
              transform: [
                {
                  scale: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Activity size={56} color={Colors.light.primary} strokeWidth={2.5} />
          </View>
          <Text style={styles.title}>{t('login.title')}</Text>
          <Text style={styles.subtitle}>
            {t('login.subtitle')}
          </Text>
        </Animated.View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => i18n.changeLanguage('en')} style={{ padding: 10, backgroundColor: i18n.language === 'en' ? Colors.light.primary : Colors.light.card, borderRadius: 10, marginRight: 10 }}>
            <Text style={{ color: i18n.language === 'en' ? 'white' : Colors.light.text }}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => i18n.changeLanguage('fr')} style={{ padding: 10, backgroundColor: i18n.language === 'fr' ? Colors.light.primary : Colors.light.card, borderRadius: 10, marginRight: 10 }}>
            <Text style={{ color: i18n.language === 'fr' ? 'white' : Colors.light.text }}>Français</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => i18n.changeLanguage('ar')} style={{ padding: 10, backgroundColor: i18n.language === 'ar' ? Colors.light.primary : Colors.light.card, borderRadius: 10 }}>
            <Text style={{ color: i18n.language === 'ar' ? 'white' : Colors.light.text }}>العربية</Text>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.form,
            {
              opacity: formAnim,
              transform: [
                {
                  translateY: formAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Mail size={20} color={Colors.light.text} />
              <Text style={styles.labelText}>{t('login.email')}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('login.emailPlaceholder')}
              placeholderTextColor={Colors.light.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Lock size={20} color={Colors.light.text} />
              <Text style={styles.labelText}>{t('login.password')}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder={t('login.passwordPlaceholder')}
              placeholderTextColor={Colors.light.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, (!email || !password || loading) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={!email || !password || loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading ? t('login.signingIn') : t('login.button')}
            </Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>{t('login.noAccount')}</Text>
            <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
              <Text style={styles.signUpLink}>{t('login.signUpLink')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
    paddingVertical: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 12,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 18,
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
    fontSize: 18,
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
