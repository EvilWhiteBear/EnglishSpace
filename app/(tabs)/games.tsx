import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';
import { WORDS, Word } from '@/constants/lessonData';

type GameType = 'menu' | 'translate' | 'match' | 'fillgap';
type GameResult = 'none' | 'correct' | 'wrong';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getQuizWords(wordProgress: Record<string, any>): Word[] {
  const available = WORDS.filter(w => wordProgress[w.id]?.confidence >= 0 || true);
  return shuffle(available).slice(0, 10);
}

function TranslateGame({ onBack }: { onBack: () => void }) {
  const { stats, updateWordProgress } = useUser();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult>('none');
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const words = useMemo(() => getQuizWords(stats.wordProgress), []);

  const current = words[index];
  const options = useMemo(() => {
    const others = shuffle(WORDS.filter(w => w.id !== current?.id)).slice(0, 3);
    return shuffle([current, ...others]);
  }, [index, current]);

  const handleAnswer = useCallback((word: Word) => {
    if (result !== 'none') return;
    setSelected(word.id);
    const correct = word.id === current.id;
    setResult(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore(s => s + 1);
      updateWordProgress(current.id, 1);
    }
    setTimeout(() => {
      if (index + 1 >= words.length) {
        setDone(true);
      } else {
        setIndex(i => i + 1);
        setSelected(null);
        setResult('none');
      }
    }, 1000);
  }, [result, current, index, words.length]);

  if (done) {
    return (
      <View style={gameStyles.resultScreen}>
        <Text style={gameStyles.resultEmoji}>{score >= 7 ? '🏆' : score >= 4 ? '⭐' : '💪'}</Text>
        <Text style={gameStyles.resultTitle}>
          {score >= 7 ? 'Великолепно!' : score >= 4 ? 'Хорошая работа!' : 'Неплохое начало!'}
        </Text>
        <Text style={gameStyles.resultScore}>{score} / {words.length}</Text>
        <Text style={gameStyles.resultHint}>
          {score >= 7 ? 'Ты прекрасно знаешь эти слова! Продолжай!' : 'Повтори слова в Словаре и попробуй снова!'}
        </Text>
        <TouchableOpacity style={gameStyles.retryBtn} onPress={onBack} activeOpacity={0.85}>
          <Text style={gameStyles.retryBtnText}>В меню игр</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!current) return null;

  return (
    <View style={gameStyles.gameArea}>
      <View style={gameStyles.progressBar}>
        <View style={[gameStyles.progressFill, { width: `${((index) / words.length) * 100}%` as any }]} />
      </View>
      <Text style={gameStyles.questionCounter}>{index + 1} / {words.length}</Text>
      <View style={gameStyles.wordDisplay}>
        <Text style={gameStyles.wordEmoji}>{current.emoji}</Text>
        <Text style={gameStyles.wordEnglish}>{current.english}</Text>
        <Text style={gameStyles.wordTranscr}>[{current.transcription}]</Text>
      </View>
      <Text style={gameStyles.questionText}>Что значит это слово?</Text>
      <View style={gameStyles.optionsGrid}>
        {options.map(opt => {
          let cardStyle = gameStyles.optionCard;
          if (selected) {
            if (opt.id === current.id) cardStyle = gameStyles.optionCorrect;
            else if (opt.id === selected) cardStyle = gameStyles.optionWrong;
          }
          return (
            <TouchableOpacity
              key={opt.id}
              style={cardStyle}
              onPress={() => handleAnswer(opt)}
              activeOpacity={0.85}
            >
              <Text style={gameStyles.optionText}>{opt.russian}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const GAME_MODES = [
  { id: 'translate', icon: '🎯', title: 'Переводчик', desc: 'Выбери правильный перевод слова', color: Colors.primary },
  { id: 'match', icon: '🃏', title: 'Скоро', desc: 'Угадай по картинке-ассоциации', color: Colors.accent },
  { id: 'fillgap', icon: '✏️', title: 'Скоро', desc: 'Заполни пропуск в предложении', color: Colors.teal },
];

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const { stats } = useUser();
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  if (activeGame === 'translate') {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg }}>
        <View style={[gameStyles.gameHeader, { paddingTop: insets.top + Spacing.sm }]}>
          <TouchableOpacity onPress={() => setActiveGame('menu')} style={gameStyles.backBtn} activeOpacity={0.8}>
            <Text style={gameStyles.backBtnText}>← Назад</Text>
          </TouchableOpacity>
          <Text style={gameStyles.gameHeaderTitle}>Переводчик</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: Spacing.md, flexGrow: 1 }}>
          <TranslateGame onBack={() => setActiveGame('menu')} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={[gameStyles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text style={gameStyles.title}>Игровой режим 🎮</Text>
        <Text style={gameStyles.subtitle}>Закрепляй слова через игры!</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: Spacing.md, gap: Spacing.md }}>
        <View style={gameStyles.statsRow}>
          <View style={gameStyles.statCard}>
            <Text style={gameStyles.statValue}>{Object.values(stats.wordProgress).filter(w => w.confidence >= 1).length}</Text>
            <Text style={gameStyles.statLabel}>В копилке</Text>
          </View>
          <View style={gameStyles.statCard}>
            <Text style={gameStyles.statValue}>{stats.streak}🔥</Text>
            <Text style={gameStyles.statLabel}>Стрик</Text>
          </View>
        </View>

        <Text style={gameStyles.sectionTitle}>Выбери игру</Text>
        {GAME_MODES.map(mode => (
          <TouchableOpacity
            key={mode.id}
            style={[gameStyles.modeCard, { borderColor: mode.color + '40' }]}
            onPress={() => mode.id === 'translate' ? setActiveGame('translate') : null}
            activeOpacity={mode.id === 'translate' ? 0.85 : 1}
          >
            <View style={[gameStyles.modeIcon, { backgroundColor: mode.color + '20' }]}>
              <Text style={{ fontSize: 28 }}>{mode.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[gameStyles.modeTitle, { color: mode.color }]}>{mode.title}</Text>
                {mode.id !== 'translate' && (
                  <View style={gameStyles.soonBadge}><Text style={gameStyles.soonText}>Скоро</Text></View>
                )}
              </View>
              <Text style={gameStyles.modeDesc}>{mode.desc}</Text>
            </View>
            {mode.id === 'translate' && <Text style={{ color: mode.color, fontSize: 18 }}>→</Text>}
          </TouchableOpacity>
        ))}

        <View style={gameStyles.tipCard}>
          <Text style={gameStyles.tipTitle}>🌟 Совет от Nova</Text>
          <Text style={gameStyles.tipText}>
            Играй после урока, чтобы лучше запомнить слова. Интервальные повторения — ключ к долгой памяти!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const gameStyles = StyleSheet.create({
  header: {
    backgroundColor: Colors.bgCard, paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.primary },
  statLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 3 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  modeCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, borderWidth: 1.5,
  },
  modeIcon: { width: 56, height: 56, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  modeTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  modeDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  soonBadge: {
    backgroundColor: Colors.bgSurface, borderRadius: Radius.sm,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  soonText: { fontSize: 10, color: Colors.textMuted },
  tipCard: {
    backgroundColor: Colors.accentSoft, borderRadius: Radius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.accentMuted,
  },
  tipTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.accent, marginBottom: Spacing.xs },
  tipText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  gameHeader: {
    backgroundColor: Colors.bgCard, paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { paddingVertical: 8, paddingRight: 12 },
  backBtnText: { fontSize: FontSize.md, color: Colors.primary },
  gameHeaderTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  gameArea: { gap: Spacing.md },
  progressBar: { height: 6, backgroundColor: Colors.bgSurface, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  questionCounter: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
  wordDisplay: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  wordEmoji: { fontSize: 48 },
  wordEnglish: { fontSize: FontSize.hero, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  wordTranscr: { fontSize: FontSize.md, color: Colors.accent },
  questionText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center' },
  optionsGrid: { gap: Spacing.sm },
  optionCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  optionCorrect: {
    backgroundColor: 'rgba(78,205,196,0.15)', borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.teal,
  },
  optionWrong: {
    backgroundColor: 'rgba(255,107,107,0.15)', borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.error,
  },
  optionText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  resultScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.lg },
  resultEmoji: { fontSize: 72 },
  resultTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  resultScore: { fontSize: 48, fontWeight: FontWeight.bold, color: Colors.primary },
  resultHint: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  retryBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.round,
    paddingVertical: 16, paddingHorizontal: 40, marginTop: Spacing.md,
  },
  retryBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
});
