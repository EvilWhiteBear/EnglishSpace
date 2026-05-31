import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, TextInput, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '@/constants/theme';
import { useUser } from '@/hooks/useUser';
import { WORDS, Word } from '@/constants/lessonData';
import { pronounceWord, stopSpeaking } from '@/services/voiceService';

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'learned', label: 'Выучены' },
  { id: 'learning', label: 'В работе' },
  { id: 'unknown', label: 'Новые' },
];

function WordCard({ word, progress, onConfidence }: {
  word: Word;
  progress?: { confidence: number };
  onConfidence: (id: string, c: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const confidence = progress?.confidence ?? -1;

  const handleListen = async () => {
    if (isPlaying) {
      await stopSpeaking();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    await pronounceWord(word.english);
    setIsPlaying(false);
  };

  return (
    <TouchableOpacity style={styles.wordCard} onPress={() => setExpanded(e => !e)} activeOpacity={0.85}>
      <View style={styles.wordCardHeader}>
        <View style={styles.wordEmojiBadge}>
          <Text style={styles.wordEmoji}>{word.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.wordEnglish}>{word.english}</Text>
            <Text style={styles.wordTranscription}>[{word.transcription}]</Text>
          </View>
          <Text style={styles.wordRussian}>{word.russian}</Text>
        </View>
        <TouchableOpacity
          style={styles.listenBtn}
          onPress={handleListen}
          activeOpacity={0.8}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isPlaying
            ? <ActivityIndicator size="small" color={Colors.primary} />
            : <Text style={styles.listenIcon}>🔊</Text>
          }
        </TouchableOpacity>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {expanded && (
        <View style={styles.wordExpanded}>
          <View style={styles.associationBox}>
            <Text style={styles.associationLabel}>🧠 Ассоциация</Text>
            <Text style={styles.associationText}>{word.association}</Text>
          </View>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleEn}>💬 {word.example}</Text>
            <Text style={styles.exampleRu}>🇷🇺 {word.exampleRu}</Text>
          </View>
          <View style={styles.confidenceRow}>
            <Text style={styles.confidenceLabel}>Как хорошо помнишь?</Text>
            <View style={styles.confidenceBtns}>
              {[
                { v: 0, label: '😕 Не помню' },
                { v: 1, label: '🤔 Помню' },
                { v: 2, label: '😎 Отлично!' },
              ].map(btn => (
                <TouchableOpacity
                  key={btn.v}
                  style={[styles.confBtn, confidence === btn.v && styles.confBtnActive]}
                  onPress={() => onConfidence(word.id, btn.v)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.confBtnText, confidence === btn.v && styles.confBtnTextActive]}>
                    {btn.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function DictionaryScreen() {
  const insets = useSafeAreaInsets();
  const { stats, updateWordProgress } = useUser();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = WORDS;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(w =>
        w.english.toLowerCase().includes(q) || w.russian.toLowerCase().includes(q)
      );
    }
    if (filter === 'learned') result = result.filter(w => stats.wordProgress[w.id]?.confidence === 2);
    if (filter === 'learning') result = result.filter(w => stats.wordProgress[w.id]?.confidence === 1);
    if (filter === 'unknown') result = result.filter(w => !stats.wordProgress[w.id] || stats.wordProgress[w.id].confidence === 0);
    return result;
  }, [search, filter, stats.wordProgress]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text style={styles.title}>Мой словарь</Text>
        <Text style={styles.subtitle}>
          {Object.values(stats.wordProgress).filter(w => w.confidence >= 1).length} из {WORDS.length} выучено
        </Text>
        <TextInput
          style={styles.search}
          placeholder="Искать слово..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        <View style={styles.filtersRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
              onPress={() => setFilter(f.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: Spacing.md, gap: Spacing.sm }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Слов не найдено</Text>
          </View>
        }
        renderItem={({ item }) => (
          <WordCard
            word={item}
            progress={stats.wordProgress[item.id]}
            onConfidence={updateWordProgress}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.bgCard, paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginBottom: 2 },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  search: {
    backgroundColor: Colors.bgSurface, borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    fontSize: FontSize.md, color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm,
  },
  filtersRow: { flexDirection: 'row', gap: 8 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: Radius.round,
    backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  filterText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  filterTextActive: { color: Colors.primary },
  wordCard: {
    backgroundColor: Colors.bgCard, borderRadius: Radius.xl,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  wordCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  wordEmojiBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.bgSurface, alignItems: 'center', justifyContent: 'center',
  },
  wordEmoji: { fontSize: 22 },
  wordEnglish: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  wordTranscription: { fontSize: FontSize.sm, color: Colors.accent },
  wordRussian: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 1 },
  listenBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bgSurface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  listenIcon: { fontSize: 18 },
  expandIcon: { fontSize: 12, color: Colors.textMuted },
  wordExpanded: { marginTop: Spacing.md, gap: Spacing.sm },
  associationBox: {
    backgroundColor: Colors.accentSoft, borderRadius: Radius.lg,
    padding: Spacing.sm, borderWidth: 1, borderColor: Colors.accentMuted,
  },
  associationLabel: { fontSize: FontSize.xs, color: Colors.accent, fontWeight: FontWeight.semibold, marginBottom: 3 },
  associationText: { fontSize: FontSize.sm, color: Colors.textPrimary, lineHeight: 20 },
  exampleBox: {
    backgroundColor: Colors.bgSurface, borderRadius: Radius.lg,
    padding: Spacing.sm, gap: 4,
  },
  exampleEn: { fontSize: FontSize.sm, color: Colors.textPrimary, fontStyle: 'italic' },
  exampleRu: { fontSize: FontSize.sm, color: Colors.textSecondary },
  confidenceRow: { gap: Spacing.xs },
  confidenceLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  confidenceBtns: { flexDirection: 'row', gap: 6 },
  confBtn: {
    flex: 1, paddingVertical: 8, borderRadius: Radius.lg,
    backgroundColor: Colors.bgSurface, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  confBtnActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  confBtnText: { fontSize: 11, color: Colors.textSecondary, fontWeight: FontWeight.medium },
  confBtnTextActive: { color: Colors.primary },
  empty: { alignItems: 'center', padding: Spacing.xxl },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted },
});
