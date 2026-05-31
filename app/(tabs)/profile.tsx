import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';

const LEVEL_MAP = [
  { name: 'Земля 🌍',     min: 0,   max: 30 },
  { name: 'Луна 🌕',      min: 30,  max: 100 },
  { name: 'Марс 🔴',      min: 100, max: 200 },
  { name: 'Звезда ⭐',    min: 200, max: 300 },
  { name: 'Галактика 🌌', min: 300, max: 999 },
];

const ACHIEVEMENTS = [
  {
    id: 'first_word', emoji: '⭐', title: 'Первое слово',
    desc: 'Выучи первое слово',
    check: (s: any) => s.learnedWords >= 1,
  },
  {
    id: 'ten_words', emoji: '🌟', title: '10 слов',
    desc: 'Выучи 10 слов',
    check: (s: any) => s.learnedWords >= 10,
  },
  {
    id: 'first_lesson', emoji: '🎓', title: 'Первый урок',
    desc: 'Заверши первый урок',
    check: (s: any) => s.completedLessons.length >= 1,
  },
  {
    id: 'streak_3', emoji: '🔥', title: '3 дня подряд',
    desc: 'Занимайся 3 дня подряд',
    check: (s: any) => s.streak >= 3,
  },
  {
    id: 'streak_7', emoji: '🚀', title: 'Неделя!',
    desc: '7 дней подряд',
    check: (s: any) => s.streak >= 7,
  },
  {
    id: 'fifty_words', emoji: '💫', title: '50 слов',
    desc: 'Выучи 50 слов',
    check: (s: any) => s.learnedWords >= 50,
  },
];

const GOAL_LABELS: Record<string, string> = {
  work: '💼 Работа',
  travel: '✈️ Путешествия',
  series: '🎬 Сериалы',
  communication: '💬 Общение',
};

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, stats } = useUser();

  const level = LEVEL_MAP.find(
    l => stats.learnedWords >= l.min && stats.learnedWords < l.max
  ) || LEVEL_MAP[LEVEL_MAP.length - 1];

  const levelPct = Math.min(
    ((stats.learnedWords - level.min) / (level.max - level.min)) * 100,
    100
  );

  const handleReset = () => {
    Alert.alert(
      'Сбросить прогресс?',
      'Все выученные слова и уроки будут удалены.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сбросить', style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['user_profile', 'user_stats']);
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🧑‍🚀</Text>
          </View>
          <Text style={styles.name}>{profile?.name || 'Ученик'}</Text>
          <Text style={styles.levelName}>{level.name}</Text>
        </View>

        <View style={{ paddingHorizontal: Spacing.md, gap: Spacing.md }}>
          {/* Level progress */}
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>Прогресс уровня</Text>
              <Text style={styles.cardValue}>{Math.round(levelPct)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${levelPct}%` as any }]} />
            </View>
            <Text style={styles.cardHint}>{stats.learnedWords} слов выучено</Text>
          </View>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            {[
              { label: 'Слов',      value: stats.learnedWords },
              { label: 'Уроков',    value: stats.completedLessons.length },
              { label: 'Минут',     value: stats.totalMinutes },
              { label: 'Стрик 🔥', value: stats.streak },
            ].map(item => (
              <View key={item.label} style={styles.statBox}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <Text style={styles.sectionTitle}>Достижения</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map(a => {
              const unlocked = a.check(stats);
              return (
                <View
                  key={a.id}
                  style={[styles.achievement, !unlocked && styles.achievementLocked]}
                >
                  <Text style={[styles.achievementEmoji, !unlocked && { opacity: 0.3 }]}>
                    {a.emoji}
                  </Text>
                  <Text style={[
                    styles.achievementTitle,
                    !unlocked && styles.achievementTitleLocked,
                  ]}>
                    {a.title}
                  </Text>
                  <Text style={styles.achievementDesc}>{a.desc}</Text>
                </View>
              );
            })}
          </View>

          {/* Goal */}
          {profile?.goal ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Твоя цель</Text>
              <Text style={styles.goalText}>
                {GOAL_LABELS[profile.goal] || profile.goal}
              </Text>
            </View>
          ) : null}

          {/* Special needs */}
          {profile?.specialNeeds && profile.specialNeeds !== 'none' ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Персональная настройка</Text>
              <Text style={styles.goalText}>
                {{ memory: '🧠 Адаптация под память', dyslexia: '📖 Режим дислексии', adhd: '⚡ Режим СДВГ' }[profile.specialNeeds] || profile.specialNeeds}
              </Text>
            </View>
          ) : null}

          {/* Reset */}
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
            <Text style={styles.resetText}>Сбросить прогресс</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.bgCard, alignItems: 'center',
    paddingBottom: Spacing.xl, borderBottomWidth: 1,
    borderBottomColor: Colors.border, marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.bgSurface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary, marginBottom: Spacing.sm,
  },
  avatarEmoji: { fontSize: 48 },
  name: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  levelName: { fontSize: FontSize.md, color: Colors.accent, marginTop: 4 },
  card: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: FontSize.sm, color: Colors.textSecondary },
  cardValue: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  cardHint: { fontSize: FontSize.xs, color: Colors.textMuted },
  progressBar: { height: 8, backgroundColor: Colors.bgSurface, borderRadius: 4 },
  progressFill: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statBox: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 3 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  achievement: {
    width: '30%', backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    padding: Spacing.sm, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, gap: 4,
  },
  achievementLocked: { borderColor: Colors.border },
  achievementEmoji: { fontSize: 28 },
  achievementTitle: {
    fontSize: 11, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, textAlign: 'center',
  },
  achievementTitleLocked: { color: Colors.textMuted },
  achievementDesc: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  goalText: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: FontWeight.semibold },
  resetBtn: {
    borderWidth: 1, borderColor: Colors.error, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', marginTop: Spacing.md,
  },
  resetText: { fontSize: FontSize.md, color: Colors.error },
});
