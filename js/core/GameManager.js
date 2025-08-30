// === Оружие и прогрессия ===
// (Код WEAPONS остается без изменений, поэтому я его скрою для краткости)
const WEAPONS = {
    basic: {
        id: 'basic',
        name: 'Обычный Меч',
        damage: 10,
        img: 'ОбычныйМеч.png',
        next: {
            id: 'uncommon',
            label: 'Синтезировать',
            need: { essence: 2 },
            needText: 'Требуется: 2 × Обычная Эссенция'
        }
    },
    uncommon: {
        id: 'uncommon',
        name: 'Необычный Меч',
        damage: 20,
        img: 'НеобычныйМеч.png',
        next: {
            id: 'rare',
            label: 'Синтезировать',
            need: { essence: 5 },
            needText: 'Требуется: 5 × Обычная Эссенция'
        }
    },
    rare: {
        id: 'rare',
        name: 'Редкий Меч',
        damage: 30,
        img: 'РедкийМеч.png',
        next: {
            id: 'legendary',
            label: 'Пробудить',
            need: { scroll: 1 },
            needText: 'Требуется: 1 × Свиток Пробуждения Легендарного Клинка'
        }
    },
    legendary: {
        id: 'legendary',
        name: 'Легендарный Меч',
        damage: 100,
        img: 'ЛегендарныйМеч.png',
        next: {
            id: 'relic',
            label: 'Улучшить',
            need: { legendaryEssence: 20 },
            needText: 'Требуется: 20 × Легендарная Эссенция'
        }
    },
    relic: {
        id: 'relic',
        name: 'Реликтовый Меч',
        damage: 200,
        img: 'РеликвияМеч.png',
        next: {
            id: 'mythic',
            label: 'Улучшить',
            need: { legendaryEssence: 30 },
            needText: 'Требуется: 30 × Легендарная Эссенция'
        }
    },
    mythic: {
        id: 'mythic',
        name: 'Мифический Меч',
        damage: 1000,
        img: 'МифическийМеч.png',
        next: {
            id: 'divine',
            label: 'Улучшить',
            need: { legendaryEssence: 50 },
            needText: 'Требуется: 50 × Легендарная Эссенция'
        }
    },
    divine: {
        id: 'divine',
        name: 'Божественный Меч',
        damage: 4500,
        img: 'БожественныйМеч.png',
        next: {
            id: 'epochal',
            label: 'Пробудить',
            need: { relicScroll: 1 },
            needText: 'Требуется: 1 × Свиток Пробуждение Реликвии'
        }
    },
    epochal: {
        id: 'epochal',
        name: 'Меч Эпохи Чудес',
        damage: 10000,
        img: 'МечЭпохиЧудес.png',
        next: {
            id: 'fable',
            label: 'Сотворить',
            need: { relicEssence: 100, epochalScroll: 1 },
            needText: 'Требуется: 100 × ЭссенсияРеликвия, 1 × Свиток Эпохи Чудес'
        }
    },
    fable: {
        id: 'fable',
        name: 'Меч Эпохи Сказаний',
        damage: 25000,
        img: 'МечЭпохиСказаний.png',
        next: null
    }
};

class GameManager {
    constructor() {
        this.gameState = {
            currentBoss: BOSS_ORDER[0],
            bossHp: BOSSES[BOSS_ORDER[0]].hp,
            bossDefeated: false,
            mode: 'boss', // 'boss' | 'farm'
            currentWeapon: 'basic',
            inventory: {
                essence: 0,
                scroll: 0,
                legendaryEssence: 0,
                relicScroll: 0,
                relicEssence: 0,
                epochalScroll: 0
            },
            flags: {
                skeletonScrollAwarded: false,
                relicScrollAwarded: false,
                epochalScrollAwarded: false
            }
        };
    }

    loadSave() {
        const save = localStorage.getItem('clickerGameSave');
        if (save) {
            const parsed = JSON.parse(save);
            this.gameState = {
                ...this.gameState,
                ...parsed,
                inventory: { ...this.gameState.inventory, ...(parsed.inventory || {}) },
                flags: { ...this.gameState.flags, ...(parsed.flags || {}) }
            };
        }
    }

    saveGame() {
        localStorage.setItem('clickerGameSave', JSON.stringify(this.gameState));
    }

    // Функция resetGame() удалена

    getCurrentBoss() { return BOSSES[this.gameState.currentBoss]; }

    getDamagePerClick() {
        const w = WEAPONS[this.gameState.currentWeapon] || WEAPONS.basic;
        return w.damage;
    }

    damageBoss() {
        const dmg = this.getDamagePerClick();
        this.gameState.bossHp = Math.max(0, this.gameState.bossHp - dmg);
        if (this.gameState.bossHp <= 0) this.gameState.bossDefeated = true;
        this.saveGame();
        return this.gameState.bossHp;
    }

    nextBoss() {
        const i = BOSS_ORDER.indexOf(this.gameState.currentBoss);
        if (i < BOSS_ORDER.length - 1) {
            this.gameState.currentBoss = BOSS_ORDER[i + 1];
            this.gameState.bossHp = BOSSES[this.gameState.currentBoss].hp;
            this.gameState.bossDefeated = false;
        }

        if (this.gameState.currentBoss === 'ancientTitan' && !this.gameState.flags.relicScrollAwarded) {
            this.awardRelicScrollOnce();
        }

        if (this.gameState.currentBoss === 'relicGuardian' && !this.gameState.flags.epochalScrollAwarded) {
            this.awardEpochalScrollOnce();
        }

        this.saveGame();
    }

    isLastBoss() { return this.gameState.currentBoss === BOSS_ORDER[BOSS_ORDER.length - 1]; }
    setMode(mode) { this.gameState.mode = mode; this.saveGame(); }

    tryChestDrop() {
        const rand = Math.random();
        
        if (rand < 0.92) {
            this.gameState.inventory.relicEssence = (this.gameState.inventory.relicEssence || 0) + 1;
            this.saveGame();
            return { dropped: true, type: 'relic' };
        } else if (rand < 0.22) {
            this.gameState.inventory.legendaryEssence = (this.gameState.inventory.legendaryEssence || 0) + 1;
            this.saveGame();
            return { dropped: true, type: 'legendary' };
        } else if (rand < 0.42) {
            this.gameState.inventory.essence = (this.gameState.inventory.essence || 0) + 1;
            this.saveGame();
            return { dropped: true, type: 'basic' };
        }
        
        return { dropped: false };
    }

    awardSkeletonScrollOnce() {
        if (!this.gameState.flags.skeletonScrollAwarded) {
            this.gameState.inventory.scroll = (this.gameState.inventory.scroll || 0) + 1;
            this.gameState.flags.skeletonScrollAwarded = true;
            this.saveGame();
            return true;
        }
        return false;
    }

    awardRelicScrollOnce() {
        if (!this.gameState.flags.relicScrollAwarded) {
            this.gameState.inventory.relicScroll = (this.gameState.inventory.relicScroll || 0) + 1;
            this.gameState.flags.relicScrollAwarded = true;
            this.saveGame();
            return true;
        }
        return false;
    }

    awardEpochalScrollOnce() {
        if (!this.gameState.flags.epochalScrollAwarded) {
            this.gameState.inventory.epochalScroll = (this.gameState.inventory.epochalScroll || 0) + 1;
            this.gameState.flags.epochalScrollAwarded = true;
            this.saveGame();
            return true;
        }
        return false;
    }

    canUpgradeCurrentWeapon() {
        const cur = WEAPONS[this.gameState.currentWeapon];
        if (!cur.next) return { can: false, next: null, need: null };
        const need = cur.next.need || {};
        const haveEss = this.gameState.inventory.essence || 0;
        const haveScr = this.gameState.inventory.scroll || 0;
        const haveLegEss = this.gameState.inventory.legendaryEssence || 0;
        const haveRelicScr = this.gameState.inventory.relicScroll || 0;
        const haveRelicEss = this.gameState.inventory.relicEssence || 0;
        const haveEpochalScr = this.gameState.inventory.epochalScroll || 0;

        const okEss = need.essence ? haveEss >= need.essence : true;
        const okScr = need.scroll ? haveScr >= need.scroll : true;
        const okLegEss = need.legendaryEssence ? haveLegEss >= need.legendaryEssence : true;
        const okRelicScr = need.relicScroll ? haveRelicScr >= need.relicScroll : true;
        const okRelicEss = need.relicEssence ? haveRelicEss >= need.relicEssence : true;
        const okEpochalScr = need.epochalScroll ? haveEpochalScr >= need.epochalScroll : true;

        return {
            can: okEss && okScr && okLegEss && okRelicScr && okRelicEss && okEpochalScr,
            next: cur.next,
            need
        };
    }

    upgradeWeapon() {
        const cur = WEAPONS[this.gameState.currentWeapon];
        if (!cur.next) return false;
        const need = cur.next.need || {};
        const have = this.canUpgradeCurrentWeapon();
        if (!have.can) return false;

        if (need.essence) this.gameState.inventory.essence -= need.essence;
        if (need.scroll) this.gameState.inventory.scroll -= need.scroll;
        if (need.legendaryEssence) this.gameState.inventory.legendaryEssence -= need.legendaryEssence;
        if (need.relicScroll) this.gameState.inventory.relicScroll -= need.relicScroll;
        if (need.relicEssence) this.gameState.inventory.relicEssence -= need.relicEssence;
        if (need.epochalScroll) this.gameState.inventory.epochalScroll -= need.epochalScroll;

        this.gameState.currentWeapon = cur.next.id;
        this.saveGame();
        return true;
    }

    convertEssence() {
        if (this.gameState.inventory.essence >= 10) {
            this.gameState.inventory.essence -= 10;
            this.gameState.inventory.legendaryEssence = (this.gameState.inventory.legendaryEssence || 0) + 1;
            this.saveGame();
            return true;
        }
        return false;
    }

    convertLegendaryEssence() {
        if (this.gameState.inventory.legendaryEssence >= 10) {
            this.gameState.inventory.legendaryEssence -= 10;
            this.gameState.inventory.relicEssence = (this.gameState.inventory.relicEssence || 0) + 1;
            this.saveGame();
            return true;
        }
        return false;
    }
}
