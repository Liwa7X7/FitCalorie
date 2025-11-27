import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { User as UserIcon, Mail, Weight, Ruler, Target, Activity, Edit2, LogOut, Trophy } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';
import { useFood } from '@/contexts/FoodContext';
import Colors from '@/constants/colors';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, updateProfile, signOut, calculateBMR } = useUser();
  const { getTodayCalories, foods } = useFood();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  const headerAnim = useRef(new Animated.Value(0)).current;
  const profileAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(profileAnim, {
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
    ]).start();
  }, [headerAnim, profileAnim, statsAnim]);

  useEffect(() => {
    if (editModalVisible) {
      Animated.spring(modalAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      modalAnim.setValue(0);
    }
  }, [editModalVisible, modalAnim]);

  const todayCalories = getTodayCalories();
  const targetCalories = calculateBMR();
  const caloriesProgress = targetCalories > 0 ? (todayCalories / targetCalories) * 100 : 0;
  const totalMealsLogged = foods.length;

  const handleEdit = (field: string, currentValue: string | number | undefined) => {
    setEditField(field);
    setEditValue(currentValue?.toString() || '');
    setEditModalVisible(true);
  };

  const handleSave = () => {
    if (!editValue.trim()) {
      setEditModalVisible(false);
      return;
    }

    const updates: Record<string, string | number> = {};
    
    if (['age', 'weight', 'height'].includes(editField)) {
      updates[editField] = parseFloat(editValue);
    } else {
      updates[editField] = editValue;
    }

    updateProfile(updates);
    setEditModalVisible(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      t('profile.signOutTitle'),
      t('profile.signOutMessage'),
      [
        { text: t('profile.cancel'), style: 'cancel' },
        {
          text: t('profile.signOutButton'),
          style: 'destructive',
          onPress: () => {
            signOut();
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <LogOut size={20} color={Colors.light.error} />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.profileHeader,
            {
              opacity: profileAnim,
              transform: [
                {
                  scale: profileAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <UserIcon size={48} color={Colors.light.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || t('profile.notSet')}</Text>
          <Text style={styles.userEmail}>{user?.email || t('profile.notSet')}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.statsGrid,
            {
              opacity: statsAnim,
              transform: [
                {
                  translateY: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Trophy size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.statValue}>{totalMealsLogged}</Text>
            <Text style={styles.statLabel}>{t('profile.mealsLogged')}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Target size={24} color={Colors.light.secondary} />
            </View>
            <Text style={styles.statValue}>{Math.round(caloriesProgress)}%</Text>
            <Text style={styles.statLabel}>{t('profile.dailyGoal')}</Text>
          </View>
        </Animated.View>

        <View style={styles.calorieGoalCard}>
          <Text style={styles.sectionTitle}>{t('profile.dailyCalorieGoal')}</Text>
          <View style={styles.calorieGoalContent}>
            <View style={styles.calorieGoalLeft}>
              <Text style={styles.calorieGoalValue}>{targetCalories}</Text>
              <Text style={styles.calorieGoalLabel}>{t('profile.kcalPerDay')}</Text>
            </View>
            <View style={styles.calorieGoalRight}>
              <Text style={styles.calorieGoalDescription}>
                {t('profile.calorieGoalDescription', {
                  goalText:
                    user?.goal === 'lose'
                      ? t('profile.loseWeightText')
                      : user?.goal === 'gain'
                      ? t('profile.gainWeightText')
                      : t('profile.maintainWeightText'),
                })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.personalInformation')}</Text>

          <TouchableOpacity
            style={styles.infoCard}
            onPress={() => handleEdit('name', user?.name)}
          >
            <View style={styles.infoLeft}>
              <View style={styles.infoIconContainer}>
                <UserIcon size={20} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{t('profile.name')}</Text>
                <Text style={styles.infoValue}>{user?.name || t('profile.notSet')}</Text>
              </View>
            </View>
            <Edit2 size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoCard}
            onPress={() => handleEdit('email', user?.email)}
          >
            <View style={styles.infoLeft}>
              <View style={styles.infoIconContainer}>
                <Mail size={20} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{t('profile.email')}</Text>
                <Text style={styles.infoValue}>{user?.email || t('profile.notSet')}</Text>
              </View>
            </View>
            <Edit2 size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoCard}
            onPress={() => handleEdit('age', user?.age)}
          >
            <View style={styles.infoLeft}>
              <View style={styles.infoIconContainer}>
                <UserIcon size={20} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{t('profile.age')}</Text>
                <Text style={styles.infoValue}>{user?.age ? `${user.age} ${t('profile.years')}` : t('profile.notSet')}</Text>
              </View>
            </View>
            <Edit2 size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoCard}
            onPress={() => handleEdit('weight', user?.weight)}
          >
            <View style={styles.infoLeft}>
              <View style={styles.infoIconContainer}>
                <Weight size={20} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{t('profile.weight')}</Text>
                <Text style={styles.infoValue}>{user?.weight ? `${user.weight} ${t('profile.kg')}` : t('profile.notSet')}</Text>
              </View>
            </View>
            <Edit2 size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoCard}
            onPress={() => handleEdit('height', user?.height)}
          >
            <View style={styles.infoLeft}>
              <View style={styles.infoIconContainer}>
                <Ruler size={20} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{t('profile.height')}</Text>
                <Text style={styles.infoValue}>{user?.height ? `${user.height} ${t('profile.cm')}` : t('profile.notSet')}</Text>
              </View>
            </View>
            <Edit2 size={20} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.fitnessGoals')}</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoLeft}>
              <View style={styles.infoIconContainer}>
                <Target size={20} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{t('profile.goal')}</Text>
                <Text style={styles.infoValue}>
                  {user?.goal === 'lose' ? t('profile.loseWeightText') : user?.goal === 'gain' ? t('profile.gainWeightText') : t('profile.maintainWeightText')}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoLeft}>
              <View style={styles.infoIconContainer}>
                <Activity size={20} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.infoLabel}>{t('profile.activityLevel')}</Text>
                <Text style={styles.infoValue}>
                  {user?.activityLevel ? t(`profile.${user.activityLevel}`) : t('profile.notSet')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: modalAnim,
                transform: [
                  {
                    scale: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                  {
                    translateY: modalAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.modalTitle}>
              {t('profile.edit')} {t(`profile.${editField}`)}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`${t('profile.enter')} ${t(`profile.${editField}`)}`}
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType={['age', 'weight', 'height'].includes(editField) ? 'numeric' : 'default'}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>{t('profile.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonTextSave}>{t('profile.save')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  signOutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  calorieGoalCard: {
    backgroundColor: Colors.light.card,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  calorieGoalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  calorieGoalLeft: {
    alignItems: 'center',
  },
  calorieGoalValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.light.primary,
  },
  calorieGoalLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  calorieGoalRight: {
    flex: 1,
  },
  calorieGoalDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  bottomPadding: {
    height: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.light.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  modalButtonSave: {
    backgroundColor: Colors.light.primary,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  modalButtonTextSave: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
