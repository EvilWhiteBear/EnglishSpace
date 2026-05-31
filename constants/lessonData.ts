export interface Word {
  id: string;
  english: string;
  transcription: string; // Russian letters
  russian: string;
  association: string;
  emoji: string;
  example: string;
  exampleRu: string;
  level: number; // 1 = week1, 2 = week2, etc.
  topic: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  week: number;
  day: number;
  words: Word[];
  introMessage: string;
}

export const WORDS: Word[] = [
  // Week 1 — Приветствия
  {
    id: 'w1', english: 'Hello', transcription: 'Хэ-ЛОУ', russian: 'Привет',
    association: 'Хэ-лоу — как будто кто-то упал в лужу и говорит "Хэ! Лоу!" (низко)',
    emoji: '👋', example: 'Hello! My name is Anna.', exampleRu: 'Привет! Меня зовут Анна.',
    level: 1, topic: 'greetings'
  },
  {
    id: 'w2', english: 'Hi', transcription: 'ХАЙ', russian: 'Привет (неформально)',
    association: 'ХАЙ — как восклицание "ХАЙ!" когда увидел друга',
    emoji: '✋', example: 'Hi! How are you?', exampleRu: 'Привет! Как дела?',
    level: 1, topic: 'greetings'
  },
  {
    id: 'w3', english: 'Good morning', transcription: 'Гуд МОРНИН', russian: 'Доброе утро',
    association: 'Гуд МОРНИН — ГУД (хорошо) + МОРНИН (морить? нет, МОР-НИНГ = утром)',
    emoji: '🌅', example: 'Good morning! Sleep well?', exampleRu: 'Доброе утро! Хорошо спал?',
    level: 1, topic: 'greetings'
  },
  {
    id: 'w4', english: 'Thank you', transcription: 'СЭНК ю', russian: 'Спасибо',
    association: 'СЭНК ю — как "СЭНК-SAY" — скажи спасибо! Просто СЭНК ЮЮ',
    emoji: '🙏', example: 'Thank you so much!', exampleRu: 'Большое спасибо!',
    level: 1, topic: 'greetings'
  },
  {
    id: 'w5', english: 'Please', transcription: 'ПЛИЗ', russian: 'Пожалуйста',
    association: 'ПЛИЗ — как "ПЛИЗ, ну ПЛИЗ!" — когда просишь что-то',
    emoji: '🥺', example: 'Coffee, please!', exampleRu: 'Кофе, пожалуйста!',
    level: 1, topic: 'greetings'
  },
  {
    id: 'w6', english: 'Yes', transcription: 'ЕС', russian: 'Да',
    association: 'ЕС — как "ЕС!" воскликнул когда рад',
    emoji: '✅', example: 'Yes, I understand!', exampleRu: 'Да, я понимаю!',
    level: 1, topic: 'basics'
  },
  {
    id: 'w7', english: 'No', transcription: 'НОУ', russian: 'Нет',
    association: 'НОУ — как "НУ НОУ!" когда отказываешься',
    emoji: '❌', example: 'No, thank you.', exampleRu: 'Нет, спасибо.',
    level: 1, topic: 'basics'
  },
  {
    id: 'w8', english: 'Cat', transcription: 'КЭТ', russian: 'Кот',
    association: 'КЭТ — твой кот в кепке! КЭТ идёт в магазин за едой',
    emoji: '🐱', example: 'My cat is very funny.', exampleRu: 'Мой кот очень смешной.',
    level: 1, topic: 'animals'
  },
  {
    id: 'w9', english: 'Dog', transcription: 'ДОГ', russian: 'Собака',
    association: 'ДОГ — ДОГнал кошку! Собака всегда ДОГОНЯЕТ',
    emoji: '🐶', example: 'I love my dog!', exampleRu: 'Я люблю свою собаку!',
    level: 1, topic: 'animals'
  },
  {
    id: 'w10', english: 'Water', transcription: 'УО-ТЕР', russian: 'Вода',
    association: 'УО-ТЕР — ВАТЕРЛОО! Наполеон выпил воду перед битвой',
    emoji: '💧', example: 'Can I have some water?', exampleRu: 'Можно мне воды?',
    level: 1, topic: 'basics'
  },
  // Week 2 — Семья
  {
    id: 'w11', english: 'Mother', transcription: 'МА-ДЕР', russian: 'Мама',
    association: 'МА-ДЕР — МАма ДЕРжит тебя за руку',
    emoji: '👩', example: 'My mother is amazing.', exampleRu: 'Моя мама удивительная.',
    level: 2, topic: 'family'
  },
  {
    id: 'w12', english: 'Father', transcription: 'ФА-ДЕР', russian: 'Папа',
    association: 'ФА-ДЕР — ФАнат ДЕРзкий — это твой папа!',
    emoji: '👨', example: 'My father works hard.', exampleRu: 'Мой папа много работает.',
    level: 2, topic: 'family'
  },
  {
    id: 'w13', english: 'Home', transcription: 'ХОУМ', russian: 'Дом',
    association: 'ХОУМ — ХОмяк живёт дома! ХОУМ = твой хомяк',
    emoji: '🏠', example: 'I am at home.', exampleRu: 'Я дома.',
    level: 2, topic: 'home'
  },
  {
    id: 'w14', english: 'Food', transcription: 'ФУД', russian: 'Еда',
    association: 'ФУД — ФУ! Дали невкусную еду. ФУД = фу, невкусно!',
    emoji: '🍕', example: 'I love good food!', exampleRu: 'Я люблю вкусную еду!',
    level: 2, topic: 'food'
  },
  {
    id: 'w15', english: 'Work', transcription: 'УОРК', russian: 'Работа',
    association: 'УОРК — УВАЖаемая РАБота, скажи "УОРК!"',
    emoji: '💼', example: 'I go to work every day.', exampleRu: 'Я хожу на работу каждый день.',
    level: 2, topic: 'daily'
  },
  // Week 3 — Действия
  {
    id: 'w16', english: 'Go', transcription: 'ГОУ', russian: 'Идти',
    association: 'ГОУ — ГОУ! Команда "ВПЕРЁД!" — GO!',
    emoji: '🚶', example: 'Let\'s go!', exampleRu: 'Пойдём!',
    level: 3, topic: 'verbs'
  },
  {
    id: 'w17', english: 'Eat', transcription: 'ИТ', russian: 'Есть (кушать)',
    association: 'ИТ — как "АЙ ТАЮТ" — суши тают во рту. ИТ — ешь!',
    emoji: '🍽️', example: 'I eat breakfast every morning.', exampleRu: 'Я ем завтрак каждое утро.',
    level: 3, topic: 'verbs'
  },
  {
    id: 'w18', english: 'Sleep', transcription: 'СЛИП', russian: 'Спать',
    association: 'СЛИП — СЛИПается со сна. Скользишь в сон — СЛИП!',
    emoji: '😴', example: 'I sleep 8 hours.', exampleRu: 'Я сплю 8 часов.',
    level: 3, topic: 'verbs'
  },
  {
    id: 'w19', english: 'Love', transcription: 'ЛАВ', russian: 'Любить / Любовь',
    association: 'ЛАВ — ЛАВровый лист в супе — с любовью приготовлено!',
    emoji: '❤️', example: 'I love you!', exampleRu: 'Я тебя люблю!',
    level: 3, topic: 'verbs'
  },
  {
    id: 'w20', english: 'Good', transcription: 'ГУД', russian: 'Хорошо / Хороший',
    association: 'ГУД — "ГУД!" — одобрение. Большой палец вверх!',
    emoji: '👍', example: 'This is very good!', exampleRu: 'Это очень хорошо!',
    level: 3, topic: 'adjectives'
  },
];

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Первые слова',
    subtitle: 'Привет, мир!',
    week: 1, day: 1,
    words: WORDS.filter(w => ['w1','w2','w3','w4','w5'].includes(w.id)),
    introMessage: 'Привет! Я Nova, твой личный тренер. Сегодня мы выучим самые важные слова — те, что открывают любой разговор. Готов? Это будет легко и весело! 🌟'
  },
  {
    id: 'l2',
    title: 'Да, нет, коты',
    subtitle: 'Базовые слова',
    week: 1, day: 2,
    words: WORDS.filter(w => ['w6','w7','w8','w9','w10'].includes(w.id)),
  introMessage: 'Отлично! Ты уже знаешь приветствия! Сегодня учим суперважные слова: ДА, НЕТ и... котиков! Серьёзно, CAT — одно из первых слов, которое знают все. Nova рядом! 🌟'
  },
  {
    id: 'l3',
    title: 'Моя семья',
    subtitle: 'Семья и дом',
    week: 2, day: 1,
    words: WORDS.filter(w => ['w11','w12','w13','w14','w15'].includes(w.id)),
  introMessage: 'Сегодня говорим о самом важном — о доме и семье. Nova подобрала примеры специально для тебя. Эти слова ты будешь использовать каждый день. Погнали! 🌟'
  },
  {
    id: 'l4',
    title: 'Что я делаю',
    subtitle: 'Базовые глаголы',
    week: 3, day: 1,
    words: WORDS.filter(w => ['w16','w17','w18','w19','w20'].includes(w.id)),
  introMessage: 'Время действовать! Сегодня учим глаголы — слова действия. Nova уверена: с ними ты сможешь строить первые фразы о своей жизни! 🌟'
  },
];

export const NOVA_RESPONSES = {
  correct: [
    'Звёздно! 🌟 Именно так!',
    'Nova гордится тобой! ⭐',
    'Ты зажигаешь как звезда! ✨',
    'Браво! Ещё одна звезда на твоей карте! 🌟',
    'Да! Именно! Ты прирождённый полиглот! 🚀',
  ],
  almostCorrect: [
    'Почти! Послушай Nova ещё раз: ',
    'Звёзды не сдаются — правильный ответ: ',
    'Близко! Запомни: ',
    'Попробуй снова! Правильно будет: ',
  ],
  encouragement: [
    'Звёзды не сдаются — и ты не сдавайся! Попробуем ещё раз!',
    'Всё в порядке! Мозг просто сохраняет информацию. Ещё раз!',
    'Это нормально! Даже так ты учишься. Давай попробуем по-другому!',
  ],
  greeting: [
    'Привет! Nova рада видеть тебя! Готов учиться? 🌟',
    'Привет! Nova скучала! Начнём урок?',
    'Привет! Сегодня будет звёздно! 🌟',
  ]
};

/** @deprecated use NOVA_RESPONSES */
export const SPARK_RESPONSES = NOVA_RESPONSES;
