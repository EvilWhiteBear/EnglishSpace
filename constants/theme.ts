// English Space — Design Tokens
export const Colors = {
  // Base
  bg: '#060614',
  bgCard: '#0e0e2a',
  bgCardLight: '#14143a',
  bgSurface: '#1a1a40',
  bgSurfaceLight: '#22225a',

  // Brand
  primary: '#FFD700',
  primaryMuted: 'rgba(255,215,0,0.15)',
  primarySoft: 'rgba(255,215,0,0.08)',
  accent: '#7C6CF8',
  accentMuted: 'rgba(124,108,248,0.2)',
  accentSoft: 'rgba(124,108,248,0.08)',
  teal: '#4ECDC4',
  tealMuted: 'rgba(78,205,196,0.15)',

  // Text
  textPrimary: '#F0F0FF',
  textSecondary: '#9999BB',
  textMuted: '#555577',
  textOnPrimary: '#0a0a1a',

  // Semantic
  success: '#4ECDC4',
  error: '#FF6B6B',
  warning: '#FFD700',

  // Borders
  border: 'rgba(255,255,255,0.07)',
  borderBright: 'rgba(255,255,255,0.15)',

  // Star map
  starBright: '#FFD700',
  starLearned: '#7C6CF8',
  starUnknown: '#2a2a5a',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  hero: 32,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
