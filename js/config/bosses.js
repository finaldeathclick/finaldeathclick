const BOSSES = {
    slime: {
        id: 'slime',
        name: 'Слизень',
        hp: 1000,
        image: 'босс1.PNG',
        background: 'фон2.PNG',
        guideText: 'Привет, Путешественник! Это твой первый бой. Убей этого Слайма, чтобы продвинуться дальше!'
    },
    goblin: {
        id: 'goblin',
        name: 'Гоблин',
        hp: 10000,
        image: 'босс2.PNG',
        background: 'фон2.PNG',
        guideText: 'Отличная работа! Теперь ты столкнулся с Скелетом. Будь осторожен, он сильнее!'
    },
    skeleton: {
        id: 'skeleton',
        name: 'Скелет',
        hp: 100000,
        image: 'босс3.PNG',
        background: 'фон2.PNG',
        guideText: 'Королева пауков... Она очень... Одолей её, чтобы получить ценный предмет для улучшения!'
    },
    spider: {
        id: 'spider',
        name: 'Гигантский Паук',
        hp: 1000000,
        image: 'босс4.PNG',
        background: 'фон2.PNG',
        guideText: 'Будь начеку, Путешественник! Некромант не оставит шансов слабым. Покажи ему свою силу!'
    },
    orc: {
        id: 'orc',
        name: 'Свирепый Орк',
        hp: 10000000,
        image: 'босс5.PNG',
        background: 'фон2.PNG',
        guideText: 'Темный Рыцарь! Его удары сокрушительны. Тебе понадобится вся твоя мощь, чтобы победить его.'
    },
    ancientTitan: {
        id: 'ancientTitan',
        name: 'Древний Титан',
        hp: 10000000,
        image: 'босс6.PNG',
        background: 'фон2.PNG',
        guideText: 'Перед тобой Демон! Победи его, чтобы получить Свиток Пробуждения Реликвии!',
        victoryText: 'Демон! Ты получил Свиток Пробуждения Реликвии. Теперь твой меч может стать ещё могущественнее!'
    },
    relicGuardian: {
        id: 'relicGuardian',
        name: 'Хранитель Реликвии',
        hp: 100000000,
        image: 'босс7.PNG',
        background: 'фон2.PNG',
        guideText: 'Приготовься к битве с Бадшим Ангелом! Его сила поистине легендарна. Одолей его, чтобы получить Свиток Эпохи Чудес!',
        victoryText: 'Хранитель Реликвии пал! Свиток Эпохи Чудес теперь твой! Используй его мудро.'
    },
    darkDragon: {
        id: 'darkDragon',
        name: 'Темный Дракон',
        hp: 10000000000000,
        image: 'босс8.PNG',
        background: 'фон2.PNG',
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