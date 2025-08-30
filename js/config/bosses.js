const BOSSES = {
    slime: {
        id: 'slime',
        name: 'Слизень',
        hp: 1000,
        image: 'босс1.png',
        background: 'фон2.png',
        guideText: 'Привет, Путешественник! Это твой первый бой. Убей этого Слайма, чтобы продвинуться дальше!'
    },
    goblin: {
        id: 'goblin',
        name: 'Гоблин',
        hp: 10000,
        image: 'босс2.png',
        background: 'фон2.png',
        guideText: 'Отличная работа! Теперь ты столкнулся с Скелетом. Будь осторожен, он сильнее!'
    },
    skeleton: {
        id: 'skeleton',
        name: 'Скелет',
        hp: 100000,
        image: 'босс3.png',
        background: 'фон2.png',
        guideText: 'Королева пауков... Она очень... Одолей её, чтобы получить ценный предмет для улучшения!'
    },
    spider: {
        id: 'spider',
        name: 'Гигантский Паук',
        hp: 1000000,
        image: 'босс4.png',
        background: 'фон2.png',
        guideText: 'Будь начеку, Путешественник! Некромант не оставит шансов слабым. Покажи ему свою силу!'
    },
    orc: {
        id: 'orc',
        name: 'Свирепый Орк',
        hp: 10000000,
        image: 'босс5.png',
        background: 'фон2.png',
        guideText: 'Темный Рыцарь! Его удары сокрушительны. Тебе понадобится вся твоя мощь, чтобы победить его.'
    },
    ancientTitan: {
        id: 'ancientTitan',
        name: 'Древний Титан',
        hp: 10000000,
        image: 'босс6.png',
        background: 'фон2.png',
        guideText: 'Перед тобой Демон! Победи его, чтобы получить Свиток Пробуждения Реликвии!',
        victoryText: 'Демон! Ты получил Свиток Пробуждения Реликвии. Теперь твой меч может стать ещё могущественнее!'
    },
    relicGuardian: {
        id: 'relicGuardian',
        name: 'Хранитель Реликвии',
        hp: 100000000,
        image: 'босс7.png',
        background: 'фон2.png',
        guideText: 'Приготовься к битве с Бадшим Ангелом! Его сила поистине легендарна. Одолей его, чтобы получить Свиток Эпохи Чудес!',
        victoryText: 'Хранитель Реликвии пал! Свиток Эпохи Чудес теперь твой! Используй его мудро.'
    },
    darkDragon: {
        id: 'darkDragon',
        name: 'Темный Дракон',
        hp: 10000000000000,
        image: 'босс8.png',
        background: 'фон2.png',
        guideText: 'Самый могущественный враг! Темный Дракон ждет тебя. Только сильнейшие смогут его победить. Удачи!'
    }
};

const BOSS_ORDER = [
    'slime',
    'goblin',
    'skeleton',
    'spider',
    'orc',
    'ancientTitan',
    'relicGuardian',
    'darkDragon'
];
