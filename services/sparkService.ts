import { NOVA_RESPONSES, Word, WORDS } from '@/constants/lessonData';

export interface SparkMessage {
  id: string;
  role: 'spark' | 'user';
  text: string;
  word?: Word;
  type?: 'intro' | 'word_teach' | 'question' | 'feedback' | 'complete';
}

export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateWordTeachMessage(word: Word): string {
  return `Новое слово! ✨\n\n**${word.english}** [${word.transcription}] = **${word.russian}** ${word.emoji}\n\n🧠 Ассоциация:\n${word.association}\n\n💬 Пример:\n"${word.example}"\n🇷🇺 "${word.exampleRu}"`;
}

export function generateQuestionMessage(word: Word): string {
  return `Как переводится слово "${word.english}" ${word.emoji}?`;
}

export function checkAnswer(userAnswer: string, word: Word): boolean {
  const clean = (s: string) => s.toLowerCase().trim().replace(/[.,!?]/g, '');
  const answer = clean(userAnswer);
  const correct = clean(word.russian);
  return answer.includes(correct.split(' ')[0]) || correct.includes(answer);
}

export function generateFeedback(isCorrect: boolean, word: Word): string {
  if (isCorrect) {
    return getRandomItem(NOVA_RESPONSES.correct);
  }
  const prefix = getRandomItem(NOVA_RESPONSES.almostCorrect);
  return `${prefix}**${word.russian}** [${word.transcription}] 🌟`;
}

export function generateNovaGreeting(name: string): string {
  const greetings = [
    `Привет, ${name}! Я Nova — твой личный тренер английского. 🌟 Я знаю, что раньше язык мог не даваться. Но со мной всё будет иначе! Маленькие шаги, никакой зубрёжки и только радость от прогресса. Готов(а)?`,
    `Привет, ${name}! Nova рада тебя видеть! 🌟 Сегодня мы начнём путешествие в английский язык. Обещаю — будет легко и интересно!`,
  ];
  return getRandomItem(greetings);
}

export function getWordsForReview(wordProgress: Record<string, any>): Word[] {
  const now = new Date();
  return WORDS.filter(word => {
    const progress = wordProgress[word.id];
    if (!progress) return false;
    if (progress.confidence >= 2) return false;
    const nextReview = new Date(progress.nextReview);
    return now >= nextReview;
  }).slice(0, 5);
}

export function getMotivationalStats(learnedCount: number, streak: number): string {
  if (learnedCount === 0) return 'Nova рядом. Начнём путешествие! 🌟';
  if (learnedCount < 10) return `Ты уже знаешь ${learnedCount} слов! Nova гордится тобой! 🌟`;
  if (learnedCount < 50) return `${learnedCount} слов! Ты уже можешь представиться по-английски! 🚀`;
  if (learnedCount < 100) return `${learnedCount} слов! Ты почти на уровне туриста! 🌍`;
  return `${learnedCount} слов! Ты настоящий полиглот! 🏆`;
}
