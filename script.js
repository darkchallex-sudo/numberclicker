(function () {
    "use strict";

    var SAVE_KEY = "number-clicker-engine-v3";
    var TOTAL_ACHIEVEMENTS = 120;

    var NUMBER_MILESTONES = [
        1, 2, 3, 5, 7, 10, 15, 20, 30, 40,
        50, 75, 100, 150, 200, 300, 400, 500, 750, 1000,
        1500, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 30000,
        40000, 50000, 75000, 100000, 150000, 200000, 300000, 400000, 500000, 750000,
        1000000, 1500000, 2000000, 3000000, 4000000, 5000000, 7500000, 10000000, 15000000, 20000000,
        30000000, 40000000, 50000000, 75000000, 100000000, 150000000, 200000000, 300000000, 400000000, 500000000,
        750000000, 1000000000, 1500000000, 2000000000, 3000000000, 4000000000, 5000000000
    ];

    var CLICK_MILESTONES = [
        1, 2, 3, 5, 7, 10, 15, 20, 30, 40,
        50, 75, 100, 150, 200, 300, 500, 750, 1000, 1500,
        2000, 3000, 5000, 7500, 10000, 15000, 20000, 30000, 40000, 50000,
        75000, 100000, 150000, 200000, 300000, 500000, 750000, 1000000, 2000000, 5000000,
        10000000, 25000000, 50000000
    ];

    var COINS_PER_CLICK_BLOCK = 150;
    var CLICKS_PER_COIN_BLOCK = 10;
    var FIVE_MINUTES_MS = 5 * 60 * 1000;
    var ONE_MINUTE_MS = 60 * 1000;
    var TEN_MINUTES_MS = 10 * 60 * 1000;
    var FIND_COUNT = 5000;
    var MIN_FIND_ROLL = 10000;
    var MAX_FIND_ROLL = 5000000000;

    var BOOSTERS = [
        {
            id: "pocket-charm",
            name: "Pocket Charm",
            cost: 25,
            luck: 15,
            durationClicks: 25,
            singleUse: false,
            permanent: false,
            unlockRolls: 0,
            maxPurchases: 999999,
            description: "A cheap charm that adds +15 luck for 25 clicks."
        },
        {
            id: "glass-potion",
            name: "Glass Potion",
            cost: 250,
            luck: 120,
            durationClicks: 80,
            singleUse: false,
            permanent: false,
            unlockRolls: 30,
            maxPurchases: 999999,
            description: "Adds +120 luck for 80 clicks."
        },
        {
            id: "comet-elixir",
            name: "Comet Elixir",
            cost: 2500,
            luck: 1200,
            durationClicks: 200,
            singleUse: false,
            permanent: false,
            unlockRolls: 120,
            maxPurchases: 999999,
            description: "Adds +1,200 luck for 200 clicks."
        },
        {
            id: "lucky-coin",
            name: "Lucky Coin",
            cost: 777,
            luck: 50,
            durationClicks: 0,
            singleUse: false,
            permanent: true,
            unlockRolls: 60,
            maxPurchases: 1,
            description: "A permanent relic that grants +50 luck forever."
        },
        {
            id: "storm-serum",
            name: "Storm Serum",
            cost: 5500,
            luck: 3200,
            durationClicks: 120,
            singleUse: false,
            permanent: false,
            unlockRolls: 300,
            maxPurchases: 999999,
            description: "Adds +3,200 luck for 120 clicks."
        },
        {
            id: "crown-draught",
            name: "Crown Draught",
            cost: 12000,
            luck: 8000,
            durationClicks: 60,
            singleUse: false,
            permanent: false,
            unlockRolls: 900,
            maxPurchases: 999999,
            description: "Adds +8,000 luck for 60 clicks."
        },
        {
            id: "void-tonic",
            name: "Void Tonic",
            cost: 10000,
            luck: 10000,
            durationClicks: 1,
            singleUse: true,
            permanent: false,
            unlockRolls: 1500,
            maxPurchases: 1,
            description: "Adds +10,000 luck for 1 click only. Single-use for the whole save."
        },
        {
            id: "zenith-tonic",
            name: "Zenith Tonic",
            cost: 28000,
            luck: 18000,
            durationClicks: 3,
            singleUse: false,
            permanent: false,
            unlockRolls: 3000,
            maxPurchases: 999999,
            description: "Adds +18,000 luck for 3 clicks."
        }
    ];

    var CUTSCENE_MILESTONES = [
        { value: 10000, title: "Neon Surge", subtitle: "The screen bends for the first real threshold." },
        { value: 50000, title: "Sky Splitter", subtitle: "Color pressure starts tearing through the calm." },
        { value: 100000, title: "Velocity Crown", subtitle: "Your clicks stop feeling local." },
        { value: 500000, title: "Solar Tremor", subtitle: "The atmosphere gives up and starts glowing." },
        { value: 1000000, title: "Radiant Collapse", subtitle: "A million numbers is enough to distort the room." },
        { value: 5000000, title: "Prism Rift", subtitle: "Everything picks a brighter color and stays there." },
        { value: 10000000, title: "Aurora Engine", subtitle: "The game finally looks like it knows your name." },
        { value: 50000000, title: "Celestial Overdrive", subtitle: "This is no longer a button. It is an event." },
        { value: 100000000, title: "Chromatic Tempest", subtitle: "Pure saturation. Pure noise. Pure momentum." },
        { value: 500000000, title: "Thunder Bloom", subtitle: "The cutscene has stopped asking for permission." },
        { value: 1000000000, title: "Apex Corona", subtitle: "You reached the billion line and the world noticed." },
        { value: 5000000000, title: "Absolute Zenith", subtitle: "This is the top end of the cutscene ladder." }
    ];

    var NUMBER_NAMES = [
        "First Spark", "Second Pulse", "Third Signal", "Palm Static", "Small Voltage",
        "Double Digits", "Thin Current", "Warm Circuit", "Minor Echo", "Forty Below",
        "Fifty Flicker", "Quarter Glow", "Triple Digit", "Pressure Rise", "Glass Tap",
        "Three Hundred Shiver", "Static Chorus", "Half Charge", "Seven Fifty", "First Thousand",
        "Thicker Air", "Binary Halo", "Three K Storm", "Fourth Chamber", "Five K Heat",
        "Tension Build", "Ten K Break", "Fifteen K Lumen", "Twenty K Burn", "Thirty K Flame",
        "Forty K Orbit", "Fifty K Rush", "Seventy Five K Flash", "Hundred K Strike", "Hundred Fifty K Crown",
        "Two Hundred K Surge", "Three Hundred K Scream", "Four Hundred K Ray", "Half Million Heartbeat", "Seven Fifty K Spin",
        "Million Wake", "One Point Five Million", "Two Million Bloom", "Three Million Prism", "Four Million Vibe",
        "Five Million Roar", "Seven Point Five Million", "Ten Million Rift", "Fifteen Million Signal", "Twenty Million Overcast",
        "Thirty Million Voltage", "Forty Million Fever", "Fifty Million Shatter", "Seventy Five Million Choir", "Hundred Million Apex",
        "Hundred Fifty Million Arc", "Two Hundred Million Furnace", "Three Hundred Million Blade", "Four Hundred Million Crownfire", "Half Billion Pulse",
        "Seven Fifty Million Nova", "Billion Arrival", "One Point Five Billion", "Two Billion Horizon", "Three Billion Avalanche",
        "Four Billion Ascension", "Five Billion Zenith"
    ];

    var CLICK_NAMES = [
        "Tap One", "Tap Two", "Tap Three", "Tap Five", "Tap Seven",
        "Ten Fingers", "Fifteen Sparks", "Twenty Beats", "Thirty Hands", "Forty Rhythm",
        "Fifty Motion", "Seventy Five Tempo", "Hundred Habit", "Hundred Fifty Grind", "Two Hundred Resolve",
        "Three Hundred Intent", "Five Hundred Focus", "Seven Fifty Repeat", "One Thousand Taps", "One Point Five Thousand",
        "Two Thousand March", "Three Thousand Strikes", "Five Thousand Habit", "Seven Point Five Thousand", "Ten Thousand Tension",
        "Fifteen Thousand Echo", "Twenty Thousand Engine", "Thirty Thousand Recoil", "Forty Thousand Flicks", "Fifty Thousand Ritual",
        "Seventy Five Thousand", "Hundred Thousand Drum", "Hundred Fifty Thousand", "Two Hundred Thousand", "Three Hundred Thousand",
        "Half Million Grip", "Seven Fifty Thousand", "Million Motion", "Two Million Cadence", "Five Million Trance",
        "Ten Million Force", "Twenty Five Million Fury", "Fifty Million Myth"
    ];

    var RARE_ACHIEVEMENTS = [
        {
            id: "rare-coin-desperation",
            name: "Coin Desperation",
            description: "Reach 100 coins within 5 minutes.",
            unlockedBy: function (state) {
                return state.coins >= 100 && state.sessionStartAt > 0 && Date.now() - state.sessionStartAt <= FIVE_MINUTES_MS;
            }
        },
        {
            id: "rare-dry-miracle",
            name: "Dry Miracle",
            description: "Roll 9,999 or higher with no active booster.",
            unlockedBy: function (state) {
                return state.bestBaseRoll >= 9999;
            }
        },
        {
            id: "rare-speed-finger",
            name: "Speed Finger",
            description: "Reach 1,000 clicks within 10 minutes.",
            unlockedBy: function (state) {
                return state.totalClicks >= 1000 && state.sessionStartAt > 0 && Date.now() - state.sessionStartAt <= TEN_MINUTES_MS;
            }
        },
        {
            id: "rare-triple-nine",
            name: "Triple Nine",
            description: "Hit 3 rolls of 9,000 or higher within 60 seconds.",
            unlockedBy: function (state) {
                return state.highRollStreakWindow >= 3;
            }
        },
        {
            id: "rare-vault-breaker",
            name: "Vault Breaker",
            description: "Spend 10,000 coins on boosters in one save.",
            unlockedBy: function (state) {
                return state.totalCoinsSpent >= 10000;
            }
        },
        {
            id: "rare-backpack-loyalist",
            name: "Backpack Loyalist",
            description: "Buy 25 boosters in one save.",
            unlockedBy: function (state) {
                return state.totalBoostersBought >= 25;
            }
        },
        {
            id: "rare-one-shot-prophet",
            name: "One Shot Prophet",
            description: "Use the Void Tonic and hit a 10,000+ roll with its single click.",
            unlockedBy: function (state) {
                return state.voidTonicSuccess;
            }
        },
        {
            id: "rare-cutscene-chain",
            name: "Cutscene Chain",
            description: "Trigger 3 cutscenes within 30 seconds.",
            unlockedBy: function (state) {
                return state.cutsceneChainCount >= 3;
            }
        },
        {
            id: "rare-penny-lord",
            name: "Penny Lord",
            description: "Hold 500 coins at once.",
            unlockedBy: function (state) {
                return state.coins >= 500;
            }
        },
        {
            id: "rare-lucky-pocket",
            name: "Lucky Pocket",
            description: "Reach 1,000 total luck from temporary boosters.",
            unlockedBy: function (state) {
                return state.highestTemporaryLuck >= 1000;
            }
        }
    ];

    var FIND_PREFIXES = ["Ashen", "Solar", "Velvet", "Crimson", "Abyssal", "Lucid", "Glass", "Storm", "Ivory", "Neon", "Obsidian", "Radiant", "Silent", "Royal", "Vanta", "Echo", "Golden", "Feral", "Celestial", "Broken"];
    var FIND_CORES = ["Crown", "Shard", "Engine", "Halo", "Rift", "Comet", "Sigil", "Vault", "Prism", "Orbit", "Relic", "Heart", "Throne", "Beacon", "Wheel", "Circuit", "Mask", "Blade", "Bloom", "Archive"];
    var FIND_SUFFIXES = ["of Dawn", "of Hush", "of Static", "of Night", "of Chance", "of Ruin", "of Kings", "of Glass", "of Sparks", "of Gravity", "of Echoes", "of Fortune", "of Zenith", "of Dust", "of Storms", "of Silence", "of Fire", "of Rain", "of the Rift", "of the Vale"];
    var FIND_CATALOG = createFindCatalog();

    function safeFormatNumber(value) {
        try {
            return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.floor(value));
        } catch (error) {
            return String(Math.floor(value));
        }
    }

    function createDefaultState() {
        return {
            number: 0,
            totalClicks: 0,
            clickPower: 1,
            backgroundHue: 210,
            coins: 0,
            permanentLuck: 0,
            lastRoll: 0,
            bestRoll: 0,
            bestBaseRoll: 0,
            totalRolls: 0,
            latestFindId: "",
            bestFindId: "",
            activeBoostId: "",
            activeLuck: 0,
            activeBoostRemaining: 0,
            sessionStartAt: 0,
            recentHighRollTimestamps: [],
            highRollStreakWindow: 0,
            totalCoinsSpent: 0,
            totalBoostersBought: 0,
            voidTonicSuccess: false,
            recentCutsceneTimestamps: [],
            cutsceneChainCount: 0,
            highestTemporaryLuck: 0,
            unlockedAchievements: [],
            seenCutscenes: [],
            ownedBoosters: {},
            usedSingleUseBoosters: {}
        };
    }

    function StorageAdapter(key) {
        this.key = key;
    }

    StorageAdapter.prototype.getStorage = function () {
        try {
            return window.localStorage;
        } catch (error) {
            return null;
        }
    };

    StorageAdapter.prototype.load = function () {
        var fallback = createDefaultState();
        var storage = this.getStorage();
        if (!storage) {
            return fallback;
        }

        try {
            var raw = storage.getItem(this.key);
            if (!raw) {
                return fallback;
            }

            var parsed = JSON.parse(raw);
            return {
                number: typeof parsed.number === "number" ? parsed.number : fallback.number,
                totalClicks: typeof parsed.totalClicks === "number" ? parsed.totalClicks : fallback.totalClicks,
                clickPower: typeof parsed.clickPower === "number" ? parsed.clickPower : fallback.clickPower,
                backgroundHue: typeof parsed.backgroundHue === "number" ? parsed.backgroundHue : fallback.backgroundHue,
                coins: typeof parsed.coins === "number" ? parsed.coins : fallback.coins,
                permanentLuck: typeof parsed.permanentLuck === "number" ? parsed.permanentLuck : fallback.permanentLuck,
                lastRoll: typeof parsed.lastRoll === "number" ? parsed.lastRoll : fallback.lastRoll,
                bestRoll: typeof parsed.bestRoll === "number" ? parsed.bestRoll : fallback.bestRoll,
                bestBaseRoll: typeof parsed.bestBaseRoll === "number" ? parsed.bestBaseRoll : fallback.bestBaseRoll,
                totalRolls: typeof parsed.totalRolls === "number" ? parsed.totalRolls : fallback.totalRolls,
                latestFindId: typeof parsed.latestFindId === "string" ? parsed.latestFindId : fallback.latestFindId,
                bestFindId: typeof parsed.bestFindId === "string" ? parsed.bestFindId : fallback.bestFindId,
                activeBoostId: typeof parsed.activeBoostId === "string" ? parsed.activeBoostId : fallback.activeBoostId,
                activeLuck: typeof parsed.activeLuck === "number" ? parsed.activeLuck : fallback.activeLuck,
                activeBoostRemaining: typeof parsed.activeBoostRemaining === "number" ? parsed.activeBoostRemaining : fallback.activeBoostRemaining,
                sessionStartAt: typeof parsed.sessionStartAt === "number" ? parsed.sessionStartAt : fallback.sessionStartAt,
                recentHighRollTimestamps: Array.isArray(parsed.recentHighRollTimestamps) ? parsed.recentHighRollTimestamps : [],
                highRollStreakWindow: typeof parsed.highRollStreakWindow === "number" ? parsed.highRollStreakWindow : fallback.highRollStreakWindow,
                totalCoinsSpent: typeof parsed.totalCoinsSpent === "number" ? parsed.totalCoinsSpent : fallback.totalCoinsSpent,
                totalBoostersBought: typeof parsed.totalBoostersBought === "number" ? parsed.totalBoostersBought : fallback.totalBoostersBought,
                voidTonicSuccess: !!parsed.voidTonicSuccess,
                recentCutsceneTimestamps: Array.isArray(parsed.recentCutsceneTimestamps) ? parsed.recentCutsceneTimestamps : [],
                cutsceneChainCount: typeof parsed.cutsceneChainCount === "number" ? parsed.cutsceneChainCount : fallback.cutsceneChainCount,
                highestTemporaryLuck: typeof parsed.highestTemporaryLuck === "number" ? parsed.highestTemporaryLuck : fallback.highestTemporaryLuck,
                unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
                seenCutscenes: Array.isArray(parsed.seenCutscenes) ? parsed.seenCutscenes : [],
                ownedBoosters: parsed.ownedBoosters && typeof parsed.ownedBoosters === "object" ? parsed.ownedBoosters : {},
                usedSingleUseBoosters: parsed.usedSingleUseBoosters && typeof parsed.usedSingleUseBoosters === "object" ? parsed.usedSingleUseBoosters : {}
            };
        } catch (error) {
            return fallback;
        }
    };

    StorageAdapter.prototype.save = function (state) {
        var storage = this.getStorage();
        if (!storage) {
            return false;
        }

        try {
            storage.setItem(this.key, JSON.stringify(state));
            return true;
        } catch (error) {
            return false;
        }
    };

    function AchievementCatalog() {
        this.items = [];
        this.build();
    }

    AchievementCatalog.prototype.build = function () {
        var index;

        for (index = 0; index < NUMBER_MILESTONES.length; index += 1) {
            this.items.push({
                id: "number-" + NUMBER_MILESTONES[index],
                name: NUMBER_NAMES[index],
                description: "Reach " + safeFormatNumber(NUMBER_MILESTONES[index]) + " numbers.",
                unlockedBy: createThresholdPredicate("number", NUMBER_MILESTONES[index])
            });
        }

        for (index = 0; index < CLICK_MILESTONES.length; index += 1) {
            this.items.push({
                id: "click-" + CLICK_MILESTONES[index],
                name: CLICK_NAMES[index],
                description: "Make " + safeFormatNumber(CLICK_MILESTONES[index]) + " total clicks.",
                unlockedBy: createThresholdPredicate("totalClicks", CLICK_MILESTONES[index])
            });
        }

        for (index = 0; index < RARE_ACHIEVEMENTS.length; index += 1) {
            this.items.push({
                id: RARE_ACHIEVEMENTS[index].id,
                name: RARE_ACHIEVEMENTS[index].name,
                description: RARE_ACHIEVEMENTS[index].description,
                unlockedBy: RARE_ACHIEVEMENTS[index].unlockedBy
            });
        }
    };

    function createThresholdPredicate(field, threshold) {
        return function (state) {
            return state[field] >= threshold;
        };
    }

    function createFindCatalog() {
        var items = [];
        var index;
        var ratio = Math.log(MAX_FIND_ROLL / MIN_FIND_ROLL);
        var threshold;
        var prefix;
        var core;
        var suffix;

        for (index = 0; index < FIND_COUNT; index += 1) {
            threshold = Math.floor(MIN_FIND_ROLL * Math.exp(ratio * (index / (FIND_COUNT - 1))));
            prefix = FIND_PREFIXES[index % FIND_PREFIXES.length];
            core = FIND_CORES[Math.floor(index / FIND_PREFIXES.length) % FIND_CORES.length];
            suffix = FIND_SUFFIXES[Math.floor(index / (FIND_PREFIXES.length * FIND_CORES.length)) % FIND_SUFFIXES.length];

            items.push({
                id: "find-" + (index + 1),
                name: prefix + " " + core + " " + suffix,
                threshold: threshold
            });
        }

        items[0].threshold = MIN_FIND_ROLL;
        items[items.length - 1].threshold = MAX_FIND_ROLL;
        return items;
    }

    function NumberEngine(options) {
        this.storage = options.storage;
        this.catalog = options.catalog;
        this.state = this.storage.load();
        this.listeners = {
            update: [],
            toast: [],
            cutscene: []
        };
        this.lastSaveSucceeded = false;
        this.ensureBoosterShape();
        this.recomputePower();
    }

    NumberEngine.prototype.ensureBoosterShape = function () {
        var index;
        for (index = 0; index < BOOSTERS.length; index += 1) {
            if (typeof this.state.ownedBoosters[BOOSTERS[index].id] !== "number") {
                this.state.ownedBoosters[BOOSTERS[index].id] = 0;
            }
            if (typeof this.state.usedSingleUseBoosters[BOOSTERS[index].id] !== "boolean") {
                this.state.usedSingleUseBoosters[BOOSTERS[index].id] = false;
            }
        }
    };

    NumberEngine.prototype.on = function (eventName, listener) {
        if (!this.listeners[eventName]) {
            return;
        }
        this.listeners[eventName].push(listener);
    };

    NumberEngine.prototype.emit = function (eventName, payload) {
        var queue = this.listeners[eventName] || [];
        var index;
        for (index = 0; index < queue.length; index += 1) {
            queue[index](payload);
        }
    };

    NumberEngine.prototype.click = function () {
        var previousCoinBlocks = Math.floor(this.state.totalClicks / CLICKS_PER_COIN_BLOCK);
        var baseRoll;
        if (this.state.sessionStartAt === 0) {
            this.state.sessionStartAt = Date.now();
        }
        this.state.totalClicks += 1;
        this.state.number += this.state.clickPower;
        this.state.backgroundHue = (this.state.backgroundHue + 19) % 360;
        this.state.totalRolls += 1;
        baseRoll = this.randomInt(1, 10000);
        if (baseRoll > this.state.bestBaseRoll) {
            this.state.bestBaseRoll = baseRoll;
        }
        this.state.lastRoll = baseRoll + this.getTotalLuck();
        if (this.state.lastRoll > this.state.bestRoll) {
            this.state.bestRoll = this.state.lastRoll;
        }
        this.resolveFind();
        this.updateHighRollWindow();
        if (this.state.activeBoostId === "void-tonic" && this.state.lastRoll >= 10000) {
            this.state.voidTonicSuccess = true;
        }
        this.consumeActiveBoostCharge();
        this.awardCoins(previousCoinBlocks);

        this.recomputePower();
        this.unlockAchievements();
        this.triggerCutscenes();
        this.lastSaveSucceeded = this.storage.save(this.state);
        this.emit("update", this.getSnapshot());
    };

    NumberEngine.prototype.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    NumberEngine.prototype.updateHighRollWindow = function () {
        var now = Date.now();
        if (this.state.lastRoll >= 9000) {
            this.state.recentHighRollTimestamps.push(now);
        }
        this.state.recentHighRollTimestamps = this.filterRecent(this.state.recentHighRollTimestamps, ONE_MINUTE_MS, now);
        this.state.highRollStreakWindow = this.state.recentHighRollTimestamps.length;
    };

    NumberEngine.prototype.filterRecent = function (timestamps, windowMs, now) {
        var filtered = [];
        var index;
        for (index = 0; index < timestamps.length; index += 1) {
            if (now - timestamps[index] <= windowMs) {
                filtered.push(timestamps[index]);
            }
        }
        return filtered;
    };

    NumberEngine.prototype.awardCoins = function (previousBlocks) {
        var currentBlocks = Math.floor(this.state.totalClicks / CLICKS_PER_COIN_BLOCK);
        var blocksEarned = currentBlocks - previousBlocks;
        if (blocksEarned > 0) {
            this.state.coins += blocksEarned * COINS_PER_CLICK_BLOCK;
        }
    };

    NumberEngine.prototype.buyBooster = function (boosterId) {
        var booster = this.getBoosterById(boosterId);
        if (!booster) {
            return;
        }
        if (this.state.totalRolls < booster.unlockRolls) {
            return;
        }
        if (this.state.coins < booster.cost) {
            return;
        }
        if (booster.singleUse && this.state.usedSingleUseBoosters[booster.id]) {
            return;
        }
        if ((this.state.ownedBoosters[booster.id] || 0) >= booster.maxPurchases) {
            return;
        }

        this.state.coins -= booster.cost;
        this.state.totalCoinsSpent += booster.cost;
        this.state.totalBoostersBought += 1;
        this.state.ownedBoosters[booster.id] += 1;
        if (booster.permanent) {
            this.state.permanentLuck += booster.luck;
        } else {
            this.activateBooster(booster);
        }
        if (booster.singleUse) {
            this.state.usedSingleUseBoosters[booster.id] = true;
        }
        this.lastSaveSucceeded = this.storage.save(this.state);
        this.emit("toast", {
            name: booster.name,
            description: booster.permanent
                ? "Permanent luck increased by " + safeFormatNumber(booster.luck) + "."
                : "Activated for " + safeFormatNumber(booster.durationClicks) + " click" + (booster.durationClicks === 1 ? "" : "s") + "."
        });
        this.emit("update", this.getSnapshot());
    };

    NumberEngine.prototype.activateBooster = function (booster) {
        this.state.activeBoostId = booster.id;
        this.state.activeLuck = booster.luck;
        this.state.activeBoostRemaining = booster.durationClicks;
        if (booster.luck > this.state.highestTemporaryLuck) {
            this.state.highestTemporaryLuck = booster.luck;
        }
    };

    NumberEngine.prototype.getTotalLuck = function () {
        return this.state.permanentLuck + this.state.activeLuck;
    };

    NumberEngine.prototype.consumeActiveBoostCharge = function () {
        if (this.state.activeBoostRemaining <= 0) {
            this.state.activeBoostId = "";
            this.state.activeLuck = 0;
            this.state.activeBoostRemaining = 0;
            return;
        }

        this.state.activeBoostRemaining -= 1;
        if (this.state.activeBoostRemaining <= 0) {
            this.state.activeBoostId = "";
            this.state.activeLuck = 0;
            this.state.activeBoostRemaining = 0;
        }
    };

    NumberEngine.prototype.getBoosterById = function (boosterId) {
        var index;
        for (index = 0; index < BOOSTERS.length; index += 1) {
            if (BOOSTERS[index].id === boosterId) {
                return BOOSTERS[index];
            }
        }
        return null;
    };

    NumberEngine.prototype.recomputePower = function () {
        this.state.clickPower = 1;
    };

    NumberEngine.prototype.resolveFind = function () {
        var found = this.findByRoll(this.state.lastRoll);
        var best;

        this.state.latestFindId = found ? found.id : "";
        if (!found) {
            return;
        }

        best = this.getFindById(this.state.bestFindId);
        if (!best || found.threshold > best.threshold) {
            this.state.bestFindId = found.id;
        }
    };

    NumberEngine.prototype.findByRoll = function (roll) {
        var low = 0;
        var high = FIND_CATALOG.length - 1;
        var best = null;
        var mid;
        var item;

        while (low <= high) {
            mid = Math.floor((low + high) / 2);
            item = FIND_CATALOG[mid];
            if (item.threshold <= roll) {
                best = item;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return best;
    };

    NumberEngine.prototype.getFindById = function (findId) {
        var index;
        for (index = 0; index < FIND_CATALOG.length; index += 1) {
            if (FIND_CATALOG[index].id === findId) {
                return FIND_CATALOG[index];
            }
        }
        return null;
    };

    NumberEngine.prototype.unlockAchievements = function () {
        var unlockedMap = {};
        var newlyUnlocked = [];
        var index;
        var achievement;

        for (index = 0; index < this.state.unlockedAchievements.length; index += 1) {
            unlockedMap[this.state.unlockedAchievements[index]] = true;
        }

        for (index = 0; index < this.catalog.items.length; index += 1) {
            achievement = this.catalog.items[index];
            if (unlockedMap[achievement.id]) {
                continue;
            }

            if (achievement.unlockedBy(this.state)) {
                this.state.unlockedAchievements.push(achievement.id);
                unlockedMap[achievement.id] = true;
                newlyUnlocked.push(achievement);
                this.emit("toast", achievement);
            }
        }

        return newlyUnlocked;
    };

    NumberEngine.prototype.triggerCutscenes = function () {
        var seenMap = {};
        var index;
        var milestone;
        var highestValue = this.state.number;

        if (this.state.lastRoll > highestValue) {
            highestValue = this.state.lastRoll;
        }

        for (index = 0; index < this.state.seenCutscenes.length; index += 1) {
            seenMap[this.state.seenCutscenes[index]] = true;
        }

        for (index = 0; index < CUTSCENE_MILESTONES.length; index += 1) {
            milestone = CUTSCENE_MILESTONES[index];
            if (highestValue >= milestone.value && !seenMap[milestone.value]) {
                this.state.seenCutscenes.push(milestone.value);
                seenMap[milestone.value] = true;
                this.trackCutsceneChain();
                this.emit("cutscene", milestone);
            }
        }
    };

    NumberEngine.prototype.trackCutsceneChain = function () {
        var now = Date.now();
        this.state.recentCutsceneTimestamps.push(now);
        this.state.recentCutsceneTimestamps = this.filterRecent(this.state.recentCutsceneTimestamps, 30 * 1000, now);
        this.state.cutsceneChainCount = this.state.recentCutsceneTimestamps.length;
    };

    NumberEngine.prototype.getSnapshot = function () {
        return {
            number: this.state.number,
            totalClicks: this.state.totalClicks,
            clickPower: this.state.clickPower,
            backgroundHue: this.state.backgroundHue,
            coins: this.state.coins,
            totalLuck: this.getTotalLuck(),
            permanentLuck: this.state.permanentLuck,
            lastRoll: this.state.lastRoll,
            bestRoll: this.state.bestRoll,
            totalRolls: this.state.totalRolls,
            activeBoostRemaining: this.state.activeBoostRemaining,
            activeBoosterName: this.getActiveBoosterName(),
            latestFind: this.getFindById(this.state.latestFindId),
            bestFind: this.getFindById(this.state.bestFindId),
            unlockedCount: this.state.unlockedAchievements.length,
            saveOk: this.lastSaveSucceeded || this.storage.getStorage() !== null,
            boosters: this.getBoosterSnapshot()
        };
    };

    NumberEngine.prototype.getActiveBoosterName = function () {
        var booster = this.getBoosterById(this.state.activeBoostId);
        return booster ? booster.name : "None";
    };

    NumberEngine.prototype.getBoosterSnapshot = function () {
        var snapshot = [];
        var index;
        var booster;
        for (index = 0; index < BOOSTERS.length; index += 1) {
            booster = BOOSTERS[index];
            snapshot.push({
                id: booster.id,
                name: booster.name,
                cost: booster.cost,
                luck: booster.luck,
                durationClicks: booster.durationClicks,
                singleUse: booster.singleUse,
                permanent: booster.permanent,
                description: booster.description,
                owned: this.state.ownedBoosters[booster.id] || 0,
                affordable: this.state.coins >= booster.cost,
                exhausted: booster.singleUse && this.state.usedSingleUseBoosters[booster.id],
                unlocked: this.state.totalRolls >= booster.unlockRolls,
                unlockRolls: booster.unlockRolls,
                maxed: (this.state.ownedBoosters[booster.id] || 0) >= booster.maxPurchases
            });
        }
        return snapshot;
    };

    function View(engine) {
        this.engine = engine;
        this.elements = {};
        this.cutsceneTimer = null;
        this.saveTimer = null;
    }

    View.prototype.cache = function () {
        this.elements.numberWrap = document.querySelector(".number-wrap");
        this.elements.numberValue = document.getElementById("numberValue");
        this.elements.button = document.getElementById("clickButton");
        this.elements.backpackButton = document.getElementById("backpackButton");
        this.elements.backpackPanel = document.getElementById("backpackPanel");
        this.elements.closeBackpackButton = document.getElementById("closeBackpackButton");
        this.elements.microText = document.getElementById("microText");
        this.elements.findText = document.getElementById("findText");
        this.elements.saveText = document.getElementById("saveText");
        this.elements.coinValue = document.getElementById("coinValue");
        this.elements.luckValue = document.getElementById("luckValue");
        this.elements.lastRollValue = document.getElementById("lastRollValue");
        this.elements.bestRollValue = document.getElementById("bestRollValue");
        this.elements.activeTimerValue = document.getElementById("activeTimerValue");
        this.elements.activeBoosterValue = document.getElementById("activeBoosterValue");
        this.elements.totalRollsValue = document.getElementById("totalRollsValue");
        this.elements.bestFindValue = document.getElementById("bestFindValue");
        this.elements.latestFindValue = document.getElementById("latestFindValue");
        this.elements.latestFindMeta = document.getElementById("latestFindMeta");
        this.elements.boosterList = document.getElementById("boosterList");
        this.elements.boosterTemplate = document.getElementById("boosterTemplate");
        this.elements.toastHost = document.getElementById("toastHost");
        this.elements.cutsceneOverlay = document.getElementById("cutsceneOverlay");
        this.elements.cutsceneTitle = document.getElementById("cutsceneTitle");
        this.elements.cutsceneSubtitle = document.getElementById("cutsceneSubtitle");
    };

    View.prototype.bind = function () {
        var self = this;
        if (this.elements.button) {
            this.elements.button.addEventListener("click", function () {
                self.engine.click();
                self.pulseNumber();
            });
        }

        if (this.elements.backpackButton) {
            this.elements.backpackButton.addEventListener("click", function () {
                self.toggleBackpack();
            });
        }

        if (this.elements.closeBackpackButton) {
            this.elements.closeBackpackButton.addEventListener("click", function () {
                self.setBackpackOpen(false);
            });
        }

        if (this.elements.boosterList) {
            this.elements.boosterList.addEventListener("click", function (event) {
                var target = event.target;
                var button = target && target.closest ? target.closest(".booster-buy") : null;
                if (!button) {
                    return;
                }
                self.engine.buyBooster(button.getAttribute("data-booster-id"));
            });
        }

        this.engine.on("update", function (snapshot) {
            self.render(snapshot);
        });

        this.engine.on("toast", function (achievement) {
            self.showToast(achievement);
        });

        this.engine.on("cutscene", function (milestone) {
            self.playCutscene(milestone);
        });
    };

    View.prototype.render = function (snapshot) {
        if (this.elements.numberValue) {
            this.elements.numberValue.textContent = safeFormatNumber(snapshot.number);
        }

        if (this.elements.microText) {
            this.elements.microText.textContent =
                "Luck: " + safeFormatNumber(snapshot.totalLuck) +
                ". Last roll: " + safeFormatNumber(snapshot.lastRoll) +
                ". " + snapshot.unlockedCount + "/" + TOTAL_ACHIEVEMENTS + " achievements unlocked.";
        }

        if (this.elements.findText) {
            this.elements.findText.textContent = snapshot.bestFind
                ? "Current best find: " + snapshot.bestFind.name + " (" + safeFormatNumber(snapshot.bestFind.threshold) + "+)"
                : "Current best find: None";
        }

        if (this.elements.saveText) {
            this.setSaveText(snapshot.saveOk ? "Progress saved on this device." : "Progress is not saving in this browser.", snapshot.saveOk);
        }

        if (this.elements.coinValue) {
            this.elements.coinValue.textContent = safeFormatNumber(snapshot.coins);
        }

        if (this.elements.luckValue) {
            this.elements.luckValue.textContent = safeFormatNumber(snapshot.totalLuck);
        }

        if (this.elements.lastRollValue) {
            this.elements.lastRollValue.textContent = safeFormatNumber(snapshot.lastRoll);
        }

        if (this.elements.bestRollValue) {
            this.elements.bestRollValue.textContent = safeFormatNumber(snapshot.bestRoll);
        }

        if (this.elements.activeTimerValue) {
            this.elements.activeTimerValue.textContent = snapshot.activeBoostRemaining > 0
                ? safeFormatNumber(snapshot.activeBoostRemaining) + " clicks"
                : "None";
        }

        if (this.elements.activeBoosterValue) {
            this.elements.activeBoosterValue.textContent = snapshot.activeBoosterName;
        }

        if (this.elements.totalRollsValue) {
            this.elements.totalRollsValue.textContent = safeFormatNumber(snapshot.totalRolls);
        }

        if (this.elements.bestFindValue) {
            this.elements.bestFindValue.textContent = snapshot.bestFind ? snapshot.bestFind.name : "None";
        }

        if (this.elements.latestFindValue) {
            this.elements.latestFindValue.textContent = snapshot.latestFind ? snapshot.latestFind.name : "None yet";
        }

        if (this.elements.latestFindMeta) {
            this.elements.latestFindMeta.textContent = snapshot.latestFind
                ? "Unlocked at " + safeFormatNumber(snapshot.latestFind.threshold) + "+ roll."
                : "Roll to discover one of 5,000 possible finds.";
        }

        this.renderBoosters(snapshot.boosters);

        this.paintBackground(snapshot.backgroundHue);
    };

    View.prototype.renderBoosters = function (boosters) {
        var fragment;
        var index;
        var card;
        var booster;

        if (!this.elements.boosterList || !this.elements.boosterTemplate) {
            return;
        }

        fragment = document.createDocumentFragment();
        for (index = 0; index < boosters.length; index += 1) {
            booster = boosters[index];
            card = this.elements.boosterTemplate.content.firstElementChild.cloneNode(true);
            card.querySelector(".booster-name").textContent = booster.name;
            card.querySelector(".booster-description").textContent = booster.unlocked
                ? booster.description + " Costs " + safeFormatNumber(booster.cost) + " coins for +" + safeFormatNumber(booster.luck) + " luck."
                : "Unlocks after " + safeFormatNumber(booster.unlockRolls) + " total rolls.";
            card.querySelector(".booster-owned").textContent = "Owned: " + safeFormatNumber(booster.owned);
            card.querySelector(".booster-buy").textContent = booster.exhausted ? "Used" : booster.maxed ? "Maxed" : "Buy (" + safeFormatNumber(booster.cost) + ")";
            card.querySelector(".booster-buy").setAttribute("data-booster-id", booster.id);
            card.querySelector(".booster-buy").disabled = !booster.affordable || booster.exhausted || !booster.unlocked || booster.maxed;
            fragment.appendChild(card);
        }

        this.elements.boosterList.innerHTML = "";
        this.elements.boosterList.appendChild(fragment);
    };

    View.prototype.paintBackground = function (baseHue) {
        var hueA = baseHue;
        var hueB = (baseHue + 70) % 360;
        var hueC = (baseHue + 155) % 360;

        document.body.style.background =
            "radial-gradient(circle at 20% 20%, hsla(" + hueC + ", 88%, 74%, 0.18), transparent 25%)," +
            "radial-gradient(circle at 80% 30%, hsla(" + hueA + ", 92%, 72%, 0.12), transparent 30%)," +
            "linear-gradient(135deg, hsl(" + hueA + ", 65%, 14%), hsl(" + hueB + ", 70%, 20%) 48%, hsl(" + hueC + ", 72%, 34%))";
    };

    View.prototype.setSaveText = function (text, healthy) {
        var self = this;
        if (!this.elements.saveText) {
            return;
        }

        this.elements.saveText.textContent = text;
        if (healthy) {
            this.elements.saveText.classList.add("is-saving");
        } else {
            this.elements.saveText.classList.remove("is-saving");
        }

        window.clearTimeout(this.saveTimer);
        if (healthy) {
            this.saveTimer = window.setTimeout(function () {
                if (self.elements.saveText) {
                    self.elements.saveText.textContent = "Progress saved on this device.";
                    self.elements.saveText.classList.add("is-saving");
                }
            }, 1200);
        }
    };

    View.prototype.pulseNumber = function () {
        if (!this.elements.numberWrap) {
            return;
        }
        this.elements.numberWrap.classList.remove("is-pulsing");
        void this.elements.numberWrap.offsetWidth;
        this.elements.numberWrap.classList.add("is-pulsing");
    };

    View.prototype.showToast = function (achievement) {
        var toast;
        var title;
        var description;

        if (!this.elements.toastHost) {
            return;
        }

        toast = document.createElement("article");
        toast.className = "achievement-toast";

        title = document.createElement("strong");
        title.textContent = achievement.name;

        description = document.createElement("p");
        description.textContent = achievement.description;

        toast.appendChild(title);
        toast.appendChild(description);
        this.elements.toastHost.insertBefore(toast, this.elements.toastHost.firstChild);

        window.setTimeout(function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 4600);

        while (this.elements.toastHost.children.length > 4) {
            this.elements.toastHost.removeChild(this.elements.toastHost.lastChild);
        }
    };

    View.prototype.playCutscene = function (milestone) {
        var self = this;
        if (!this.elements.cutsceneOverlay) {
            return;
        }

        this.elements.cutsceneTitle.textContent = milestone.title;
        this.elements.cutsceneSubtitle.textContent = milestone.subtitle + " Reached " + safeFormatNumber(milestone.value) + " numbers.";
        this.elements.cutsceneOverlay.classList.remove("hidden");
        this.elements.cutsceneOverlay.setAttribute("aria-hidden", "false");

        window.clearTimeout(this.cutsceneTimer);
        this.cutsceneTimer = window.setTimeout(function () {
            self.elements.cutsceneOverlay.classList.add("hidden");
            self.elements.cutsceneOverlay.setAttribute("aria-hidden", "true");
        }, 3400);
    };

    View.prototype.toggleBackpack = function () {
        var isHidden = this.elements.backpackPanel.classList.contains("hidden");
        this.setBackpackOpen(isHidden);
    };

    View.prototype.setBackpackOpen = function (isOpen) {
        if (!this.elements.backpackPanel || !this.elements.backpackButton) {
            return;
        }
        this.elements.backpackPanel.classList.toggle("hidden", !isOpen);
        this.elements.backpackPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
        this.elements.backpackButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    function bootstrap() {
        var catalog = new AchievementCatalog();
        var engine = new NumberEngine({
            storage: new StorageAdapter(SAVE_KEY),
            catalog: catalog
        });
        var view = new View(engine);

        view.cache();
        view.bind();
        view.render(engine.getSnapshot());
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bootstrap);
    } else {
        bootstrap();
    }
}());
