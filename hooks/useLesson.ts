import React, { useState, useCallback } from 'react';
import { Lesson, Word } from '@/constants/lessonData';
import {
  SparkMessage, generateWordTeachMessage, generateQuestionMessage,
  generateFeedback, checkAnswer, getRandomItem
} from '@/services/sparkService';
import { NOVA_RESPONSES } from '@/constants/lessonData';
import { novaSpeak, teachWord } from '@/services/voiceService';

type LessonPhase = 'intro' | 'teaching' | 'practice' | 'complete';

export function useLesson(lesson: Lesson, onComplete: () => void) {
  const [messages, setMessages] = useState<SparkMessage[]>([]);
  const [phase, setPhase] = useState<LessonPhase>('intro');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [practiceWordIndex, setPracticeWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredWords, setAnsweredWords] = useState<Record<string, boolean>>({});

  const addMessage = useCallback((msg: Omit<SparkMessage, 'id'>) => {
    const newMsg: SparkMessage = { ...msg, id: Date.now().toString() + Math.random() };
    setMessages(prev => [...prev, newMsg]);
  }, []);

  const simulateTyping = useCallback(async (callback: () => void, delay = 1200) => {
    setIsTyping(true);
    await new Promise(r => setTimeout(r, delay));
    setIsTyping(false);
    callback();
  }, []);

  const startLesson = useCallback(async () => {
    addMessage({ role: 'spark', text: lesson.introMessage, type: 'intro' });
    novaSpeak(lesson.introMessage).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsTyping(false);
    addMessage({
      role: 'spark',
      text: `Сегодня мы выучим ${lesson.words.length} новых слов. Это займёт всего 10 минут. Поехали! 🚀`,
      type: 'intro'
    });
    await new Promise(r => setTimeout(r, 800));
    setPhase('teaching');
    teachNextWord(0);
  }, [lesson]);

  const teachNextWord = useCallback(async (index: number) => {
    if (index >= lesson.words.length) {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
      setIsTyping(false);
      addMessage({
        role: 'spark',
        text: `Отлично! Ты познакомился со всеми словами урока! Теперь проверим, как ты их запомнил. Не волнуйся — это не экзамен, а игра! 🎮`,
        type: 'question'
      });
      await new Promise(r => setTimeout(r, 500));
      setPhase('practice');
      setPracticeWordIndex(0);
      askPracticeQuestion(0);
      return;
    }
    const word = lesson.words[index];
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 900));
    setIsTyping(false);
    addMessage({
      role: 'spark',
      text: generateWordTeachMessage(word),
      word,
      type: 'word_teach'
    });
    setCurrentWordIndex(index + 1);
    teachWord({ english: word.english, russian: word.russian }).catch(() => {});
  }, [lesson]);

  const askPracticeQuestion = useCallback(async (index: number) => {
    if (index >= lesson.words.length) {
      const finalScore = score;
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
      setIsTyping(false);
      addMessage({
        role: 'spark',
        text: `🎉 Урок завершён! Ты справился с ${lesson.words.length} словами! Добавляю их в твою звёздную карту... ✨\n\nВозвращайся завтра — мы закрепим выученное!`,
        type: 'complete'
      });
      setPhase('complete');
      setTimeout(onComplete, 2000);
      return;
    }
    const word = lesson.words[index];
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 700));
    setIsTyping(false);
    addMessage({
      role: 'spark',
      text: generateQuestionMessage(word),
      word,
      type: 'question'
    });
  }, [lesson, score, onComplete]);

  const handleUserAnswer = useCallback(async (answer: string) => {
    if (phase !== 'practice') {
      // In teaching phase — just continue
      addMessage({ role: 'user', text: answer });
      simulateTyping(() => {
        teachNextWord(currentWordIndex);
      });
      return;
    }

    const word = lesson.words[practiceWordIndex];
    addMessage({ role: 'user', text: answer });
    const correct = checkAnswer(answer, word);
    if (correct) setScore(s => s + 1);
    setAnsweredWords(prev => ({ ...prev, [word.id]: correct }));

    simulateTyping(() => {
      const feedbackText = generateFeedback(correct, word);
      addMessage({
        role: 'spark',
        text: feedbackText,
        type: 'feedback'
      });
      novaSpeak(feedbackText).catch(() => {});
      const nextIndex = practiceWordIndex + 1;
      setPracticeWordIndex(nextIndex);
      setTimeout(() => askPracticeQuestion(nextIndex), 800);
    }, 800);
  }, [phase, lesson, practiceWordIndex, currentWordIndex, simulateTyping, teachNextWord, askPracticeQuestion]);

  const handleNextWord = useCallback(() => {
    addMessage({ role: 'user', text: 'Понятно! Следующее слово 👍' });
    simulateTyping(() => {
      teachNextWord(currentWordIndex);
    }, 600);
  }, [currentWordIndex, simulateTyping, teachNextWord]);

  return {
    messages, phase, isTyping, userInput, setUserInput,
    score, currentWordIndex, practiceWordIndex,
    startLesson, handleUserAnswer, handleNextWord, answeredWords,
  };
}
