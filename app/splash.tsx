import React, { useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing,
  Dimensions, TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

// ─── SVG Astronaut ────────────────────────────────────────────────
function AstronautSVG({ size = 210 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 220">
      <Defs>
        <RadialGradient id="hg" cx="45%" cy="35%" r="55%">
          <Stop offset="0%" stopColor="#2A4A8A" />
          <Stop offset="100%" stopColor="#0A1A3A" />
        </RadialGradient>
        <RadialGradient id="sg" cx="50%" cy="30%" r="60%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#C8D4E8" />
        </RadialGradient>
      </Defs>
      {/* Тело */}
      <Ellipse cx="100" cy="160" rx="46" ry="52" fill="url(#sg)" />
      <Rect x="88" y="108" width="24" height="16" rx="4" fill="#D0D8EC" />
      <Ellipse cx="100" cy="126" rx="30" ry="10" fill="#C8D0E4" />
      {/* Детали груди */}
      <Rect x="82" y="138" width="36" height="5" rx="2.5" fill="#B8C4D8" />
      <Circle cx="100" cy="153" r="9" fill="#E8ECF8" />
      <Circle cx="100" cy="153" r="6" fill="#FFD700" />
      <Circle cx="100" cy="153" r="3" fill="#FF8C00" />
      {/* Панель управления */}
      <Rect x="84" y="163" width="32" height="18" rx="4" fill="#D0D8EC" />
      <Circle cx="91" cy="172" r="3" fill="#FF4444" />
      <Circle cx="100" cy="172" r="3" fill="#44FF44" />
      <Circle cx="109" cy="172" r="3" fill="#4488FF" />
      {/* Руки */}
      <Ellipse cx="60" cy="150" rx="15" ry="28" fill="url(#sg)" transform="rotate(-12 60 150)" />
      <Ellipse cx="52" cy="175" rx="13" ry="10" fill="#B8C4D8" />
      <Ellipse cx="140" cy="150" rx="15" ry="28" fill="url(#sg)" transform="rotate(12 140 150)" />
      <Ellipse cx="148" cy="175" rx="13" ry="10" fill="#B8C4D8" />
      {/* Ноги и ботинки */}
      <Ellipse cx="83" cy="204" rx="16" ry="18" fill="#C8D4E8" />
      <Ellipse cx="117" cy="204" rx="16" ry="18" fill="#C8D4E8" />
      <Ellipse cx="83" cy="215" rx="18" ry="8" fill="#A8B4C8" />
      <Ellipse cx="117" cy="215" rx="18" ry="8" fill="#A8B4C8" />
      {/* Шлем */}
      <Circle cx="100" cy="76" r="44" fill="#D8E0F0" />
      <Ellipse cx="59" cy="78" rx="8" ry="16" fill="#C0CCD8" />
      <Ellipse cx="141" cy="78" rx="8" ry="16" fill="#C0CCD8" />
      {/* Визор */}
      <Ellipse cx="100" cy="76" rx="30" ry="28" fill="url(#hg)" />
      {/* Отражения в визоре */}
      <Circle cx="85" cy="64" r="5" fill="#FFFFFF" opacity="0.5" />
      <Circle cx="116" cy="82" r="3" fill="#FFFFFF" opacity="0.3" />
      <Circle cx="90" cy="88" r="2" fill="#FFFFFF" opacity="0.2" />
      {/* Блик на шлеме */}
      <Ellipse cx="82" cy="56" rx="14" ry="9" fill="#FFFFFF" opacity="0.18"
        transform="rotate(-25 82 56)" />
      {/* Антенна */}
      <Rect x="98" y="32" width="4" height="14" rx="2" fill="#C0CCD8" />
      <Circle cx="100" cy="30" r="5" fill="#FFD700" />
    </Svg>
  );
}

// ─── Floating + Rotation hook ──────────────────────────────────────
function useAstronautAnimation() {
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Float up/down
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -18,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 18,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Slight tilt left/right
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: -1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotateInterp = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  return { translateY, rotate: rotateInterp };
}

// ─── Nebula Cloud ──────────────────────────────────────────────────
function NebulaCloud({
  color, x, y, w, h, minOp, maxOp, duration,
}: {
  color: string; x: number; y: number; w: number; h: number;
  minOp: number; maxOp: number; duration: number;
}) {
  const opacity = useRef(new Animated.Value(minOp)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: maxOp, duration, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: minOp, duration, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x, top: y,
        width: w, height: h,
        borderRadius: w / 2,
        backgroundColor: color,
        opacity,
      }}
      pointerEvents="none"
    />
  );
}

function Nebula() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Purple — top left */}
      <NebulaCloud color="#2D1B69" x={-80} y={-60} w={320} h={280} minOp={0.25} maxOp={0.5} duration={9000} />
      {/* Teal — bottom right */}
      <NebulaCloud color="#0D4F4F" x={width - 160} y={height - 340} w={260} h={260} minOp={0.2} maxOp={0.45} duration={11000} />
      {/* Magenta — center right */}
      <NebulaCloud color="#4A0E2E" x={width - 140} y={height * 0.3} w={220} h={200} minOp={0.15} maxOp={0.38} duration={7500} />
      {/* Blue accent — bottom left */}
      <NebulaCloud color="#0A1F5C" x={-60} y={height * 0.55} w={200} h={180} minOp={0.2} maxOp={0.42} duration={8500} />
    </View>
  );
}

// ─── Milky Way ─────────────────────────────────────────────────────
function MilkyWay() {
  return (
    <View
      style={{
        position: 'absolute',
        width: width * 2,
        height: 90,
        left: -width * 0.3,
        top: height * 0.22,
        backgroundColor: 'rgba(200,220,255,0.045)',
        transform: [{ rotate: '-25deg' }],
        borderRadius: 45,
      }}
      pointerEvents="none"
    />
  );
}

// ─── Stars ─────────────────────────────────────────────────────────
function TinyDot({ x, y, size, color, minDelay, maxDur }: {
  x: number; y: number; size: number; color: string; minDelay: number; maxDur: number;
}) {
  const opacity = useRef(new Animated.Value(0.2)).current;
  useEffect(() => {
    const dur = maxDur + Math.random() * maxDur;
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: dur, delay: minDelay, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: dur, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View
      style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity }}
      pointerEvents="none"
    />
  );
}

function GlowStar({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const opacity = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const dur = 800 + Math.random() * 1500;
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: dur, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: dur, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={{ position: 'absolute', left: x - size * 4, top: y - size * 4 }} pointerEvents="none">
      {/* Center dot */}
      <View style={{
        position: 'absolute',
        left: size * 3.5, top: size * 3.5,
        width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        shadowColor: color,
        shadowOpacity: 0.9,
        shadowRadius: size * 3,
        shadowOffset: { width: 0, height: 0 },
        elevation: 6,
      }} />
      {/* Horizontal ray */}
      <Animated.View style={{
        position: 'absolute',
        width: size * 9, height: 1,
        backgroundColor: color,
        opacity: Animated.multiply(opacity, new Animated.Value(0.35)),
        top: size * 4,
        left: 0,
      }} />
      {/* Vertical ray */}
      <Animated.View style={{
        position: 'absolute',
        width: 1, height: size * 9,
        backgroundColor: color,
        opacity: Animated.multiply(opacity, new Animated.Value(0.35)),
        left: size * 4,
        top: 0,
      }} />
    </Animated.View>
  );
}

function StarField() {
  const tinyStars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1,
      color: '#FFFFFF',
      minDelay: Math.random() * 3000,
      maxDur: 4000 + Math.random() * 2000,
    })), []);

  const medStars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i + 100,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2,
      color: i % 3 === 0 ? '#E8F0FF' : '#FFFFFF',
      minDelay: Math.random() * 2000,
      maxDur: 2000 + Math.random() * 2000,
    })), []);

  const glowStars = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => {
      const colors = ['#FFFFFF', '#B0C4FF', '#FFE566', '#FFFFFF', '#C8E0FF'];
      return {
        id: i + 200,
        x: Math.random() * width,
        y: Math.random() * height,
        size: 3 + Math.random() * 1.5,
        color: colors[i % colors.length],
      };
    }), []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {tinyStars.map(s => <TinyDot key={s.id} {...s} />)}
      {medStars.map(s => <TinyDot key={s.id} {...s} />)}
      {glowStars.map(s => <GlowStar key={s.id} {...s} />)}
    </View>
  );
}

// ─── Orbiting words ────────────────────────────────────────────────
const ORBIT_WORDS = ['Hello', 'Cat', 'Love', 'Go', 'Yes', 'Hi', 'Dog', 'Good', 'Water'];
function OrbitingWords({ radius = 118 }: { radius?: number }) {
  const rotate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1, duration: 10000,
        easing: Easing.linear, useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View
      style={{ position: 'absolute', width: radius * 2, height: radius * 2 }}
      pointerEvents="none"
    >
      {ORBIT_WORDS.map((word, i) => {
        const angle = (i / ORBIT_WORDS.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius - 16;
        const y = Math.sin(angle) * radius - 10;
        return (
          <Animated.Text
            key={word + i}
            style={[
              orbitStyles.word,
              {
                left: radius + x,
                top: radius + y,
                transform: [{
                  rotate: rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
              },
            ]}
          >
            {word}
          </Animated.Text>
        );
      })}
    </View>
  );
}

const orbitStyles = StyleSheet.create({
  word: {
    position: 'absolute',
    fontSize: 11,
    color: 'rgba(160,190,255,0.5)',
    fontWeight: '600',
  },
});

// ─── Nova greeting card ────────────────────────────────────────────
function NovaGreetingCard({ slideAnim, onPress }: { slideAnim: Animated.Value; onPress: () => void }) {
  return (
    <Animated.View style={[cardStyles.card, { transform: [{ translateY: slideAnim }] }]}>
      <View style={cardStyles.header}>
        <Image
          source={require('@/assets/images/nova-avatar.png')}
          style={cardStyles.avatar}
          contentFit="contain"
        />
        <View>
          <Text style={cardStyles.novaName}>Nova 🌟</Text>
          <Text style={cardStyles.novaRole}>Твой личный тренер</Text>
        </View>
      </View>
      <Text style={cardStyles.message}>
        {'Привет! Я Nova —\nтвой личный тренер английского.\n\nПомогу выучить язык без стресса\nи зубрёжки. Даже если раньше\nне получалось!\n\nДавай познакомимся?'}
      </Text>
      <TouchableOpacity style={cardStyles.btn} onPress={onPress} activeOpacity={0.88}>
        <Text style={cardStyles.btnText}>Поехали! 🚀</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(8,12,36,0.97)',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderColor: 'rgba(90,120,255,0.35)',
    gap: Spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  avatar: { width: 48, height: 48 },
  novaName: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: '#FFD700' },
  novaRole: { fontSize: FontSize.sm, color: 'rgba(180,200,255,0.7)', marginTop: 2 },
  message: { fontSize: FontSize.md, color: 'rgba(220,230,255,0.9)', lineHeight: 24 },
  btn: {
    backgroundColor: '#5B7BFF', borderRadius: Radius.round,
    paddingVertical: 16, alignItems: 'center', marginTop: Spacing.xs,
  },
  btnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: '#FFFFFF' },
});

// ─── Main Splash Screen ────────────────────────────────────────────
interface SplashScreenProps {
  onContinue: () => void;
}

export default function SplashScreen({ onContinue }: SplashScreenProps) {
  const { translateY, rotate } = useAstronautAnimation();
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(400)).current;
  const astronautScale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Astronaut entrance
    Animated.spring(astronautScale, {
      toValue: 1, tension: 60, friction: 9, useNativeDriver: true,
    }).start();

    // Title fade in
    setTimeout(() => {
      Animated.timing(titleOpacity, {
        toValue: 1, duration: 900, useNativeDriver: true,
      }).start();
    }, 500);

    // Nova card slide up
    setTimeout(() => {
      Animated.spring(cardSlide, {
        toValue: 0, tension: 65, friction: 11, useNativeDriver: true,
      }).start();
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Deep space gradient background */}
      <LinearGradient
        colors={['#000008', '#040818', '#050A1A', '#080F28', '#0D1B3E']}
        locations={[0, 0.2, 0.5, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Nebula clouds */}
      <Nebula />

      {/* Milky Way stripe */}
      <MilkyWay />

      {/* Stars — 3 layers */}
      <StarField />

      {/* Center content */}
      <View style={styles.centerBlock}>
        {/* Astronaut + orbit */}
        <View style={styles.orbitContainer}>
          <OrbitingWords radius={118} />
          <Animated.View style={{ transform: [{ translateY }, { rotate }, { scale: astronautScale }] }}>
            <AstronautSVG size={220} />
          </Animated.View>
        </View>

        {/* Title block */}
        <Animated.View style={{ opacity: titleOpacity, alignItems: 'center' }}>
          <Text style={styles.appName}>SparkEnglish</Text>
          <Text style={styles.tagline}>Английский с нуля — легко!</Text>
          <Text style={styles.subTagline}>Без стресса. Без зубрёжки. С Nova. 🌟</Text>
        </Animated.View>
      </View>

      {/* Nova card */}
      <NovaGreetingCard slideAnim={cardSlide} onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000008',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  centerBlock: {
    alignItems: 'center',
    gap: Spacing.xl,
    marginBottom: 248,
  },
  orbitContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  astronautImage: {
    width: 220,
    height: 220,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 1,
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  tagline: {
    fontSize: FontSize.md,
    color: '#8899CC',
    marginTop: 8,
    textAlign: 'center',
  },
  subTagline: {
    fontSize: FontSize.sm,
    color: 'rgba(136,153,204,0.65)',
    marginTop: 4,
    textAlign: 'center',
  },
});
