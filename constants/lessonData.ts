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

  // ── Неделя 4: Цвета ──────────────────────────────────────────────
  { id:'w21', english:'Red',    transcription:'РЭД',     russian:'Красный',
    association:'РЭД — как РЕДИСКА — она красная!',
    emoji:'🔴', example:'The apple is red.',      exampleRu:'Яблоко красное.',      level:4, topic:'colors' },
  { id:'w22', english:'Blue',   transcription:'БЛУУ',    russian:'Синий',
    association:'БЛУУ — звук синей волны!',
    emoji:'🔵', example:'The sky is blue.',       exampleRu:'Небо синее.',          level:4, topic:'colors' },
  { id:'w23', english:'Green',  transcription:'ГРИН',    russian:'Зелёный',
    association:'ГРИН — ГРИНасы у лягушки — она зелёная!',
    emoji:'🟢', example:'Grass is green.',        exampleRu:'Трава зелёная.',       level:4, topic:'colors' },
  { id:'w24', english:'Yellow', transcription:'ЕЛ-оу',  russian:'Жёлтый',
    association:'ЕЛ-оу — ЕЛ оладьи — они жёлтые!',
    emoji:'🟡', example:'The sun is yellow.',     exampleRu:'Солнце жёлтое.',       level:4, topic:'colors' },
  { id:'w25', english:'Black',  transcription:'БЛЭК',   russian:'Чёрный',
    association:'БЛЭКаут — чёрная тьма!',
    emoji:'⚫', example:'I have a black cat.',    exampleRu:'У меня чёрный кот.',   level:4, topic:'colors' },

  // ── Неделя 4: Прилагательные ─────────────────────────────────────
  { id:'w26', english:'Big',    transcription:'БИГ',    russian:'Большой',
    association:'БИГ Мак — большой бургер!',
    emoji:'🐘', example:'This is a big city.',   exampleRu:'Это большой город.',    level:4, topic:'adjectives' },
  { id:'w27', english:'Small',  transcription:'СМОЛ',   russian:'Маленький',
    association:'СМОЛка — маленькая капля смолы',
    emoji:'🐭', example:'My dog is small.',      exampleRu:'Моя собака маленькая.', level:4, topic:'adjectives' },
  { id:'w28', english:'Happy',  transcription:'ХЭП-и',  russian:'Счастливый',
    association:'Happy Birthday! Все счастливы!',
    emoji:'😊', example:'I am very happy!',      exampleRu:'Я очень счастлив!',     level:4, topic:'adjectives' },
  { id:'w29', english:'Cold',   transcription:'КОЛД',   russian:'Холодный',
    association:'КОЛД — КОЛДун заморозил воду!',
    emoji:'🧊', example:'The water is cold.',    exampleRu:'Вода холодная.',        level:4, topic:'adjectives' },
  { id:'w30', english:'Hot',    transcription:'ХОТ',    russian:'Горячий',
    association:'ХОТ-дог горячий! ХОТ = горячо',
    emoji:'🔥', example:'The coffee is hot.',    exampleRu:'Кофе горячий.',         level:4, topic:'adjectives' },

  // ── Неделя 5: Еда ────────────────────────────────────────────────
  { id:'w31', english:'Bread',  transcription:'БРЭД',   russian:'Хлеб',
    association:'БРЭД Питт каждый день ест хлеб!',
    emoji:'🍞', example:'I eat bread every morning.', exampleRu:'Я ем хлеб каждое утро.', level:5, topic:'food' },
  { id:'w32', english:'Coffee', transcription:'КО-фи',  russian:'Кофе',
    association:'КОФта согревает как кофе!',
    emoji:'☕', example:'I love morning coffee.', exampleRu:'Я люблю утренний кофе.',    level:5, topic:'food' },
  { id:'w33', english:'Tea',    transcription:'ТИ',     russian:'Чай',
    association:'ТИ — ТИхий вечер с чаем',
    emoji:'🍵', example:'Would you like some tea?', exampleRu:'Хочешь чаю?',           level:5, topic:'food' },
  { id:'w34', english:'Milk',   transcription:'МИЛК',   russian:'Молоко',
    association:'МИЛый Кот любит молоко',
    emoji:'🥛', example:'Milk is very healthy.',  exampleRu:'Молоко очень полезное.',   level:5, topic:'food' },
  { id:'w35', english:'Apple',  transcription:'ЭП-л',   russian:'Яблоко',
    association:'ЭП-л — это Apple! Яблочный телефон 🍎📱',
    emoji:'🍎', example:'I eat an apple every day.', exampleRu:'Я ем яблоко каждый день.', level:5, topic:'food' },

  // ── Неделя 6: Дом ────────────────────────────────────────────────
  { id:'w36', english:'Door',   transcription:'ДОР',    russian:'Дверь',
    association:'ДОРогой гость — открой дверь!',
    emoji:'🚪', example:'Close the door please.',  exampleRu:'Закрой дверь пожалуйста.', level:6, topic:'home' },
  { id:'w37', english:'Window', transcription:'УИН-доу',russian:'Окно',
    association:'Windows! Окно компьютера = окно комнаты',
    emoji:'🪟', example:'Open the window please.',exampleRu:'Открой окно пожалуйста.',  level:6, topic:'home' },
  { id:'w38', english:'Bed',    transcription:'БЭД',    russian:'Кровать',
    association:'BAD (плохо) когда нет кровати!',
    emoji:'🛏️', example:'I go to bed at 11.',      exampleRu:'Я ложусь в 11.',          level:6, topic:'home' },
  { id:'w39', english:'Phone',  transcription:'ФОУН',   russian:'Телефон',
    association:'ФОН телефона всегда красивый!',
    emoji:'📱', example:'My phone is new.',        exampleRu:'Мой телефон новый.',       level:6, topic:'home' },
  { id:'w40', english:'Key',    transcription:'КИ',     russian:'Ключ',
    association:'КИнул ключ и забыл где он!',
    emoji:'🔑', example:'Where is my key?',        exampleRu:'Где мой ключ?',            level:6, topic:'home' },

  // ── Неделя 7: Глаголы ────────────────────────────────────────────
  { id:'w41', english:'Come',   transcription:'КАМ',    russian:'Приходить',
    association:'КАМера включилась — гости пришли!',
    emoji:'🏃', example:'Come here please.',       exampleRu:'Иди сюда пожалуйста.',    level:7, topic:'verbs' },
  { id:'w42', english:'Drink',  transcription:'ДРИНК',  russian:'Пить',
    association:'ДРИНК-дринк — звук наливаемого напитка',
    emoji:'🥤', example:'I drink water every day.',exampleRu:'Я пью воду каждый день.', level:7, topic:'verbs' },
  { id:'w43', english:'Study',  transcription:'СТАД-и', russian:'Учиться',
    association:'СТАДия учёбы — стадия за стадией!',
    emoji:'📚', example:'I study English every day.',exampleRu:'Я учу английский каждый день.', level:7, topic:'verbs' },
  { id:'w44', english:'Listen', transcription:'ЛИС-эн', russian:'Слушать',
    association:'ЛИС в лесу слушает тишину',
    emoji:'👂', example:'Listen to me please.',    exampleRu:'Послушай меня пожалуйста.', level:7, topic:'verbs' },
  { id:'w45', english:'Speak',  transcription:'СПИК',   russian:'Говорить',
    association:'СПИч (речь) — говори!',
    emoji:'🗣️', example:'Do you speak English?',  exampleRu:'Ты говоришь по-английски?', level:7, topic:'verbs' },

  // ── Неделя 8: Город ──────────────────────────────────────────────
  { id:'w46', english:'Car',    transcription:'КАР',    russian:'Машина',
    association:'КАРкает ворона на машине!',
    emoji:'🚗', example:'My car is red.',           exampleRu:'Моя машина красная.',     level:8, topic:'city' },
  { id:'w47', english:'Bus',    transcription:'БАС',    russian:'Автобус',
    association:'БАС-гитарист едет в автобусе!',
    emoji:'🚌', example:'Take the bus to school.', exampleRu:'Езжай на автобусе в школу.', level:8, topic:'city' },
  { id:'w48', english:'Shop',   transcription:'ШОП',    russian:'Магазин',
    association:'ШОПинг! Все идут в магазин',
    emoji:'🛒', example:'I go to the shop.',        exampleRu:'Я иду в магазин.',        level:8, topic:'city' },
  { id:'w49', english:'Park',   transcription:'ПАРК',   russian:'Парк',
    association:'ПАРК — и по-русски ПАРК!',
    emoji:'🌳', example:'Let us walk in the park.',exampleRu:'Давай погуляем в парке.', level:8, topic:'city' },
  { id:'w50', english:'Hotel',  transcription:'ХОУ-тэл',russian:'Гостиница',
    association:'ХОТЕЛ остановиться в отеле!',
    emoji:'🏨', example:'The hotel is very nice.', exampleRu:'Гостиница очень красивая.', level:8, topic:'city' },
];

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    title: 'Первые слова',
    subtitle: 'Привет, мир!',
    week: 1, day: 1,
    words: WORDS.filter(w => w.topic === 'greetings'),
    introMessage: 'Nova говорит: Привет! Сегодня твой первый урок. Выучим слова-приветствия — без них никуда! 👋',
  },
  {
    id: 'l2',
    title: 'Да, нет, коты',
    subtitle: 'Базовые слова',
    week: 1, day: 2,
    words: WORDS.filter(w => w.topic === 'basics'),
    introMessage: 'Nova говорит: Эти слова ты будешь использовать каждый день. Поехали! 🚀',
  },
  {
    id: 'l3',
    title: 'Моя семья',
    subtitle: 'Семья и люди',
    week: 2, day: 1,
    words: WORDS.filter(w => w.topic === 'family'),
    introMessage: 'Nova говорит: Семья — это основа. Научись рассказывать о близких по-английски! 👨‍👩‍👧‍👦',
  },
  {
    id: 'l4',
    title: 'Мир цветов',
    subtitle: 'Цвета вокруг нас',
    week: 4, day: 1,
    words: WORDS.filter(w => w.topic === 'colors'),
    introMessage: 'Nova говорит: Сегодня учим цвета — после урока ты сможешь описать всё вокруг! 🌈',
  },
  {
    id: 'l5',
    title: 'Вкусная еда',
    subtitle: 'Еда и напитки',
    week: 5, day: 1,
    words: WORDS.filter(w => w.topic === 'food'),
    introMessage: 'Nova говорит: Еда объединяет людей! Знание еды по-английски — первый шаг. Погнали! 🍕',
  },
  {
    id: 'l6',
    title: 'Мой дом',
    subtitle: 'Комнаты и предметы',
    week: 6, day: 1,
    words: WORDS.filter(w => w.topic === 'home'),
    introMessage: 'Nova говорит: Дом — это где сердце. Выучим слова о доме — ты используешь их каждый день! 🏠',
  },
  {
    id: 'l7',
    title: 'Действую!',
    subtitle: 'Глаголы жизни',
    week: 7, day: 1,
    words: WORDS.filter(w => w.topic === 'verbs'),
    introMessage: 'Nova говорит: Глаголы — двигатели языка! Без них нельзя говорить. Учим самые нужные! 🚀',
  },
  {
    id: 'l8',
    title: 'Мой город',
    subtitle: 'Транспорт и места',
    week: 8, day: 1,
    words: WORDS.filter(w => w.topic === 'city'),
    introMessage: 'Nova говорит: Английский на улице! Сегодня учим слова для города и транспорта 🚌',
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
