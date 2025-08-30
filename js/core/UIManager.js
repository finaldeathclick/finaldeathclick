class UIManager {
    constructor() {
        this.elements = {
            background: document.getElementById('background'),
            bossContainer: document.getElementById('bossContainer'),
            uiContainer: document.getElementById('uiContainer'),
            inventoryBtn: document.getElementById('inventoryBtn'),
            farmBtn: document.getElementById('farmBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            inventoryModal: document.getElementById('inventoryModal'),
            inventoryItems: document.getElementById('inventoryItems'),
            closeInventory: document.getElementById('closeInventory'),
            settingsModal: document.getElementById('settingsModal'),
            settingsInfo: document.getElementById('settingsInfo'),
            closeSettings: document.getElementById('closeSettings')
        };
    }

    /* ================== VIEW TEMPLATES ================== */
    // Остаются без изменений
    createBossElement(boss, fixedDamage) {
        return `
            <div class="boss" id="boss">
                <div class="boss-hp" id="bossHp">
                    <div class="hp-bar">
                        <div class="hp-fill" id="hpFill" style="width:100%"></div>
                    </div>
                    <div class="hp-numbers"><span class="hp-text">HP:</span><span id="hpValue">${boss.hp}</span></div>
                </div>
            </div>
            <div class="click-damage" id="clickDamage">
                Урон: <span id="damageValue">${fixedDamage}</span> за клик
            </div>
        `;
    }

    createGuideElement(boss) {
        return `
            <div class="guide-container" id="guide">
                <div class="guide-image" id="guideImage"></div>
                <div class="guide-speech">
                    <div class="guide-text" id="guideText">${boss.guideText}</div>
                    <button class="continue-btn" id="continueBtn">В бой! ⚔️</button>
                </div>
            </div>
        `;
    }

    createFarmElement() {
        return `
            <div class="chest" id="chest"></div>
            <div class="farm-info visible" id="farmInfo">💎 Фарм лут: шанс на эссенцию за клик</div>
        `;
    }

    /* ================== BATTLE UI ================== */
    // Остаются без изменений
    updateHP(hp, maxHp) {
        const hpValue = document.getElementById('hpValue');
        const hpFill = document.getElementById('hpFill');
        if (hpValue) {
            hpValue.textContent = hp;
            if (hp < maxHp * 0.3) hpValue.style.color = '#ff4444';
            else if (hp < maxHp * 0.7) hpValue.style.color = '#ffa500';
            else hpValue.style.color = '#ff6b6b';
        }
        if (hpFill) {
            const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
            hpFill.style.width = `${pct}%`;
            hpFill.classList.remove('mid', 'low');
            if (pct <= 30) hpFill.classList.add('low');
            else if (pct <= 70) hpFill.classList.add('mid');
        }
    }

    updateDamagePanel(dmg) {
        const dv = document.getElementById('damageValue');
        if (dv) dv.textContent = dmg;
    }

    showDamageAnimation(event, damage) {
        const boss = document.getElementById('boss');
        if (!boss) return;
        const damageText = document.createElement('div');
        damageText.className = 'damage-text';
        damageText.textContent = `-${damage}`;
        const rect = boss.getBoundingClientRect();
        damageText.style.left = `${event.clientX - rect.left}px`;
        damageText.style.top = `${event.clientY - rect.top - 10}px`;
        boss.appendChild(damageText);
        setTimeout(() => damageText.remove(), 1000);
    }

    showDropText(element, text = '+1') {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const drop = document.createElement('div');
        drop.className = 'drop-text';
        drop.textContent = text;
        drop.style.left = `${Math.random() * (rect.width - 60) + 30}px`;
        drop.style.top = `${Math.random() * (rect.height - 60) + 30}px`;
        element.appendChild(drop);
        setTimeout(() => drop.remove(), 1200);
    }

    showVictoryMessage(boss, isLastBoss) {
        const guideText = document.getElementById('guideText');
        const continueBtn = document.getElementById('continueBtn');
        if (guideText && continueBtn) {
            guideText.innerHTML = boss.victoryText;
            continueBtn.textContent = isLastBoss ? "Завершить 🏆" : "Дальше ➡️";
        }
    }

    /* ================== INVENTORY (ИЗМЕНЕНО) ================== */

    renderInventory(inventory, currentWeapon) {
        const container = this.elements.inventoryItems;
        if (!container) return;
        container.innerHTML = '';

        // Получаем путь к предметам из настроек
        const itemPath = GAME_SETTINGS.paths.items;

        const items = [];

        // Меч
        const w = WEAPONS[currentWeapon] || WEAPONS.basic;
        const next = w.next;
        const haveEss = inventory.essence || 0;
        const haveScr = inventory.scroll || 0;
        const haveLegEss = inventory.legendaryEssence || 0;
        const haveRelicScr = inventory.relicScroll || 0;
        const haveRelicEss = inventory.relicEssence || 0;

        let requirementLine = '';
        let canUpgrade = false;
        let actionLabel = next?.label || '';

        if (next) {
            const parts = [];
            const checks = [];
            if (next.need.essence) {
                const need = next.need.essence;
                const ok = haveEss >= need;
                checks.push(ok);
                parts.push(`<span class="req ${ok ? 'ok' : 'miss'}">Требуется: <strong>${need}</strong> × Обычная Эссенция</span>`);
            }
            if (next.need.scroll) {
                const need = next.need.scroll;
                const ok = haveScr >= need;
                checks.push(ok);
                parts.push(`<span class="req ${ok ? 'ok' : 'miss'}">Требуется: <strong>${need}</strong> × Свиток Пробуждения</span>`);
            }
            if (next.need.legendaryEssence) {
                const need = next.need.legendaryEssence;
                const ok = haveLegEss >= need;
                checks.push(ok);
                parts.push(`<span class="req ${ok ? 'ok' : 'miss'}">Требуется: <strong>${need}</strong> × Легендарная Эссенция</span>`);
            }
            if (next.need.relicScroll) {
                const need = next.need.relicScroll;
                const ok = haveRelicScr >= need;
                checks.push(ok);
                parts.push(`<span class="req ${ok ? 'ok' : 'miss'}">Требуется: <strong>${need}</strong> × Свиток Пробуждение Реликвии</span>`);
            }
            if (next.need.relicEssence) {
                const need = next.need.relicEssence;
                const ok = haveRelicEss >= need;
                checks.push(ok);
                parts.push(`<span class="req ${ok ? 'ok' : 'miss'}">Требуется: <strong>${need}</strong> × ЭссенсияРеликвия</span>`);
            }
            canUpgrade = checks.every(c => c);
            requirementLine = parts.join('<br/>');
        }

        items.push({
            key: 'weapon',
            title: w.name,
            desc: `Урон: +${w.damage}`,
            img: w.img,
            requirementLine,
            canUpgrade,
            actionLabel
        });

        // Эссенция
        if (haveEss > 0) {
            items.push({
                key: 'essence',
                title: 'Обычная Эссенция',
                desc: 'Материал для улучшений',
                count: haveEss,
                img: 'ОбычнаяЭссенсия.png',
                canConvert: haveEss >= 10,
                convertLabel: 'Объединить 10 → 1'
            });
        }
        
        if (haveLegEss > 0) {
            items.push({
                key: 'legendaryEssence',
                title: 'Легендарная Эссенция',
                desc: 'Материал для реликтовых улучшений',
                count: haveLegEss,
                img: 'ЛегендарнаяЭссенсия.png',
                canConvert: haveLegEss >= 10,
                convertLabel: 'Объединить 10 → 1'
            });
        }
        
        if (haveRelicEss > 0) {
            items.push({
                key: 'relicEssence',
                title: 'ЭссенсияРеликвия',
                desc: 'Древний материал для могущественных улучшений',
                count: haveRelicEss,
                img: 'ЭссенсияРеликвия.png'
            });
        }

        if (haveScr > 0) {
            items.push({
                key: 'scroll',
                title: 'Свиток Пробуждения',
                desc: 'Пробуждает Редкий меч до Легендарного',
                count: haveScr,
                img: 'СвитокПробуждениеЛегендарногоКлинка.png'
            });
        }

        if (haveRelicScr > 0) {
            items.push({
                key: 'relicScroll',
                title: 'Свиток Пробуждение Реликвии',
                desc: 'Пробуждает Божественный меч до Меча Эпохи Чудес',
                count: haveRelicScr,
                img: 'СвитокПробуждениеРеликвии.png'
            });
        }

        // Рендер
        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'inventory-item';
            el.dataset.key = item.key;

            let actionButton = '';
            if (item.key === 'weapon' && item.actionLabel) {
                actionButton = `<button class="craft-btn ${item.canUpgrade ? '' : 'disabled'}" id="craftBtn">${item.actionLabel}</button>`;
            } else if (item.convertLabel) {
                actionButton = `<button class="craft-btn convert-btn ${item.canConvert ? '' : 'disabled'}" data-type="${item.key}">${item.convertLabel}</button>`;
            }

            // ВАЖНО: Добавляем путь к картинке здесь
            el.innerHTML = `
                <img src="${itemPath}${item.img}" alt="${item.title}" class="item-image" />
                <div class="item-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                    ${item.requirementLine || ''}
                    ${actionButton}
                </div>
                ${item.count ? `<span class="item-count">${item.count}</span>` : ''}
            `;
            container.appendChild(el);
        });
    }

    /* ================== SETTINGS ================== */
    renderSettings() {
        const container = this.elements.settingsInfo;
        if (!container) return;

        container.innerHTML = `
            <p><strong>Версия игры:</strong> ${GAME_SETTINGS.gameVersion}</p>
            <p>
                <strong>Telegram-канал:</strong> 
                <a href="${GAME_SETTINGS.telegramChannel}" target="_blank" rel="noopener noreferrer">
                    ${GAME_SETTINGS.telegramChannel.replace('https://t.me/', '@')}
                </a>
            </p>
        `;
    }
}
