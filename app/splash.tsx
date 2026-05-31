import React, { useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing,
  Dimensions, TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

// ─── Мерцающие золотые звёзды поверх картинки ────────────────────
function TinyDot({ x, y, size, delay }: {
  x: number; y: number; size: number; delay: number;
}) {
  const opacity = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1, duration: 1500 + Math.random() * 2000,
          delay, useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.2, duration: 1500 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: '#FFD700', opacity,
      }}
      pointerEvents="none"
    />
  );
}

function GoldStars() {
  const stars = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * (height * 0.65),
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3000,
    })), []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map(s => <TinyDot key={s.id} {...s} />)}
    </View>
  );
}

// ─── Карточка Nova ────────────────────────────────────────────────
function NovaCard({
  slideAnim, onPress,
}: {
  slideAnim: Animated.Value;
  onPress: () => void;
}) {
  return (
    <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
      {/* Логотип */}
      <Text style={styles.appName}>SparkEnglish</Text>
      <Text style={styles.appTagline}>Английский с нуля — легко!</Text>

      {/* Nova представляется */}
      <View style={styles.novaRow}>
        <Image
          source={require('@/assets/images/nova-avatar.png')}
          style={styles.novaAvatar}
          contentFit="contain"
        />
        <View style={styles.novaBubble}>
          <Text style={styles.novaName}>Nova 🌟</Text>
          <Text style={styles.novaRole}>Твой личный тренер</Text>
        </View>
      </View>

      <Text style={styles.novaMsg}>
        {'Привет! Я Nova —\nтвой личный тренер английского.\n\nПомогу выучить язык без стресса\nи зубрёжки. Даже если раньше\nне получалось!\n\nДавай познакомимся?'}
      </Text>

      <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.88}>
        <Text style={styles.btnText}>Поехали! 🚀</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Главный экран ────────────────────────────────────────────────
interface SplashScreenProps {
  onContinue: () => void;
}

export default function SplashScreen({ onContinue }: SplashScreenProps) {
  const cardSlide = useRef(new Animated.Value(500)).current;
  const imageScale = useRef(new Animated.Value(1.08)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Лёгкий Ken Burns на фото
    Animated.timing(imageScale, {
      toValue: 1.0, duration: 6000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Overlay появляется
    Animated.timing(overlayOpacity, {
      toValue: 1, duration: 800,
      useNativeDriver: true,
    }).start();

    // Карточка Nova всплывает снизу через 1.2 сек
    setTimeout(() => {
      Animated.spring(cardSlide, {
        toValue: 0, tension: 60, friction: 11,
        useNativeDriver: true,
      }).start();
    }, 1200);
  }, []);

  return (
    <View style={styles.container}>
      {/* Fullscreen фото — тот же стиль что онбординг */}
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: imageScale }] }]}>
        <Image
          source={require('@/assets/images/onboarding-1.png')}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      </Animated.View>

      {/* Градиентный overlay (как в онбординге) */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}>
        <LinearGradient
          colors={[
            'rgba(6,6,20,0.15)',
            'rgba(6,6,20,0.25)',
            'rgba(6,6,20,0.55)',
            'rgba(6,6,20,0.92)',
            'rgba(6,6,20,1.0)',
          ]}
          locations={[0, 0.2, 0.45, 0.65, 0.85]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Золотые звёздочки поверх */}
      <GoldStars />

      {/* Карточка Nova снизу */}
      <NovaCard slideAnim={cardSlide} onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060614',
  },

  // Карточка внизу
  card: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl + 16,
    gap: Spacing.md,
  },

  // Название приложения
  appName: {
    fontSize: 38,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255,215,0,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  appTagline: {
    fontSize: FontSize.md,
    color: 'rgba(240,240,255,0.75)',
    marginTop: -8,
  },

  // Nova строка
  novaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  novaAvatar: { width: 44, height: 44 },
  novaBubble: { gap: 2 },
  novaName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  novaRole: {
    fontSize: FontSize.sm,
    color: 'rgba(180,200,255,0.7)',
  },

  // Сообщение
  novaMsg: {
    fontSize: FontSize.md,
    color: 'rgba(220,230,255,0.92)',
    lineHeight: 24,
  },

  // Кнопка — точно как в онбординге
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.round,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  btnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textOnPrimary,
  },
});
