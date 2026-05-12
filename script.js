(function () {
    "use strict";

    var SAVE_KEY = "number-clicker-engine-v3";
    var SPOTIFY_LIBRARY_KEY = "number-clicker-spotify-songs-v1";
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
    var LUCK_MACHINE_COST = 1000;
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
    ].concat(createQuadPotions());

    var CUTSCENE_MILESTONES = [
        { value: 10000, title: "Neon Surge", subtitle: "The screen bends for the first real threshold.", theme: "neon", durationMs: 7600 },
        { value: 50000, title: "Sky Splitter", subtitle: "Color pressure starts tearing through the calm.", theme: "neon", durationMs: 7600 },
        { value: 100000, title: "Velocity Crown", subtitle: "Your clicks stop feeling local.", theme: "neon", durationMs: 7800 },
        { value: 500000, title: "Solar Tremor", subtitle: "The atmosphere gives up and starts glowing.", theme: "solar", durationMs: 7800 },
        { value: 1000000, title: "Radiant Collapse", subtitle: "A million numbers is enough to distort the room.", theme: "solar", durationMs: 8000 },
        { value: 5000000, title: "Prism Rift", subtitle: "Everything picks a brighter color and stays there.", theme: "solar", durationMs: 8200 },
        { value: 10000000, title: "Aurora Engine", subtitle: "The game finally looks like it knows your name.", theme: "cosmic", durationMs: 8400 },
        { value: 50000000, title: "Celestial Overdrive", subtitle: "This is no longer a button. It is an event.", theme: "cosmic", durationMs: 8600 },
        { value: 100000000, title: "Chromatic Tempest", subtitle: "Pure saturation. Pure noise. Pure momentum.", theme: "cosmic", durationMs: 9000 },
        { value: 500000000, title: "Thunder Bloom", subtitle: "The cutscene has stopped asking for permission.", theme: "apex", durationMs: 9800 },
        { value: 1000000000, title: "Apex Corona", subtitle: "You reached the billion line and the world noticed.", theme: "apex", durationMs: 11000 },
        { value: 5000000000, title: "Absolute Zenith", subtitle: "Five billion does not arrive. It tears the sky open.", theme: "apex", mode: "finale", durationMs: 50000 }
    ];
    var DEFAULT_CUTSCENE_DURATION_MS = 7600;
    var FINALE_CUTSCENE_STEPS = [
        { at: 1200, phase: "Power Build", line: "The room goes empty. The count keeps climbing." },
        { at: 5600, phase: "Pressure Layer", line: "Every smaller milestone folds underneath this one." },
        { at: 10200, phase: "Orbit Break", line: "Numbers peel across the screen like shrapnel." },
        { at: 14800, phase: "Crown Ignition", line: "The apex theme finally earns its name." },
        { at: 19600, phase: "White Heat", line: "The center burns bright enough to erase the edges." },
        { at: 24400, phase: "Silence Drop", line: "Then everything cuts down to black again." },
        { at: 29200, phase: "Return Signal", line: "A thin gold pulse crawls back into the void." },
        { at: 34000, phase: "Zenith Rise", line: "Five billion stands up in full view." },
        { at: 39400, phase: "Final Lock", line: "No shortcut. No cheap flash. Just earned scale." },
        { at: 44600, phase: "Absolute Zenith", line: "You made the ladder end in something worthy of the climb." }
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

    function createQuadPotions() {
        return [
            { id: "quad-potion-1", name: "Split Sip I", cost: 18, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 4, singleUse: false, permanent: false, unlockRolls: 12, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 4 clicks." },
            { id: "quad-potion-2", name: "Split Sip II", cost: 36, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 6, singleUse: false, permanent: false, unlockRolls: 24, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 6 clicks." },
            { id: "quad-potion-3", name: "Split Sip III", cost: 54, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 8, singleUse: false, permanent: false, unlockRolls: 48, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 8 clicks." },
            { id: "quad-potion-4", name: "Echo Flask I", cost: 80, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 10, singleUse: false, permanent: false, unlockRolls: 80, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 10 clicks." },
            { id: "quad-potion-5", name: "Echo Flask II", cost: 110, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 12, singleUse: false, permanent: false, unlockRolls: 130, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 12 clicks." },
            { id: "quad-potion-6", name: "Echo Flask III", cost: 150, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 15, singleUse: false, permanent: false, unlockRolls: 190, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 15 clicks." },
            { id: "quad-potion-7", name: "Mirror Draft I", cost: 210, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 18, singleUse: false, permanent: false, unlockRolls: 260, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 18 clicks." },
            { id: "quad-potion-8", name: "Mirror Draft II", cost: 300, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 22, singleUse: false, permanent: false, unlockRolls: 360, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 22 clicks." },
            { id: "quad-potion-9", name: "Mirror Draft III", cost: 420, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 26, singleUse: false, permanent: false, unlockRolls: 500, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 26 clicks." },
            { id: "quad-potion-10", name: "Prism Dose I", cost: 620, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 30, singleUse: false, permanent: false, unlockRolls: 700, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 30 clicks." },
            { id: "quad-potion-11", name: "Prism Dose II", cost: 900, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 36, singleUse: false, permanent: false, unlockRolls: 980, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 36 clicks." },
            { id: "quad-potion-12", name: "Prism Dose III", cost: 1300, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 42, singleUse: false, permanent: false, unlockRolls: 1350, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 42 clicks." },
            { id: "quad-potion-13", name: "Zen Vein I", cost: 1900, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 50, singleUse: false, permanent: false, unlockRolls: 1850, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 50 clicks." },
            { id: "quad-potion-14", name: "Zen Vein II", cost: 2800, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 60, singleUse: false, permanent: false, unlockRolls: 2450, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 60 clicks." },
            { id: "quad-potion-15", name: "Zen Vein III", cost: 4200, luck: 0, luckMultiplier: 2, rollsPerClick: 4, durationClicks: 72, singleUse: false, permanent: false, unlockRolls: 3200, maxPurchases: 999999, description: "Doubles luck and turns one press into 4 rolls for 72 clicks." }
        ];
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
            activeBoosts: [],
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
                activeBoosts: Array.isArray(parsed.activeBoosts) ? parsed.activeBoosts : fallback.activeBoosts,
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
            cutscene: [],
            luckSpin: []
        };
        this.lastSaveSucceeded = false;
        this.ensureBoosterShape();
        this.recomputePower();
    }

    NumberEngine.prototype.ensureBoosterShape = function () {
        var index;
        var activeBoosts = [];
        for (index = 0; index < BOOSTERS.length; index += 1) {
            if (typeof this.state.ownedBoosters[BOOSTERS[index].id] !== "number") {
                this.state.ownedBoosters[BOOSTERS[index].id] = 0;
            }
            if (typeof this.state.usedSingleUseBoosters[BOOSTERS[index].id] !== "boolean") {
                this.state.usedSingleUseBoosters[BOOSTERS[index].id] = false;
            }
        }
        for (index = 0; index < this.state.activeBoosts.length; index += 1) {
            if (this.state.activeBoosts[index] &&
                typeof this.state.activeBoosts[index].id === "string" &&
                typeof this.state.activeBoosts[index].luck === "number" &&
                typeof this.state.activeBoosts[index].remaining === "number" &&
                this.state.activeBoosts[index].remaining > 0) {
                if (typeof this.state.activeBoosts[index].rollsPerClick !== "number" || this.state.activeBoosts[index].rollsPerClick < 1) {
                    this.state.activeBoosts[index].rollsPerClick = 1;
                }
                if (this.state.activeBoosts[index].id.indexOf("quad-potion-") === 0 && typeof this.state.activeBoosts[index].luckMultiplier !== "number") {
                    this.state.activeBoosts[index].luck = 0;
                    this.state.activeBoosts[index].luckMultiplier = 2;
                }
                if (typeof this.state.activeBoosts[index].luckMultiplier !== "number" || this.state.activeBoosts[index].luckMultiplier < 1) {
                    this.state.activeBoosts[index].luckMultiplier = 1;
                }
                activeBoosts.push(this.state.activeBoosts[index]);
            }
        }
        this.state.activeBoosts = activeBoosts;
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
        var rollCount;
        var highestBaseRoll = 0;
        var highestRoll = 0;
        var highRollHits = 0;
        var rollIndex;
        var baseRoll;
        var totalLuck;
        if (this.state.sessionStartAt === 0) {
            this.state.sessionStartAt = Date.now();
        }
        this.state.totalClicks += 1;
        this.state.number += this.state.clickPower;
        this.state.backgroundHue = (this.state.backgroundHue + 19) % 360;
        rollCount = this.getRollsPerClick();
        totalLuck = this.getTotalLuck();

        for (rollIndex = 0; rollIndex < rollCount; rollIndex += 1) {
            this.state.totalRolls += 1;
            baseRoll = this.randomInt(1, 10000);
            if (baseRoll > highestBaseRoll) {
                highestBaseRoll = baseRoll;
            }
            if (baseRoll + totalLuck > highestRoll) {
                highestRoll = baseRoll + totalLuck;
            }
            if (baseRoll + totalLuck >= 9000) {
                highRollHits += 1;
            }
        }

        if (highestBaseRoll > this.state.bestBaseRoll) {
            this.state.bestBaseRoll = highestBaseRoll;
        }
        this.state.lastRoll = highestRoll;
        if (highestRoll > this.state.bestRoll) {
            this.state.bestRoll = highestRoll;
        }
        this.resolveFind();
        this.updateHighRollWindow(highRollHits);
        if (this.hasActiveBoost("void-tonic") && highestRoll >= 10000) {
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

    NumberEngine.prototype.updateHighRollWindow = function (highRollHits) {
        var now = Date.now();
        var index;
        if (highRollHits > 0) {
            for (index = 0; index < highRollHits; index += 1) {
                this.state.recentHighRollTimestamps.push(now);
            }
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
                : "Activated for " + safeFormatNumber(booster.durationClicks) + " click" + (booster.durationClicks === 1 ? "" : "s") + (booster.luckMultiplier > 1 ? " with " + safeFormatNumber(booster.luckMultiplier) + "x luck" : "") + (booster.rollsPerClick > 1 ? " and " + safeFormatNumber(booster.rollsPerClick) + " rolls per press." : ".")
        });
        this.emit("update", this.getSnapshot());
    };

    NumberEngine.prototype.spinLuckMachine = function () {
        var value = this.randomInt(0, 999);
        var positive = this.randomInt(0, 1) === 1;
        var delta = positive ? value : -value;

        if (this.state.coins < LUCK_MACHINE_COST) {
            this.emit("toast", {
                name: "Insufficient funds",
                description: "Insufficient funds. The Luck Machine costs " + safeFormatNumber(LUCK_MACHINE_COST) + " coins."
            });
            this.emit("update", this.getSnapshot());
            return;
        }

        this.state.coins -= LUCK_MACHINE_COST;
        this.state.permanentLuck += delta;
        this.lastSaveSucceeded = this.storage.save(this.state);
        this.emit("luckSpin", {
            value: value,
            delta: delta,
            positive: positive,
            coinsAfter: this.state.coins
        });
        this.emit("toast", {
            name: positive ? "Green Machine Hit" : "Red Machine Hit",
            description: (positive ? "+" : "-") + safeFormatNumber(value) + " permanent luck. " + safeFormatNumber(LUCK_MACHINE_COST) + " coins spent."
        });
        this.emit("update", this.getSnapshot());
    };

    NumberEngine.prototype.runAdminAction = function (action) {
        var message = "Admin action complete.";

        if (action === "coins") {
            this.state.coins += 1000000000;
            message = "+1,000,000,000 coins granted.";
        } else if (action === "luck") {
            this.state.permanentLuck += 1000000;
            message = "+1,000,000 permanent luck granted.";
        } else if (action === "rolls") {
            this.state.totalRolls += 100000;
            this.state.lastRoll = Math.max(this.state.lastRoll, this.getTotalLuck() + 10000);
            this.state.bestRoll = Math.max(this.state.bestRoll, this.state.lastRoll);
            this.state.bestBaseRoll = Math.max(this.state.bestBaseRoll, 10000);
            message = "+100,000 rolls granted.";
        } else if (action === "clicks") {
            this.state.totalClicks += 100000;
            this.state.number += 100000;
            this.state.coins += 1500000;
            message = "+100,000 clicks and click coins granted.";
        } else if (action === "milestone-10k") {
            this.applyAdminMilestone(10000);
            message = "10K milestone granted.";
        } else if (action === "milestone-5b") {
            this.applyAdminMilestone(5000000000);
            message = "5B milestone granted.";
        } else if (action === "boosters") {
            this.adminGrantBoosters();
            message = "Every booster stacked.";
        } else if (action === "finds") {
            this.state.latestFindId = FIND_CATALOG[FIND_CATALOG.length - 1].id;
            this.state.bestFindId = FIND_CATALOG[FIND_CATALOG.length - 1].id;
            this.state.lastRoll = Math.max(this.state.lastRoll, MAX_FIND_ROLL);
            this.state.bestRoll = Math.max(this.state.bestRoll, MAX_FIND_ROLL);
            message = "Best find granted.";
        } else if (action === "achievements") {
            this.adminUnlockAllAchievements();
            message = "All achievements unlocked.";
        } else if (action === "max") {
            this.state.coins += 1000000000;
            this.state.permanentLuck += 10000000;
            this.state.totalClicks += 1000000;
            this.state.totalRolls += 1000000;
            this.applyAdminMilestone(5000000000);
            this.adminGrantBoosters();
            this.adminUnlockAllAchievements();
            this.state.latestFindId = FIND_CATALOG[FIND_CATALOG.length - 1].id;
            this.state.bestFindId = FIND_CATALOG[FIND_CATALOG.length - 1].id;
            message = "Max save granted.";
        }

        this.resolveFind();
        this.unlockAchievements();
        this.triggerCutscenes();
        this.lastSaveSucceeded = this.storage.save(this.state);
        this.emit("toast", {
            name: "Admin Panel",
            description: message
        });
        this.emit("update", this.getSnapshot());
    };

    NumberEngine.prototype.applyAdminMilestone = function (value) {
        this.state.number = Math.max(this.state.number, value);
        this.state.lastRoll = Math.max(this.state.lastRoll, value);
        this.state.bestRoll = Math.max(this.state.bestRoll, value);
        this.state.bestBaseRoll = Math.max(this.state.bestBaseRoll, 10000);
        this.state.totalRolls += 1000;
        this.state.totalClicks += 1000;
    };

    NumberEngine.prototype.adminGrantBoosters = function () {
        var index;
        var booster;
        var previousOwned;
        for (index = 0; index < BOOSTERS.length; index += 1) {
            booster = BOOSTERS[index];
            previousOwned = this.state.ownedBoosters[booster.id] || 0;
            this.state.ownedBoosters[booster.id] = booster.maxPurchases === 1 ? 1 : Math.max(this.state.ownedBoosters[booster.id] || 0, 99);
            if (booster.permanent && previousOwned === 0) {
                this.state.permanentLuck += booster.luck;
            }
            if (!booster.permanent && !booster.singleUse) {
                this.activateBooster(booster);
            }
            if (booster.singleUse) {
                this.state.usedSingleUseBoosters[booster.id] = false;
            }
        }
    };

    NumberEngine.prototype.adminUnlockAllAchievements = function () {
        var unlockedMap = {};
        var index;
        var achievement;
        for (index = 0; index < this.state.unlockedAchievements.length; index += 1) {
            unlockedMap[this.state.unlockedAchievements[index]] = true;
        }
        for (index = 0; index < this.catalog.items.length; index += 1) {
            achievement = this.catalog.items[index];
            if (!unlockedMap[achievement.id]) {
                this.state.unlockedAchievements.push(achievement.id);
                unlockedMap[achievement.id] = true;
            }
        }
    };

    NumberEngine.prototype.activateBooster = function (booster) {
        this.state.activeBoosts.push({
            id: booster.id,
            luck: booster.luck,
            luckMultiplier: booster.luckMultiplier || 1,
            remaining: booster.durationClicks,
            name: booster.name,
            rollsPerClick: booster.rollsPerClick || 1
        });
        if (booster.luck > this.state.highestTemporaryLuck) {
            this.state.highestTemporaryLuck = booster.luck;
        }
        if (this.getTotalLuck() > this.state.highestTemporaryLuck) {
            this.state.highestTemporaryLuck = this.getTotalLuck();
        }
    };

    NumberEngine.prototype.getTotalLuck = function () {
        var total = this.state.permanentLuck;
        var multiplier = 1;
        var index;
        for (index = 0; index < this.state.activeBoosts.length; index += 1) {
            total += this.state.activeBoosts[index].luck;
            multiplier *= this.state.activeBoosts[index].luckMultiplier || 1;
        }
        return total * multiplier;
    };

    NumberEngine.prototype.consumeActiveBoostCharge = function () {
        var remainingBoosts = [];
        var index;
        var boost;
        for (index = 0; index < this.state.activeBoosts.length; index += 1) {
            boost = this.state.activeBoosts[index];
            boost.remaining -= 1;
            if (boost.remaining > 0) {
                remainingBoosts.push(boost);
            }
        }
        this.state.activeBoosts = remainingBoosts;
    };

    NumberEngine.prototype.getRollsPerClick = function () {
        var rolls = 1;
        var index;
        for (index = 0; index < this.state.activeBoosts.length; index += 1) {
            if (this.state.activeBoosts[index].rollsPerClick > rolls) {
                rolls = this.state.activeBoosts[index].rollsPerClick;
            }
        }
        return rolls;
    };

    NumberEngine.prototype.hasActiveBoost = function (boosterId) {
        var index;
        for (index = 0; index < this.state.activeBoosts.length; index += 1) {
            if (this.state.activeBoosts[index].id === boosterId) {
                return true;
            }
        }
        return false;
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
            rollsPerClick: this.getRollsPerClick(),
            permanentLuck: this.state.permanentLuck,
            lastRoll: this.state.lastRoll,
            bestRoll: this.state.bestRoll,
            totalRolls: this.state.totalRolls,
            activeBoostRemaining: this.getLongestActiveBoostTime(),
            activeBoosterName: this.getActiveBoosterSummary(),
            latestFind: this.getFindById(this.state.latestFindId),
            bestFind: this.getFindById(this.state.bestFindId),
            unlockedCount: this.state.unlockedAchievements.length,
            saveOk: this.lastSaveSucceeded || this.storage.getStorage() !== null,
            luckMachineCost: LUCK_MACHINE_COST,
            boosters: this.getBoosterSnapshot()
        };
    };

    NumberEngine.prototype.getActiveBoosterSummary = function () {
        var names = [];
        var counts = {};
        var strongestRollsPerClick = this.getRollsPerClick();
        var luckMultiplier = 1;
        var index;
        var boost;
        for (index = 0; index < this.state.activeBoosts.length; index += 1) {
            boost = this.state.activeBoosts[index];
            counts[boost.name] = (counts[boost.name] || 0) + 1;
            luckMultiplier *= boost.luckMultiplier || 1;
        }
        for (index in counts) {
            if (Object.prototype.hasOwnProperty.call(counts, index)) {
                names.push(counts[index] > 1 ? index + " x" + counts[index] : index);
            }
        }
        if (strongestRollsPerClick > 1) {
            names.push(safeFormatNumber(strongestRollsPerClick) + " rolls/press");
        }
        if (luckMultiplier > 1) {
            names.push(safeFormatNumber(luckMultiplier) + "x luck");
        }
        return names.length > 0 ? names.join(", ") : "None";
    };

    NumberEngine.prototype.getLongestActiveBoostTime = function () {
        var maxRemaining = 0;
        var index;
        for (index = 0; index < this.state.activeBoosts.length; index += 1) {
            if (this.state.activeBoosts[index].remaining > maxRemaining) {
                maxRemaining = this.state.activeBoosts[index].remaining;
            }
        }
        return maxRemaining;
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
                luckMultiplier: booster.luckMultiplier || 1,
                rollsPerClick: booster.rollsPerClick || 1,
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

    function CalmMusicPlayer() {
        this.context = null;
        this.master = null;
        this.delay = null;
        this.delayGain = null;
        this.filter = null;
        this.interval = null;
        this.isPlaying = false;
        this.step = 0;
        this.chords = [
            [261.63, 329.63, 392.00, 493.88],
            [220.00, 293.66, 349.23, 440.00],
            [246.94, 311.13, 392.00, 466.16],
            [196.00, 261.63, 329.63, 392.00]
        ];
    }

    CalmMusicPlayer.prototype.ensureContext = function () {
        var AudioContextRef = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextRef) {
            return false;
        }
        if (!this.context) {
            this.context = new AudioContextRef();
            this.master = this.context.createGain();
            this.filter = this.context.createBiquadFilter();
            this.delay = this.context.createDelay();
            this.delayGain = this.context.createGain();

            this.master.gain.value = 0.13;
            this.filter.type = "lowpass";
            this.filter.frequency.value = 1400;
            this.delay.delayTime.value = 0.36;
            this.delayGain.gain.value = 0.18;

            this.filter.connect(this.master);
            this.filter.connect(this.delay);
            this.delay.connect(this.delayGain);
            this.delayGain.connect(this.master);
            this.master.connect(this.context.destination);
        }
        return true;
    };

    CalmMusicPlayer.prototype.start = function () {
        var self = this;
        if (!this.ensureContext()) {
            return false;
        }
        if (this.context.state === "suspended") {
            this.context.resume();
        }
        if (this.isPlaying) {
            return true;
        }
        this.isPlaying = true;
        this.step = 0;
        this.playStep();
        this.interval = window.setInterval(function () {
            self.playStep();
        }, 3600);
        return true;
    };

    CalmMusicPlayer.prototype.stop = function () {
        window.clearInterval(this.interval);
        this.interval = null;
        this.isPlaying = false;
        if (this.master && this.context) {
            this.master.gain.cancelScheduledValues(this.context.currentTime);
            this.master.gain.setTargetAtTime(0.0001, this.context.currentTime, 0.24);
        }
    };

    CalmMusicPlayer.prototype.playStep = function () {
        var chord;
        var now;
        var index;
        if (!this.context || !this.isPlaying) {
            return;
        }
        now = this.context.currentTime;
        chord = this.chords[this.step % this.chords.length];
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setTargetAtTime(0.13, now, 0.3);

        for (index = 0; index < chord.length; index += 1) {
            this.playTone(chord[index], now + index * 0.045, 3.3, index === 0 ? 0.28 : 0.18);
        }
        this.playTone(chord[1] * 2, now + 1.15, 1.8, 0.08);
        this.playTone(chord[2] * 2, now + 2.25, 1.6, 0.07);
        this.step += 1;
    };

    CalmMusicPlayer.prototype.playTone = function (frequency, startAt, duration, level) {
        var oscillator = this.context.createOscillator();
        var gain = this.context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startAt);
        oscillator.detune.setValueAtTime((Math.random() * 6) - 3, startAt);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(level, startAt + 0.32);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
        oscillator.connect(gain);
        gain.connect(this.filter);
        oscillator.start(startAt);
        oscillator.stop(startAt + duration + 0.08);
    };

    function View(engine) {
        this.engine = engine;
        this.elements = {};
        this.music = new CalmMusicPlayer();
        this.spotifySongs = this.loadSpotifySongs();
        this.activeSpotifyIndex = this.spotifySongs.length > 0 ? 0 : -1;
        this.adminSequence = "pplleeaasseeaaddmmiinn";
        this.adminBuffer = "";
        this.cutsceneTimer = null;
        this.cutsceneStepTimers = [];
        this.saveTimer = null;
        this.luckSpinTimer = null;
        this.luckSpinInterval = null;
    }

    View.prototype.cache = function () {
        this.elements.numberWrap = document.querySelector(".number-wrap");
        this.elements.numberValue = document.getElementById("numberValue");
        this.elements.button = document.getElementById("clickButton");
        this.elements.backpackButton = document.getElementById("backpackButton");
        this.elements.backpackPanel = document.getElementById("backpackPanel");
        this.elements.closeBackpackButton = document.getElementById("closeBackpackButton");
        this.elements.luckMachineButton = document.getElementById("luckMachineButton");
        this.elements.luckMachinePanel = document.getElementById("luckMachinePanel");
        this.elements.closeLuckMachineButton = document.getElementById("closeLuckMachineButton");
        this.elements.musicToggleButton = document.getElementById("musicToggleButton");
        this.elements.musicToggleText = document.getElementById("musicToggleText");
        this.elements.musicPanel = document.getElementById("musicPanel");
        this.elements.closeMusicPanelButton = document.getElementById("closeMusicPanelButton");
        this.elements.calmMusicButton = document.getElementById("calmMusicButton");
        this.elements.spotifySongForm = document.getElementById("spotifySongForm");
        this.elements.spotifyUrlInput = document.getElementById("spotifyUrlInput");
        this.elements.spotifyTitleInput = document.getElementById("spotifyTitleInput");
        this.elements.spotifyArtistInput = document.getElementById("spotifyArtistInput");
        this.elements.spotifyMessage = document.getElementById("spotifyMessage");
        this.elements.spotifyPlayerHost = document.getElementById("spotifyPlayerHost");
        this.elements.spotifySongList = document.getElementById("spotifySongList");
        this.elements.luckMachineCabinet = document.getElementById("luckMachineCabinet");
        this.elements.luckSpinButton = document.getElementById("luckSpinButton");
        this.elements.luckReelA = document.getElementById("luckReelA");
        this.elements.luckReelB = document.getElementById("luckReelB");
        this.elements.luckReelC = document.getElementById("luckReelC");
        this.elements.luckSpinResult = document.getElementById("luckSpinResult");
        this.elements.luckSpinDelta = document.getElementById("luckSpinDelta");
        this.elements.luckMachineNote = document.getElementById("luckMachineNote");
        this.elements.adminPanel = document.getElementById("adminPanel");
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
        this.elements.cutsceneValue = document.getElementById("cutsceneValue");
        this.elements.cutsceneSequence = document.getElementById("cutsceneSequence");
        this.elements.cutscenePhase = document.getElementById("cutscenePhase");
        this.elements.cutsceneMonologue = document.getElementById("cutsceneMonologue");
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

        if (this.elements.luckMachineButton) {
            this.elements.luckMachineButton.addEventListener("click", function () {
                self.toggleLuckMachine();
            });
        }

        if (this.elements.closeLuckMachineButton) {
            this.elements.closeLuckMachineButton.addEventListener("click", function () {
                self.setLuckMachineOpen(false);
            });
        }

        if (this.elements.luckSpinButton) {
            this.elements.luckSpinButton.addEventListener("click", function () {
                if (self.elements.luckSpinButton.disabled) {
                    return;
                }
                self.engine.spinLuckMachine();
            });
        }

        if (this.elements.adminPanel) {
            this.elements.adminPanel.addEventListener("click", function (event) {
                var button = event.target && event.target.closest ? event.target.closest("[data-admin-action]") : null;
                if (!button) {
                    return;
                }
                self.engine.runAdminAction(button.getAttribute("data-admin-action"));
            });
        }

        document.addEventListener("keydown", function (event) {
            self.handleAdminSequence(event);
        });

        if (this.elements.musicToggleButton) {
            this.elements.musicToggleButton.addEventListener("click", function () {
                self.toggleMusicPanel();
            });
        }

        if (this.elements.closeMusicPanelButton) {
            this.elements.closeMusicPanelButton.addEventListener("click", function () {
                self.setMusicPanelOpen(false);
            });
        }

        if (this.elements.calmMusicButton) {
            this.elements.calmMusicButton.addEventListener("click", function () {
                self.toggleMusic();
            });
        }

        if (this.elements.spotifySongForm) {
            this.elements.spotifySongForm.addEventListener("submit", function (event) {
                event.preventDefault();
                self.addSpotifySong();
            });
        }

        if (this.elements.spotifySongList) {
            this.elements.spotifySongList.addEventListener("click", function (event) {
                var playButton = event.target && event.target.closest ? event.target.closest(".spotify-play-button") : null;
                var removeButton = event.target && event.target.closest ? event.target.closest(".spotify-remove-button") : null;
                if (playButton) {
                    self.playSpotifySong(Number(playButton.getAttribute("data-song-index")));
                }
                if (removeButton) {
                    self.removeSpotifySong(Number(removeButton.getAttribute("data-song-index")));
                }
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

        this.engine.on("luckSpin", function (result) {
            self.playLuckSpin(result);
        });

        this.renderSpotifySongs();
    };

    View.prototype.handleAdminSequence = function (event) {
        var key = event.key && event.key.length === 1 ? event.key.toLowerCase() : "";
        if (!key || key < "a" || key > "z") {
            return;
        }
        this.adminBuffer = (this.adminBuffer + key).slice(-this.adminSequence.length);
        if (this.adminBuffer === this.adminSequence) {
            this.unlockAdminPanel();
            this.adminBuffer = "";
        }
    };

    View.prototype.unlockAdminPanel = function () {
        if (!this.elements.adminPanel) {
            return;
        }
        this.elements.adminPanel.classList.remove("hidden");
        this.elements.adminPanel.setAttribute("aria-hidden", "false");
        this.setLuckMachineOpen(true);
        this.engine.emit("toast", {
            name: "Admin Panel",
            description: "Owner tools unlocked."
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
                ". Rolls/press: " + safeFormatNumber(snapshot.rollsPerClick) +
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

        if (this.elements.luckSpinButton && !this.elements.luckSpinButton.classList.contains("is-spinning")) {
            this.elements.luckSpinButton.disabled = snapshot.coins < snapshot.luckMachineCost;
            this.elements.luckSpinButton.textContent = snapshot.coins < snapshot.luckMachineCost
                ? "Insufficient funds"
                : "Spin for " + safeFormatNumber(snapshot.luckMachineCost) + " coins";
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
                ? booster.description + " Costs " + safeFormatNumber(booster.cost) + " coins" + (booster.rollsPerClick > 1 ? " and gives " + safeFormatNumber(booster.rollsPerClick) + " rolls per press." : " for +" + safeFormatNumber(booster.luck) + " luck.")
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

    View.prototype.playLuckSpin = function (result) {
        var self = this;
        var reels = [this.elements.luckReelA, this.elements.luckReelB, this.elements.luckReelC];
        var finalText = padLuckValue(result.value);
        var index;

        window.clearTimeout(this.luckSpinTimer);
        window.clearInterval(this.luckSpinInterval);

        if (this.elements.luckMachineCabinet) {
            this.elements.luckMachineCabinet.classList.add("is-spinning");
            this.elements.luckMachineCabinet.classList.remove("is-positive", "is-negative");
        }
        if (this.elements.luckSpinButton) {
            this.elements.luckSpinButton.disabled = true;
            this.elements.luckSpinButton.classList.add("is-spinning");
            this.elements.luckSpinButton.textContent = "Spinning";
        }
        if (this.elements.luckSpinResult) {
            this.elements.luckSpinResult.textContent = "Spinning";
        }
        if (this.elements.luckSpinDelta) {
            this.elements.luckSpinDelta.textContent = "...";
        }

        for (index = 0; index < reels.length; index += 1) {
            if (reels[index]) {
                reels[index].classList.remove("reel-green", "reel-red");
            }
        }

        this.luckSpinInterval = window.setInterval(function () {
            var reelIndex;
            for (reelIndex = 0; reelIndex < reels.length; reelIndex += 1) {
                if (reels[reelIndex]) {
                    reels[reelIndex].textContent = String(self.engine.randomInt(0, 9));
                }
            }
        }, 55);

        this.luckSpinTimer = window.setTimeout(function () {
            window.clearInterval(self.luckSpinInterval);
            for (index = 0; index < reels.length; index += 1) {
                if (reels[index]) {
                    reels[index].textContent = finalText.charAt(index);
                    reels[index].classList.add(result.positive ? "reel-green" : "reel-red");
                }
            }
            if (self.elements.luckMachineCabinet) {
                self.elements.luckMachineCabinet.classList.remove("is-spinning");
                self.elements.luckMachineCabinet.classList.add(result.positive ? "is-positive" : "is-negative");
            }
            if (self.elements.luckSpinResult) {
                self.elements.luckSpinResult.textContent = finalText;
            }
            if (self.elements.luckSpinDelta) {
                self.elements.luckSpinDelta.textContent = (result.delta >= 0 ? "+" : "") + safeFormatNumber(result.delta) + " luck";
            }
            if (self.elements.luckMachineNote) {
                self.elements.luckMachineNote.textContent = "Spent " + safeFormatNumber(LUCK_MACHINE_COST) + " coins. Permanent luck changed by " + (result.delta >= 0 ? "+" : "") + safeFormatNumber(result.delta) + ".";
            }
            if (self.elements.luckSpinButton) {
                self.elements.luckSpinButton.classList.remove("is-spinning");
                self.elements.luckSpinButton.disabled = result.coinsAfter < LUCK_MACHINE_COST;
                self.elements.luckSpinButton.textContent = result.coinsAfter < LUCK_MACHINE_COST
                    ? "Insufficient funds"
                    : "Spin for " + safeFormatNumber(LUCK_MACHINE_COST) + " coins";
            }
        }, 1300);
    };

    View.prototype.toggleMusic = function () {
        if (this.music.isPlaying) {
            this.music.stop();
            this.updateMusicButton(false, true);
            return;
        }
        if (!this.music.start()) {
            this.updateMusicButton(false, false);
            return;
        }
        this.updateMusicButton(true, true);
    };

    View.prototype.updateMusicButton = function (isOn, isSupported) {
        if (this.elements.calmMusicButton) {
            this.elements.calmMusicButton.classList.toggle("is-on", isOn);
            this.elements.calmMusicButton.setAttribute("aria-pressed", isOn ? "true" : "false");
            this.elements.calmMusicButton.disabled = !isSupported;
            this.elements.calmMusicButton.textContent = isSupported ? (isOn ? "Pause Calm Music" : "Play Calm Music") : "No Audio";
        }
        if (this.elements.musicToggleText) {
            this.elements.musicToggleText.textContent = "Music";
        }
    };

    View.prototype.toggleMusicPanel = function () {
        var isHidden = this.elements.musicPanel.classList.contains("hidden");
        this.setMusicPanelOpen(isHidden);
    };

    View.prototype.setMusicPanelOpen = function (isOpen) {
        if (!this.elements.musicPanel || !this.elements.musicToggleButton) {
            return;
        }
        this.elements.musicPanel.classList.toggle("hidden", !isOpen);
        this.elements.musicPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
        this.elements.musicToggleButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    View.prototype.loadSpotifySongs = function () {
        var storage;
        var raw;
        var parsed;
        try {
            storage = window.localStorage;
            raw = storage.getItem(SPOTIFY_LIBRARY_KEY);
            if (!raw) {
                return [];
            }
            parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    };

    View.prototype.saveSpotifySongs = function () {
        try {
            window.localStorage.setItem(SPOTIFY_LIBRARY_KEY, JSON.stringify(this.spotifySongs));
        } catch (error) {
            return false;
        }
        return true;
    };

    View.prototype.addSpotifySong = function () {
        var spotifyTarget = createSpotifyTarget(this.elements.spotifyUrlInput.value);
        var self = this;
        if (!spotifyTarget) {
            this.setSpotifyMessage("Use a valid spotify.com, open.spotify.com, spotify.link, or spotify: link.");
            return;
        }

        this.setSpotifyMessage("Reading Spotify credits...");
        this.fetchSpotifyCredits(spotifyTarget.externalUrl).then(function (credits) {
            var title = self.elements.spotifyTitleInput.value.trim() || credits.title || spotifyTarget.label || "Spotify Item";
            var artist = self.elements.spotifyArtistInput.value.trim() || credits.artist || "Spotify";
            self.saveSpotifySong({
                url: self.elements.spotifyUrlInput.value.trim(),
                embedUrl: spotifyTarget.embedUrl,
                externalUrl: spotifyTarget.externalUrl,
                title: title,
                artist: artist
            });
        });
    };

    View.prototype.saveSpotifySong = function (song) {
        this.spotifySongs.unshift(song);
        this.activeSpotifyIndex = 0;
        this.saveSpotifySongs();
        this.elements.spotifySongForm.reset();
        this.setSpotifyMessage("Added: " + song.title + " by " + song.artist + (song.embedUrl ? "." : ". Open it in Spotify to play."));
        this.renderSpotifySongs();
    };

    View.prototype.fetchSpotifyCredits = function (url) {
        if (!window.fetch || !url) {
            return Promise.resolve({});
        }
        return window.fetch("https://open.spotify.com/oembed?url=" + encodeURIComponent(url))
            .then(function (response) {
                if (!response.ok) {
                    return {};
                }
                return response.json();
            })
            .then(function (data) {
                return parseSpotifyOembedTitle(data && data.title);
            })
            .catch(function () {
                return {};
            });
    };

    View.prototype.playSpotifySong = function (index) {
        if (index < 0 || index >= this.spotifySongs.length) {
            return;
        }
        this.activeSpotifyIndex = index;
        if (this.music.isPlaying) {
            this.music.stop();
            this.updateMusicButton(false, true);
        }
        this.renderSpotifySongs();
    };

    View.prototype.removeSpotifySong = function (index) {
        if (index < 0 || index >= this.spotifySongs.length) {
            return;
        }
        this.spotifySongs.splice(index, 1);
        if (this.spotifySongs.length === 0) {
            this.activeSpotifyIndex = -1;
        } else if (this.activeSpotifyIndex >= this.spotifySongs.length) {
            this.activeSpotifyIndex = this.spotifySongs.length - 1;
        }
        this.saveSpotifySongs();
        this.renderSpotifySongs();
    };

    View.prototype.renderSpotifySongs = function () {
        var fragment;
        var index;
        var song;
        var card;
        var title;
        var credit;
        var actions;
        var playButton;
        var removeButton;

        this.renderSpotifyPlayer();

        if (!this.elements.spotifySongList) {
            return;
        }

        this.elements.spotifySongList.innerHTML = "";
        if (this.spotifySongs.length === 0) {
            this.setSpotifyMessage("Paste any Spotify link. Credits are filled automatically when Spotify provides metadata.");
            return;
        }

        fragment = document.createDocumentFragment();
        for (index = 0; index < this.spotifySongs.length; index += 1) {
            song = this.spotifySongs[index];
            card = document.createElement("article");
            card.className = "spotify-song-card" + (index === this.activeSpotifyIndex ? " is-active" : "");

            title = document.createElement("strong");
            title.textContent = song.title;
            credit = document.createElement("span");
            credit.textContent = "Credits: " + song.artist;

            actions = document.createElement("div");
            actions.className = "spotify-song-actions";
            playButton = document.createElement("button");
            playButton.className = "spotify-play-button";
            playButton.type = "button";
            playButton.setAttribute("data-song-index", String(index));
            playButton.textContent = index === this.activeSpotifyIndex ? "Playing" : "Play";
            removeButton = document.createElement("button");
            removeButton.className = "spotify-remove-button";
            removeButton.type = "button";
            removeButton.setAttribute("data-song-index", String(index));
            removeButton.textContent = "Remove";
            actions.appendChild(playButton);
            actions.appendChild(removeButton);

            card.appendChild(title);
            card.appendChild(credit);
            card.appendChild(actions);
            fragment.appendChild(card);
        }
        this.elements.spotifySongList.appendChild(fragment);
    };

    View.prototype.renderSpotifyPlayer = function () {
        var song;
        var iframe;
        var credit;
        var externalLink;
        if (!this.elements.spotifyPlayerHost) {
            return;
        }
        this.elements.spotifyPlayerHost.innerHTML = "";
        if (this.activeSpotifyIndex < 0 || this.activeSpotifyIndex >= this.spotifySongs.length) {
            return;
        }
        song = this.spotifySongs[this.activeSpotifyIndex];
        if (song.embedUrl) {
            iframe = document.createElement("iframe");
            iframe.title = "Spotify player for " + song.title;
            iframe.src = song.embedUrl;
            iframe.width = "100%";
            iframe.height = "152";
            iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
            iframe.loading = "lazy";
            this.elements.spotifyPlayerHost.appendChild(iframe);
        } else {
            externalLink = document.createElement("a");
            externalLink.className = "spotify-open-link";
            externalLink.href = song.externalUrl || song.url;
            externalLink.target = "_blank";
            externalLink.rel = "noopener";
            externalLink.textContent = "Open in Spotify";
            this.elements.spotifyPlayerHost.appendChild(externalLink);
        }

        credit = document.createElement("p");
        credit.className = "spotify-active-credit";
        credit.textContent = "Credits: " + song.title + " by " + song.artist + ". Press play in the Spotify player to hear it.";

        this.elements.spotifyPlayerHost.appendChild(credit);
    };

    View.prototype.setSpotifyMessage = function (text) {
        if (this.elements.spotifyMessage) {
            this.elements.spotifyMessage.textContent = text;
        }
    };

    View.prototype.clearCutsceneTimers = function () {
        var index;
        window.clearTimeout(this.cutsceneTimer);
        for (index = 0; index < this.cutsceneStepTimers.length; index += 1) {
            window.clearTimeout(this.cutsceneStepTimers[index]);
        }
        this.cutsceneStepTimers = [];
    };

    View.prototype.resetCutsceneSequence = function () {
        if (this.elements.cutsceneSequence) {
            this.elements.cutsceneSequence.classList.add("hidden");
        }
        if (this.elements.cutscenePhase) {
            this.elements.cutscenePhase.textContent = "";
        }
        if (this.elements.cutsceneMonologue) {
            this.elements.cutsceneMonologue.textContent = "";
        }
    };

    View.prototype.playCutscene = function (milestone) {
        var themeClass;
        var durationMs;
        if (!this.elements.cutsceneOverlay) {
            return;
        }

        this.clearCutsceneTimers();
        this.resetCutsceneSequence();

        durationMs = milestone.durationMs || DEFAULT_CUTSCENE_DURATION_MS;
        themeClass = "theme-" + (milestone.theme || "neon");
        this.elements.cutsceneOverlay.className = "cutscene-overlay hidden";
        this.elements.cutsceneOverlay.removeAttribute("data-mode");
        this.elements.cutsceneOverlay.style.setProperty("--cutscene-duration", durationMs + "ms");
        this.elements.cutsceneOverlay.style.setProperty("--cutscene-meter-duration", Math.max(durationMs - 400, 1000) + "ms");
        void this.elements.cutsceneOverlay.offsetWidth;
        this.elements.cutsceneOverlay.className = "cutscene-overlay " + themeClass;
        this.elements.cutsceneTitle.textContent = milestone.title;
        this.elements.cutsceneSubtitle.textContent = milestone.subtitle;
        if (this.elements.cutsceneValue) {
            this.elements.cutsceneValue.textContent = "Threshold " + safeFormatNumber(milestone.value);
        }
        this.elements.cutsceneOverlay.setAttribute("aria-hidden", "false");

        if (milestone.mode === "finale") {
            this.playFinaleCutscene(milestone, durationMs);
            return;
        }

        this.cutsceneTimer = window.setTimeout(this.hideCutscene.bind(this), durationMs);
    };

    View.prototype.playFinaleCutscene = function (milestone, durationMs) {
        var self = this;
        var index;
        this.elements.cutsceneOverlay.setAttribute("data-mode", "finale");
        if (this.elements.cutsceneSequence) {
            this.elements.cutsceneSequence.classList.remove("hidden");
        }
        for (index = 0; index < FINALE_CUTSCENE_STEPS.length; index += 1) {
            (function (step) {
                self.cutsceneStepTimers.push(window.setTimeout(function () {
                    self.updateCutsceneSequence(step.phase, step.line, step.phase === "Absolute Zenith" ? "Threshold " + safeFormatNumber(milestone.value) : self.elements.cutsceneValue.textContent);
                }, step.at));
            }(FINALE_CUTSCENE_STEPS[index]));
        }
        this.cutsceneTimer = window.setTimeout(this.hideCutscene.bind(this), durationMs);
    };

    View.prototype.updateCutsceneSequence = function (phase, line, valueText) {
        if (this.elements.cutscenePhase) {
            this.elements.cutscenePhase.textContent = phase;
        }
        if (this.elements.cutsceneMonologue) {
            this.elements.cutsceneMonologue.textContent = line;
        }
        if (this.elements.cutsceneSequence) {
            this.elements.cutsceneSequence.classList.remove("hidden");
            this.elements.cutsceneSequence.classList.remove("is-refreshing");
            void this.elements.cutsceneSequence.offsetWidth;
            this.elements.cutsceneSequence.classList.add("is-refreshing");
        }
        if (this.elements.cutsceneValue && valueText) {
            this.elements.cutsceneValue.textContent = valueText;
        }
    };

    View.prototype.hideCutscene = function () {
        if (!this.elements.cutsceneOverlay) {
            return;
        }
        this.elements.cutsceneOverlay.classList.add("hidden");
        this.elements.cutsceneOverlay.setAttribute("aria-hidden", "true");
        this.elements.cutsceneOverlay.removeAttribute("data-mode");
        this.resetCutsceneSequence();
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

    View.prototype.toggleLuckMachine = function () {
        var isHidden = this.elements.luckMachinePanel.classList.contains("hidden");
        this.setLuckMachineOpen(isHidden);
    };

    View.prototype.setLuckMachineOpen = function (isOpen) {
        if (!this.elements.luckMachinePanel || !this.elements.luckMachineButton) {
            return;
        }
        this.elements.luckMachinePanel.classList.toggle("hidden", !isOpen);
        this.elements.luckMachinePanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
        this.elements.luckMachineButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    function padLuckValue(value) {
        var text = String(value);
        while (text.length < 3) {
            text = "0" + text;
        }
        return text;
    }

    function createSpotifyTarget(input) {
        var trimmed = String(input || "").trim();
        var spotifyUriMatch;
        var url;
        var parts;
        var type;
        var id;
        var path;
        var searchText;

        spotifyUriMatch = trimmed.match(/^spotify:(track|album|playlist|artist|episode|show):([A-Za-z0-9]+)$/);
        if (spotifyUriMatch) {
            return {
                embedUrl: "https://open.spotify.com/embed/" + spotifyUriMatch[1] + "/" + spotifyUriMatch[2],
                externalUrl: "https://open.spotify.com/" + spotifyUriMatch[1] + "/" + spotifyUriMatch[2],
                label: "Spotify " + spotifyUriMatch[1]
            };
        }

        try {
            url = new URL(trimmed);
        } catch (error) {
            return null;
        }

        if (url.hostname !== "open.spotify.com" && url.hostname !== "spotify.com" && url.hostname !== "www.spotify.com" && url.hostname !== "spotify.link") {
            return null;
        }

        if (url.hostname === "spotify.link") {
            return {
                embedUrl: "",
                externalUrl: trimmed,
                label: "Spotify Link"
            };
        }

        parts = url.pathname.split("/").filter(Boolean);
        if (parts[0] === "embed") {
            parts.shift();
        }
        if (parts[0] && parts[0].indexOf("intl-") === 0) {
            parts.shift();
        }
        type = parts[0];
        id = parts[1];
        path = parts.join("/");

        if (id && ["track", "album", "playlist", "artist", "episode", "show"].indexOf(type) !== -1) {
            return {
                embedUrl: "https://open.spotify.com/embed/" + type + "/" + id,
                externalUrl: "https://open.spotify.com/" + type + "/" + id,
                label: "Spotify " + type
            };
        }

        if (!path) {
            return null;
        }

        searchText = type === "search" && parts[1] ? decodeURIComponent(parts.slice(1).join(" ")) : "";

        return {
            embedUrl: "",
            externalUrl: "https://open.spotify.com/" + path + (url.search || ""),
            label: searchText || "Spotify Page"
        };
    }

    function parseSpotifyOembedTitle(value) {
        var text = String(value || "").trim();
        var pieces;
        if (!text) {
            return {};
        }
        text = text.replace(/^Spotify\s*-\s*/i, "").trim();
        pieces = text.split(/\s+by\s+/i);
        if (pieces.length > 1) {
            return {
                title: pieces[0].trim(),
                artist: pieces.slice(1).join(" by ").trim()
            };
        }
        return {
            title: text,
            artist: "Spotify"
        };
    }

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
