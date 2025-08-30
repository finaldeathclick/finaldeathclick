class Game {
    constructor() {
        this.gameManager = new GameManager();
        this.uiManager = new UIManager();
        this.init();
    }

    init() {
        this.gameManager.loadSave();
        if (this.gameManager.gameState.mode === 'farm') {
            this.loadFarm();
        } else {
            this.loadBoss(this.gameManager.getCurrentBoss());
        }
        this.setupEventListeners();
        this.updateFarmButtonLabel();
    }

    // ===== BOSS MODE (ИЗМЕНЕНО) =====
    loadBoss(boss) {
        this.gameManager.setMode('boss');
        
        // Получаем пути из настроек
        const { backgrounds, bosses, ui } = GAME_SETTINGS.paths;

        // Применяем пути к изображениям
        this.uiManager.elements.background.style.backgroundImage = `url('${backgrounds}${boss.background}')`;
        this.uiManager.elements.bossContainer.innerHTML = this.uiManager.createBossElement(boss, this.gameManager.getDamagePerClick());
        this.uiManager.elements.uiContainer.innerHTML = this.uiManager.createGuideElement(boss);

        const guideImage = document.getElementById('guideImage');
        const bossElement = document.getElementById('boss');
        if (guideImage) guideImage.style.backgroundImage = `url('${ui}путеводитель.png')`;
        if (bossElement) bossElement.style.backgroundImage = `url('${bosses}${boss.image}')`;

        this.setupBossEvents();
        this.uiManager.updateHP(this.gameManager.gameState.bossHp, boss.hp);
        this.updateFarmButtonLabel();
    }

    setupBossEvents() {
        const continueBtn = document.getElementById('continueBtn');
        const boss = document.getElementById('boss');
        if (continueBtn) continueBtn.addEventListener('click', () => this.startBattle());
        if (boss) boss.addEventListener('click', (e) => this.handleBossClick(e));
    }

    startBattle() {
        const guide = document.getElementById('guide');
        const background = this.uiManager.elements.background;
        const boss = document.getElementById('boss');
        const bossHp = document.getElementById('bossHp');
        const clickDamage = document.getElementById('clickDamage');

        if (guide) guide.classList.add('hidden');
        if (background) background.classList.remove('blurred');
        if (clickDamage) {
            clickDamage.classList.add('visible');
            this.uiManager.updateDamagePanel(this.gameManager.getDamagePerClick());
        }

        setTimeout(() => {
            if (boss) boss.classList.add('visible');
            if (bossHp) bossHp.classList.add('visible');
        }, 1000);
    }

    handleBossClick(event) {
        const bossEl = document.getElementById('boss');
        if (bossEl) {
            bossEl.classList.remove('click-anim');
            void bossEl.offsetWidth; // Trigger reflow
            bossEl.classList.add('click-anim');
        }

        if (this.gameManager.gameState.bossHp <= 0) return;
        const boss = this.gameManager.getCurrentBoss();
        const newHp = this.gameManager.damageBoss();
        this.uiManager.showDamageAnimation(event, this.gameManager.getDamagePerClick());
        this.uiManager.updateHP(newHp, boss.hp);

        if (this.gameManager.gameState.bossDefeated) this.defeatBoss();
    }

    defeatBoss() {
        const bossEl = document.getElementById('boss');
        if (bossEl) bossEl.classList.add('dead');
        setTimeout(() => { this.showVictoryMessage(); }, 1000);
    }

    showVictoryMessage() {
        const boss = this.gameManager.getCurrentBoss();

        if (boss.id === 'skeleton') {
            const awarded = this.gameManager.awardSkeletonScrollOnce();
            if (awarded) {
                const bossEl = document.getElementById('boss');
                this.uiManager.showDropText(bossEl, '+1 Свиток');
            }
        }

        const isLastBoss = this.gameManager.isLastBoss();
        this.uiManager.showVictoryMessage(boss, isLastBoss);

        const guide = document.getElementById('guide');
        const background = this.uiManager.elements.background;
        if (guide) guide.classList.remove('hidden');
        if (background) background.classList.add('blurred');

        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) continueBtn.onclick = () => this.nextStage();
    }

    nextStage() {
        if (!this.gameManager.isLastBoss()) {
            this.gameManager.nextBoss();
            this.loadBoss(this.gameManager.getCurrentBoss());
        } else {
            alert("Поздравляем! Вы прошли всех боссов! 🎊");
        }
    }

    // ===== FARM MODE (ИЗМЕНЕНО) =====
    loadFarm() {
        const boss = this.gameManager.getCurrentBoss();
        this.gameManager.setMode('farm');

        // Получаем пути из настроек
        const { backgrounds, ui } = GAME_SETTINGS.paths;

        this.uiManager.elements.background.style.backgroundImage = `url('${backgrounds}${boss.background}')`;
        this.uiManager.elements.uiContainer.innerHTML = '';
        this.uiManager.elements.bossContainer.innerHTML = this.uiManager.createFarmElement();

        const background = this.uiManager.elements.background;
        if (background) background.classList.remove('blurred');

        const chest = document.getElementById('chest');
        if (chest) {
            chest.classList.add('visible');
            // Применяем путь к сундуку
            chest.style.backgroundImage = `url('${ui}Сундук.png')`;

            chest.addEventListener('click', () => {
                chest.classList.remove('click-anim');
                void chest.offsetWidth;
                chest.classList.add('click-anim');

                const dropResult = this.gameManager.tryChestDrop();
                if (dropResult.dropped) {
                    let text = '';
                    if (dropResult.type === 'relic') {
                        text = '+1 ЭссенсияРеликвия';
                    } else if (dropResult.type === 'legendary') {
                        text = '+1 Легендарная Эссенция';
                    } else {
                        text = '+1 Обычная Эссенция';
                    }
                    this.uiManager.showDropText(chest, text);
                    
                    const modal = this.uiManager.elements.inventoryModal;
                    if (modal && modal.classList.contains('visible')) {
                        this.uiManager.renderInventory(this.gameManager.gameState.inventory, this.gameManager.gameState.currentWeapon);
                    }
                }
            });
        }

        this.updateFarmButtonLabel();
    }

    // ===== COMMON UI =====
    updateFarmButtonLabel() {
        const btn = this.uiManager.elements.farmBtn;
        if (!btn) return;
        // Кнопки теперь снова текстовые, как в вашем оригинальном CSS
        btn.textContent = (this.gameManager.gameState.mode === 'farm') ? '⚔️ К бою' : '💰 Фарм';
    }

    setupEventListeners() {
        const {
            inventoryBtn, closeInventory, inventoryModal, inventoryItems,
            farmBtn, settingsBtn, closeSettings, settingsModal
        } = this.uiManager.elements;

        // Inventory
        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => this.openInventory());
        }
        if (closeInventory) {
            closeInventory.addEventListener('click', () => inventoryModal.classList.remove('visible'));
        }
        inventoryModal.addEventListener('click', (e) => {
            if (e.target === inventoryModal) inventoryModal.classList.remove('visible');
        });

        inventoryItems.addEventListener('click', (e) => {
            const target = e.target.closest('.craft-btn');
            if (!target || target.classList.contains('disabled')) return;

            if (target.id === 'craftBtn') {
                if (this.gameManager.upgradeWeapon()) {
                    this.uiManager.updateDamagePanel(this.gameManager.getDamagePerClick());
                    this.openInventory();
                }
            } else if (target.classList.contains('convert-btn')) {
                const type = target.dataset.type;
                let converted = false;
                if (type === 'essence') {
                    converted = this.gameManager.convertEssence();
                } else if (type === 'legendaryEssence') {
                    converted = this.gameManager.convertLegendaryEssence();
                }
                if (converted) {
                    this.openInventory();
                }
            }
        });

        // Farm Button
        if (farmBtn) {
            farmBtn.addEventListener('click', () => {
                if (this.gameManager.gameState.mode === 'farm') {
                    this.loadBoss(this.gameManager.getCurrentBoss());
                } else {
                    this.loadFarm();
                }
            });
        }
        
        // Settings Button
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        if (closeSettings) {
            closeSettings.addEventListener('click', () => settingsModal.classList.remove('visible'));
        }
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) settingsModal.classList.remove('visible');
        });

        document.addEventListener('selectstart', (e) => e.preventDefault());
        document.addEventListener('dragstart', (e) => e.preventDefault());
    }

    openInventory() {
        this.uiManager.renderInventory(this.gameManager.gameState.inventory, this.gameManager.gameState.currentWeapon);
        this.uiManager.elements.inventoryModal.classList.add('visible');
    }

    openSettings() {
        this.uiManager.renderSettings();
        this.uiManager.elements.settingsModal.classList.add('visible');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    window.game = new Game();
});
