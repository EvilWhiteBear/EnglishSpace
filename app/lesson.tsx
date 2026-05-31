import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator, Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useLesson } from '@/hooks/useLesson';
import { useUser } from '@/hooks/useUser';
import { LESSONS } from '@/constants/lessonData';
import { SparkMessage } from '@/services/sparkService';

const { width } = Dimensions.get('window');

function parseMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Text key={i} style={{ fontWeight: '700', color: Colors.primary }}>{part.slice(2, -2)}</Text>;
    }
    return <Text key={i}>{part}</Text>;
  });
}

function MessageBubble({ msg }: { msg: SparkMessage }) {
  const isSpark = msg.role === 'spark';
  return (
    <View style={[bubbleStyles.row, isSpark ? bubbleStyles.rowSpark : bubbleStyles.rowUser]}>
      {isSpark && (
        <Image source={require('@/assets/images/nova-avatar.png')} style={bubbleStyles.sparkAvatar} contentFit="contain" />
      )}
      <View style={[bubbleStyles.bubble, isSpark ? bubbleStyles.bubbleSpark : bubbleStyles.bubbleUser]}>
        {msg.word && msg.type === 'word_teach' && (
          <View style={bubbleStyles.wordBadge}>
            <Text style={bubbleStyles.wordBadgeEmoji}>{msg.word.emoji}</Text>
          </View>
        )}
        <Text style={isSpark ? bubbleStyles.textSpark : bubbleStyles.textUser}>
          {parseMarkdown(msg.text)}
        </Text>
      </View>
    </View>
  );
}

const bubbleStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 4 },
  rowSpark: { justifyContent: 'flex-start' },
  rowUser: { justifyContent: 'flex-end' },
  sparkAvatar: { width: 32, height: 32, marginRight: 8, marginBottom: 2 },
  bubble: {
    maxWidth: width * 0.78, borderRadius: 18, padding: 12,
    gap: 6,
  },
  bubbleSpark: {
    backgroundColor: Colors.bgCardLight,
    borderWidth: 1, borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.accentMuted,
    borderBottomRightRadius: 4,
  },
  textSpark: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 22 },
  textUser: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 22 },
  wordBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.bgSurface, alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center',
  },
  wordBadgeEmoji: { fontSize: 26 },
});

function TypingIndicator() {
  return (
    <View style={[bubbleStyles.row, bubbleStyles.rowSpark]}>
      <Image source={require('@/assets/images/nova-avatar.png')} style={bubbleStyles.sparkAvatar} contentFit="contain" />
      <View style={[bubbleStyles.bubble, bubbleStyles.bubbleSpark, { flexDirection: 'row', gap: 6, alignItems: 'center' }]}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[typingStyles.dot, { opacity: 0.4 + i * 0.2 }]} />
        ))}
      </View>
    </View>
  );
}

const typingStyles = StyleSheet.create({
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.accent },
});

const QUICK_ANSWERS_TEACH = ['Понятно! 👍', 'Интересно!', 'Ещё раз объясни', 'Следующее слово'];
const QUICK_ANSWERS_PRACTICE = ['Пропустить'];

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { completeLesson, updateWordProgress } = useUser();
  const scrollRef = useRef<ScrollView>(null);
  const [started, setStarted] = useState(false);
  const [text, setText] = useState('');

  const lesson = LESSONS.find(l => l.id === lessonId) || LESSONS[0];

  const handleComplete = async () => {
    await completeLesson(lesson.id);
    for (const word of lesson.words) {
      await updateWordProgress(word.id, 1);
    }
    router.back();
  };

  const {
    messages, phase, isTyping, startLesson,
    handleUserAnswer, handleNextWord,
  } = useLesson(lesson, handleComplete);

  useEffect(() => {
    if (started) return;
    setStarted(true);
    startLesson();
  }, []);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isTyping]);

  const sendMessage = (msg: string) => {
    if (!msg.trim()) return;
    handleUserAnswer(msg.trim());
    setText('');
  };

  const quickAnswers = phase === 'teaching' ? QUICK_ANSWERS_TEACH : QUICK_ANSWERS_PRACTICE;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.xs }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{lesson.title}</Text>
          <Text style={styles.headerSub}>{lesson.words.length} слов • ~10 мин</Text>
        </View>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseText}>
            {phase === 'teaching' ? '📚 Учим' : phase === 'practice' ? '🎮 Практика' : phase === 'complete' ? '✅ Готово' : '⏳'}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {isTyping && <TypingIndicator />}
        {phase === 'complete' && (
          <View style={styles.completeBanner}>
            <Text style={styles.completeStar}>🌟</Text>
            <Text style={styles.completeTitle}>Урок завершён!</Text>
            <TouchableOpacity style={styles.completeBtn} onPress={() => router.back()} activeOpacity={0.85}>
              <Text style={styles.completeBtnText}>Вернуться на главную</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Input area */}
      {phase !== 'complete' && (
        <View style={[styles.inputArea, { paddingBottom: insets.bottom + Spacing.sm }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
            {phase === 'teaching' && (
              <TouchableOpacity style={styles.quickBtn} onPress={handleNextWord} activeOpacity={0.8}>
                <Text style={styles.quickBtnText}>Следующее слово →</Text>
              </TouchableOpacity>
            )}
            {quickAnswers.map(qa => (
              <TouchableOpacity key={qa} style={styles.quickBtnSecondary} onPress={() => sendMessage(qa)} activeOpacity={0.8}>
                <Text style={styles.quickBtnSecondaryText}>{qa}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {phase === 'practice' && (
            <View style={styles.textRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Напиши перевод..."
                placeholderTextColor={Colors.textMuted}
                value={text}
                onChangeText={setText}
                returnKeyType="send"
                onSubmitEditing={() => sendMessage(text)}
              />
              <TouchableOpacity
                style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
                onPress={() => sendMessage(text)}
                activeOpacity={0.85}
              >
                <Text style={styles.sendBtnText}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.bgCard, paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm, flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.sm,
  },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bgSurface, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 16, color: Colors.textSecondary },
  headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  headerSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  phaseBadge: {
    backgroundColor: Colors.bgSurface, borderRadius: Radius.sm,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  phaseText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  messagesContainer: { padding: Spacing.md, gap: 2, paddingBottom: Spacing.xl },
  inputArea: {
    backgroundColor: Colors.bgCard, borderTopWidth: 1, borderTopColor: Colors.border,
    paddingTop: Spacing.sm, paddingHorizontal: Spacing.md, gap: Spacing.sm,
  },
  quickRow: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  quickBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.round,
    paddingHorizontal: 16, paddingVertical: 9,
  },
  quickBtnText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
  quickBtnSecondary: {
    backgroundColor: Colors.bgSurface, borderRadius: Radius.round,
    paddingHorizontal: 16, paddingVertical: 9,
    borderWidth: 1, borderColor: Colors.border,
  },
  quickBtnSecondaryText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  textRow: { flexDirection: 'row', gap: 10 },
  textInput: {
    flex: 1, backgroundColor: Colors.bgSurface, borderRadius: Radius.round,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    fontSize: FontSize.md, color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { fontSize: 20, color: Colors.textOnPrimary, fontWeight: FontWeight.bold },
  completeBanner: {
    alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm, marginTop: Spacing.lg,
  },
  completeStar: { fontSize: 56 },
  completeTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.primary },
  completeBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.round,
    paddingVertical: 14, paddingHorizontal: 32, marginTop: Spacing.md,
  },
  completeBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textOnPrimary },
});
