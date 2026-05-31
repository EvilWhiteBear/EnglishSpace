import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Dimensions, Platform, KeyboardAvoidingView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';
import { UserProfile } from '@/contexts/UserContext';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    image: require('@/assets/images/onboarding-1.png'),
    title: 'Английский с нуля',
    subtitle: 'Для тех, кому раньше не давался язык. Никакой зубрёжки — только понимание.',
  },
  {
    image: require('@/assets/images/onboarding-2.png'),
    title: 'Звёздная карта слов',
    subtitle: 'Каждое выученное слово — новая звезда на твоей карте. Смотри, как растёт твоя галактика!',
  },
  {
    image: require('@/assets/images/onboarding-3.png'),
    title: 'Маленькие победы каждый день',
    subtitle: 'Всего 10 минут в день — и через месяц ты будешь говорить по-английски!',
  },
];

const GOALS = [
  { id: 'work', label: '💼 Работа', desc: 'Для карьеры и деловых переговоров' },
  { id: 'travel', label: '✈️ Путешествия', desc: 'Общаться за границей' },
  { id: 'series', label: '🎬 Сериалы', desc: 'Смотреть без субтитров' },
  { id: 'communication', label: '💬 Общение', desc: 'Знакомиться с иностранцами' },
];

const TIME_OPTIONS = [
  { value: 5, label: '5 мин', desc: 'Минимум' },
  { value: 10, label: '10 мин', desc: 'Оптимально' },
  { value: 15, label: '15 мин', desc: 'Активно' },
  { value: 20, label: '20 мин', desc: 'Максимум' },
];

const SPECIAL_NEEDS = [
  { id: 'none', label: '😊 Всё хорошо', desc: 'Нет особых сложностей' },
  { id: 'memory', label: '🧠 Плохая память', desc: 'Быстро забываю новое' },
  { id: 'dyslexia', label: '📖 Дислексия', desc: 'Сложно с чтением' },
  { id: 'adhd', label: '⚡ СДВГ', desc: 'Трудно концентрироваться' },
];

type Step = 'slides' | 'name' | 'goal' | 'time' | 'needs' | 'done';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { saveProfile } = useUser();
  const scrollRef = useRef<ScrollView>(null);

  const [step, setStep] = useState<Step>('slides');
  const [slideIndex, setSlideIndex] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [dailyTime, setDailyTime] = useState(10);
  const [specialNeeds, setSpecialNeeds] = useState('none');

  const goNextSlide = () => {
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setStep('name');
    }
  };

  const finish = async () => {
    const profile: UserProfile = {
      name: name.trim() || 'Ученик',
      goal,
      dailyTime,
      previousAttempt: '',
      specialNeeds,
      onboardingDone: true,
      createdAt: new Date().toISOString(),
    };
    await saveProfile(profile);
    router.replace('/(tabs)');
  };

  if (step === 'slides') {
    return (
      <View style={[styles.slideContainer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Image
          source={SLIDES[slideIndex].image}
          style={styles.slideImage}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.slideOverlay} />
        <View style={styles.slideContent}>
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === slideIndex && styles.dotActive]} />
            ))}
          </View>
          <Text style={styles.slideTitle}>{SLIDES[slideIndex].title}</Text>
          <Text style={styles.slideSubtitle}>{SLIDES[slideIndex].subtitle}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={goNextSlide} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>
              {slideIndex < SLIDES.length - 1 ? 'Дальше →' : 'Начать знакомство'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (step === 'name') {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: Colors.bg }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.questionContainer, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
          <Image source={require('@/assets/images/nova-avatar.png')} style={styles.sparkSmall} contentFit="contain" />
          <Text style={styles.sparkLabel}>Nova 🌟</Text>
          <Text style={styles.questionTitle}>Привет! Я Nova 🌟</Text>
          <Text style={styles.questionSub}>Твой личный тренер английского. Как тебя зовут?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Введи своё имя..."
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => name.trim() && setStep('goal')}
          />
          <TouchableOpacity
            style={[styles.primaryBtn, !name.trim() && styles.btnDisabled]}
            onPress={() => name.trim() && setStep('goal')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Приятно познакомиться!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (step === 'goal') {
    return (
      <View style={[styles.questionContainer, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
        <Image source={require('@/assets/images/nova-avatar.png')} style={styles.sparkSmall} contentFit="contain" />
        <Text style={styles.sparkLabel}>Nova 🌟</Text>
        <Text style={styles.questionTitle}>Зачем тебе английский?</Text>
        <Text style={styles.questionSub}>Это поможет мне подобрать лучшие примеры для тебя, {name}!</Text>
        <View style={styles.optionsGrid}>
          {GOALS.map(g => (
            <TouchableOpacity
              key={g.id}
              style={[styles.optionCard, goal === g.id && styles.optionCardActive]}
              onPress={() => setGoal(g.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionLabel}>{g.label}</Text>
              <Text style={styles.optionDesc}>{g.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, !goal && styles.btnDisabled]}
          onPress={() => goal && setStep('time')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>Отлично!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'time') {
    return (
      <View style={[styles.questionContainer, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
        <Image source={require('@/assets/images/nova-avatar.png')} style={styles.sparkSmall} contentFit="contain" />
        <Text style={styles.sparkLabel}>Nova 🌟</Text>
        <Text style={styles.questionTitle}>Сколько времени в день? ⏱</Text>
        <Text style={styles.questionSub}>Даже 5 минут — это уже прогресс. Главное — регулярность!</Text>
        <View style={styles.timeRow}>
          {TIME_OPTIONS.map(t => (
            <TouchableOpacity
              key={t.value}
              style={[styles.timeCard, dailyTime === t.value && styles.timeCardActive]}
              onPress={() => setDailyTime(t.value)}
              activeOpacity={0.8}
            >
              <Text style={[styles.timeValue, dailyTime === t.value && styles.timeValueActive]}>{t.label}</Text>
              <Text style={[styles.timeDesc, dailyTime === t.value && styles.timeLabelActive]}>{t.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('needs')} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Договорились!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'needs') {
    return (
      <View style={[styles.questionContainer, { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl }]}>
        <Image source={require('@/assets/images/nova-avatar.png')} style={styles.sparkSmall} contentFit="contain" />
        <Text style={styles.sparkLabel}>Nova 🌟</Text>
        <Text style={styles.questionTitle}>Есть особенности? 🤝</Text>
        <Text style={styles.questionSub}>Я адаптирую метод специально под тебя. Это не слабость — это суперсила!</Text>
        <View style={styles.optionsGrid}>
          {SPECIAL_NEEDS.map(n => (
            <TouchableOpacity
              key={n.id}
              style={[styles.optionCard, specialNeeds === n.id && styles.optionCardActive]}
              onPress={() => setSpecialNeeds(n.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionLabel}>{n.label}</Text>
              <Text style={styles.optionDesc}>{n.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={finish} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Создать мой план! 🚀</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  slideContainer: { flex: 1, backgroundColor: Colors.bg },
  slideImage: { position: 'absolute', width, height, top: 0, left: 0 },
  slideOverlay: {
    position: 'absolute', width, height, top: 0, left: 0,
    backgroundColor: 'rgba(6,6,20,0.55)',
  },
  slideContent: {
    flex: 1, justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl,
  },
  dotsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textMuted },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  slideTitle: {
    fontSize: FontSize.hero, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, marginBottom: Spacing.sm, lineHeight: 40,
  },
  slideSubtitle: {
    fontSize: FontSize.md, color: Colors.textSecondary,
    lineHeight: 24, marginBottom: Spacing.xl,
  },
  questionContainer: {
    flex: 1, backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg, alignItems: 'center',
  },
  sparkSmall: { width: 72, height: 72, marginBottom: Spacing.xs },
  sparkLabel: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: FontWeight.semibold, marginBottom: Spacing.md },
  questionTitle: {
    fontSize: FontSize.xxl, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm,
  },
  questionSub: {
    fontSize: FontSize.md, color: Colors.textSecondary,
    textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xl,
  },
  textInput: {
    width: '100%', backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg, paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md, fontSize: FontSize.lg,
    color: Colors.textPrimary, borderWidth: 1.5, borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  optionsGrid: {
    width: '100%', gap: Spacing.sm, marginBottom: Spacing.xl,
  },
  optionCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
    borderWidth: 1.5, borderColor: Colors.border,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  optionCardActive: {
    borderColor: Colors.primary, backgroundColor: Colors.primarySoft,
  },
  optionLabel: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.textPrimary },
  optionDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1, textAlign: 'right', marginLeft: Spacing.sm },
  timeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl, width: '100%' },
  timeCard: {
    flex: 1, backgroundColor: Colors.bgCard, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border,
  },
  timeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primarySoft },
  timeValue: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textSecondary },
  timeValueActive: { color: Colors.primary },
  timeDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  timeLabelActive: { color: Colors.primary },
  primaryBtn: {
    width: '100%', backgroundColor: Colors.primary,
    borderRadius: Radius.round, paddingVertical: 16,
    alignItems: 'center', marginTop: 'auto',
  },
  btnDisabled: { opacity: 0.4 },
  primaryBtnText: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
});
