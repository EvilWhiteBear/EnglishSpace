import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';
import { LESSONS, WORDS } from '@/constants/lessonData';
import { getMotivationalStats } from '@/services/sparkService';

const { width } = Dimensions.get('window');
const STAR_COUNT = 60;

function StarMapBackground({ learnedIds }: { learnedIds: string[] }) {
  const stars = useMemo(() => {
    return WORDS.map((w, i) => {
      const angle = (i / WORDS.length) * Math.PI * 2;
      const r = 80 + (i % 3) * 40;
      const cx = (width / 2) - 16;
      const cy = 130;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const learned = learnedIds.includes(w.id);
      return { x, y, learned, id: w.id, emoji: w.emoji };
    });
  }, [learnedIds]);

  const extraStars = useMemo(() =>
    Array.from({ length: STAR_COUNT }, (_, i) => ({
      key: i,
      x: Math.random() * (width - 32),
      y: Math.random() * 280,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    })), []);

  return (
    <View style={starStyles.container} pointerEvents="none">
      {extraStars.map(s => (
        <View key={s.key} style={[starStyles.bgStar, { left: s.x, top: s.y, width: s.size, height: s.size, opacity: s.opacity }]} />
      ))}
      {stars.map(s => (
        <View key={s.id} style={[starStyles.star, { left: s.x - 6, top: s.y - 6 }, s.learned && starStyles.starLearned]}>
          {s.learned ? <Text style={{ fontSize: 10 }}>{s.emoji}</Text> : null}
        </View>
      ))}
    </View>
  );
}

const starStyles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, height: 290, overflow: 'hidden' },
  bgStar: { position: 'absolute', backgroundColor: '#fff', borderRadius: 2 },
  star: {
    position: 'absolute', width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.starUnknown, alignItems: 'center', justifyContent: 'center',
  },
  starLearned: { backgroundColor: 'transparent', width: 18, height: 18, borderRadius: 9 },
});

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, stats } = useUser();

  const learnedIds = Object.keys(stats.wordProgress).filter(id => stats.wordProgress[id].confidence >= 1);
  const nextLesson = LESSONS.find(l => !stats.completedLessons.includes(l.id)) || LESSONS[0];
  const progressPct = Math.round((stats.learnedWords / stats.totalWords) * 100);

  const levelInfo = useMemo(() => {
    if (stats.learnedWords < 30) return { name: 'Земля 🌍', next: 'Луна 🌕', pct: stats.learnedWords / 30 };
    if (stats.learnedWords < 100) return { name: 'Луна 🌕', next: 'Марс 🔴', pct: (stats.learnedWords - 30) / 70 };
    if (stats.learnedWords < 200) return { name: 'Марс 🔴', next: 'Звезда ⭐', pct: (stats.learnedWords - 100) / 100 };
    return { name: 'Звезда ⭐', next: 'Галактика 🌌', pct: (stats.learnedWords - 200) / 100 };
  }, [stats.learnedWords]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Hero Space Map */}
        <View style={[styles.heroSection, { paddingTop: insets.top + Spacing.md }]}>
          <StarMapBackground learnedIds={learnedIds} />
          <View style={styles.heroContent}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>Привет, {profile?.name || 'Ученик'} 👋</Text>
                <Text style={styles.levelText}>{levelInfo.name}</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakFire}>🔥</Text>
                <Text style={styles.streakCount}>{stats.streak}</Text>
                <Text style={styles.streakLabel}>дней</Text>
              </View>
            </View>
            <View style={styles.sparkPreview}>
              <Image source={require('@/assets/images/nova-avatar.png')} style={styles.sparkImg} contentFit="contain" />
              <View style={styles.sparkBubble}>
                <Text style={styles.sparkBubbleText}>{getMotivationalStats(stats.learnedWords, stats.streak)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: Spacing.md, gap: Spacing.md }}>
          {/* Start Lesson CTA */}
          <TouchableOpacity
            style={styles.lessonCard}
            onPress={() => router.push({ pathname: '/lesson', params: { lessonId: nextLesson.id } })}
            activeOpacity={0.88}
          >
            <View style={styles.lessonCardLeft}>
              <View style={styles.lessonBadge}>
                <Text style={styles.lessonBadgeText}>День {nextLesson.day}</Text>
              </View>
              <Text style={styles.lessonTitle}>{nextLesson.title}</Text>
              <Text style={styles.lessonSub}>{nextLesson.subtitle} • {nextLesson.words.length} слов</Text>
            </View>
            <View style={styles.startBtn}>
              <Text style={styles.startBtnText}>▶</Text>
            </View>
          </TouchableOpacity>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.learnedWords}</Text>
              <Text style={styles.statLabel}>Слов выучено</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.completedLessons.length}</Text>
              <Text style={styles.statLabel}>Уроков</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Минут</Text>
            </View>
          </View>

          {/* Progress to next level */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Прогресс до уровня «{levelInfo.next}»</Text>
              <Text style={styles.progressPct}>{Math.round(levelInfo.pct * 100)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(levelInfo.pct * 100, 100)}%` as any }]} />
            </View>
            <Text style={styles.progressHint}>Выучено {stats.learnedWords} из {stats.totalWords} слов словаря</Text>
          </View>

          {/* All Lessons */}
          <Text style={styles.sectionTitle}>Все уроки</Text>
          {LESSONS.map(lesson => {
            const done = stats.completedLessons.includes(lesson.id);
            const isCurrent = lesson.id === nextLesson.id;
            return (
              <TouchableOpacity
                key={lesson.id}
                style={[styles.lessonRow, done && styles.lessonRowDone, isCurrent && styles.lessonRowCurrent]}
                onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lesson.id } })}
                activeOpacity={0.8}
              >
                <View style={[styles.lessonRowIcon, done && styles.lessonRowIconDone]}>
                  <Text style={styles.lessonRowIconText}>{done ? '✓' : `${lesson.day}`}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.lessonRowTitle, done && styles.lessonRowTitleDone]}>{lesson.title}</Text>
                  <Text style={styles.lessonRowSub}>Неделя {lesson.week} • {lesson.words.length} слов</Text>
                </View>
                {isCurrent && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Текущий</Text></View>}
                {done && <Text style={styles.doneStars}>⭐⭐⭐</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    height: 290, marginBottom: Spacing.md,
    backgroundColor: Colors.bgCard,
  },
  heroContent: { padding: Spacing.md, paddingTop: 0, flex: 1, justifyContent: 'flex-end' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  greeting: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  levelText: { fontSize: FontSize.sm, color: Colors.accent, marginTop: 2 },
  streakBadge: {
    backgroundColor: 'rgba(255,215,0,0.12)', borderRadius: Radius.lg,
    paddingHorizontal: Spacing.sm, paddingVertical: 6, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.primaryMuted,
  },
  streakFire: { fontSize: 18 },
  streakCount: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.primary, lineHeight: 26 },
  streakLabel: { fontSize: 10, color: Colors.textSecondary },
  sparkPreview: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  sparkImg: { width: 48, height: 48 },
  sparkBubble: {
    flex: 1, backgroundColor: Colors.bgSurface, borderRadius: Radius.lg,
    borderBottomLeftRadius: 4, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.accentMuted,
  },
  sparkBubbleText: { fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  lessonCard: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
  },
  lessonCardLeft: { flex: 1 },
  lessonBadge: {
    backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: 3, alignSelf: 'flex-start',
    marginBottom: Spacing.xs,
  },
  lessonBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
  lessonTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
  lessonSub: { fontSize: FontSize.sm, color: 'rgba(10,10,26,0.7)', marginTop: 3 },
  startBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  startBtnText: { fontSize: 20, color: Colors.textOnPrimary },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 3, textAlign: 'center' },
  progressCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  progressTitle: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  progressPct: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary },
  progressBar: { height: 8, backgroundColor: Colors.bgSurface, borderRadius: 4, marginBottom: Spacing.sm },
  progressFill: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  progressHint: { fontSize: FontSize.xs, color: Colors.textMuted },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginTop: Spacing.sm },
  lessonRow: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  lessonRowDone: { borderColor: Colors.accentMuted },
  lessonRowCurrent: { borderColor: Colors.primary },
  lessonRowIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.bgSurface, alignItems: 'center', justifyContent: 'center',
  },
  lessonRowIconDone: { backgroundColor: Colors.accentMuted },
  lessonRowIconText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  lessonRowTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  lessonRowTitleDone: { color: Colors.textSecondary },
  lessonRowSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  currentBadge: {
    backgroundColor: Colors.primaryMuted, borderRadius: Radius.sm,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  currentBadgeText: { fontSize: 11, color: Colors.primary, fontWeight: FontWeight.semibold },
  doneStars: { fontSize: 12 },
});
