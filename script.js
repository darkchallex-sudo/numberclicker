(function () {
    "use strict";

    var SAVE_KEY = "number-clicker-engine-v3";
    var SPOTIFY_LIBRARY_KEY = "number-clicker-spotify-songs-v1";
    var COMMENT_ACCOUNT_KEY = "number-clicker-comment-account-v1";
    var COMMENT_LIST_KEY = "number-clicker-comments-v1";
    var MUSIC_VOLUME_KEY = "number-clicker-music-volume-v1";
    var TOTAL_ACHIEVEMENTS = 121;
    var BALDI_PORTAL_INTERVAL_MS = 60 * 1000;
    var BALDI_PORTAL_VISIBLE_MS = 18 * 1000;
    var BAD_WORDS = [
        "fuck",
        "shit",
        "bitch",
        "asshole",
        "bastard",
        "damn",
        "crap",
        "dick",
        "piss",
        "slut",
        "whore"
    ];

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
    var COIN_MACHINE_COST = 1000;
    var CRITICAL_CLICK_CHANCE = 1 / 120;
    var CRITICAL_CLICK_MIN_LUCK = 250;
    var CRITICAL_CLICK_MAX_LUCK = 24000;
    var CRITICAL_CLICK_DURATION_CLICKS = 20;
    var CRITICAL_CLICK_GUARANTEE_MS = 15 * 60 * 1000;
    var BUILT_IN_TRACKS = [
        {
            id: "night-drive",
            name: "Night Drive",
            mood: "lo-fi focus",
            interval: 2200,
            wave: "triangle",
            volume: 0.16,
            filter: 1800,
            delay: 0.28,
            delayGain: 0.16,
            chords: [
                [196.00, 246.94, 293.66, 369.99],
                [174.61, 220.00, 261.63, 329.63],
                [207.65, 261.63, 311.13, 392.00],
                [164.81, 207.65, 246.94, 329.63]
            ],
            lead: [392.00, 493.88, 440.00, 369.99, 392.00, 587.33]
        },
        {
            id: "crystal-rain",
            name: "Crystal Rain",
            mood: "soft calm",
            interval: 3000,
            wave: "sine",
            volume: 0.14,
            filter: 1500,
            delay: 0.42,
            delayGain: 0.22,
            chords: [
                [261.63, 329.63, 392.00, 493.88],
                [220.00, 293.66, 349.23, 440.00],
                [246.94, 311.13, 392.00, 466.16],
                [196.00, 261.63, 329.63, 392.00]
            ],
            lead: [659.25, 587.33, 493.88, 523.25, 440.00]
        },
        {
            id: "neon-peak",
            name: "Neon Peak",
            mood: "peak energy",
            interval: 1650,
            wave: "sawtooth",
            volume: 0.12,
            filter: 2400,
            delay: 0.2,
            delayGain: 0.12,
            chords: [
                [130.81, 196.00, 261.63, 329.63],
                [146.83, 220.00, 293.66, 369.99],
                [164.81, 246.94, 329.63, 415.30],
                [123.47, 185.00, 246.94, 311.13]
            ],
            lead: [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880.00]
        },
        {
            id: "deep-space",
            name: "Deep Space",
            mood: "ambient",
            interval: 3800,
            wave: "sine",
            volume: 0.15,
            filter: 1100,
            delay: 0.55,
            delayGain: 0.26,
            chords: [
                [146.83, 220.00, 277.18, 369.99],
                [164.81, 246.94, 311.13, 415.30],
                [138.59, 207.65, 261.63, 349.23],
                [185.00, 277.18, 349.23, 466.16]
            ],
            lead: [554.37, 466.16, 415.30, 622.25]
        }
    ];
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
        },
        {
            id: "nebula-potion",
            name: "Nebula Potion",
            cost: 420000,
            luck: 750000,
            durationClicks: 8,
            singleUse: false,
            permanent: false,
            unlockRolls: 12000,
            maxPurchases: 999999,
            description: "Adds +750,000 luck for 8 clicks."
        },
        {
            id: "eclipse-potion",
            name: "Eclipse Potion",
            cost: 1600000,
            luck: 12000000,
            durationClicks: 5,
            singleUse: false,
            permanent: false,
            unlockRolls: 35000,
            maxPurchases: 999999,
            description: "Adds +12,000,000 luck for 5 clicks."
        },
        {
            id: "zenith-shatter-potion",
            name: "Zenith Shatter Potion",
            cost: 4200000,
            luck: 50000000,
            durationClicks: 3,
            singleUse: false,
            permanent: false,
            unlockRolls: 75000,
            maxPurchases: 999999,
            description: "Adds +50,000,000 luck for 3 clicks."
        }
    ].concat(createQuadPotions(), createHundredRollPotions());

    var CUTSCENE_MILESTONES = createCutsceneMilestones();
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
        },
        {
            id: "rare-baldi-escape",
            name: "Baldi Escape",
            description: "Beat the red button's Baldi's Basics challenge and return to Number Clicker.",
            unlockedBy: function (state) {
                return !!state.baldiBasicsBeaten;
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

    function createHundredRollPotions() {
        return [
            { id: "hundred-roll-potion-1", name: "Hundred Burst I", cost: 10000, luck: 0, luckMultiplier: 1, rollsPerClick: 100, durationClicks: 100, singleUse: false, permanent: false, unlockRolls: 5000, maxPurchases: 999999, description: "Turns one press into 100 rolls for 100 clicks." },
            { id: "hundred-roll-potion-2", name: "Hundred Burst II", cost: 12500, luck: 0, luckMultiplier: 1, rollsPerClick: 100, durationClicks: 350, singleUse: false, permanent: false, unlockRolls: 7500, maxPurchases: 999999, description: "Turns one press into 100 rolls for 350 clicks." },
            { id: "hundred-roll-potion-3", name: "Hundred Burst III", cost: 15000, luck: 0, luckMultiplier: 1, rollsPerClick: 100, durationClicks: 750, singleUse: false, permanent: false, unlockRolls: 10000, maxPurchases: 999999, description: "Turns one press into 100 rolls for 750 clicks." }
        ];
    }

    function createCutsceneMilestones() {
        var special = {
            10000: { title: "Neon Surge", subtitle: "The screen bends for the first real threshold.", theme: "neon", durationMs: 7600 },
            50000: { title: "Sky Splitter", subtitle: "Color pressure starts tearing through the calm.", theme: "neon", durationMs: 7600 },
            100000: { title: "Velocity Crown", subtitle: "Your clicks stop feeling local.", theme: "neon", durationMs: 7800 },
            500000: { title: "Solar Tremor", subtitle: "The atmosphere gives up and starts glowing.", theme: "solar", durationMs: 7800 },
            1000000: { title: "Radiant Collapse", subtitle: "A million numbers is enough to distort the room.", theme: "solar", durationMs: 8000 },
            5000000: { title: "Prism Rift", subtitle: "Everything picks a brighter color and stays there.", theme: "solar", durationMs: 8200 },
            10000000: { title: "Aurora Engine", subtitle: "The game finally looks like it knows your name.", theme: "cosmic", durationMs: 8400 },
            50000000: { title: "Celestial Overdrive", subtitle: "This is no longer a button. It is an event.", theme: "cosmic", durationMs: 8600 },
            100000000: { title: "Chromatic Tempest", subtitle: "Pure saturation. Pure noise. Pure momentum.", theme: "cosmic", durationMs: 9000 },
            500000000: { title: "Thunder Bloom", subtitle: "The cutscene has stopped asking for permission.", theme: "apex", durationMs: 9800 },
            1000000000: { title: "Apex Corona", subtitle: "You reached the billion line and the world noticed.", theme: "apex", durationMs: 11000 },
            5000000000: { title: "Absolute Zenith", subtitle: "Five billion does not arrive. It tears the sky open.", theme: "apex", mode: "finale", durationMs: 50000 }
        };
        var milestones = [];
        var index;
        var value;
        var data;

        for (index = 0; index < NUMBER_MILESTONES.length; index += 1) {
            value = NUMBER_MILESTONES[index];
            if (value < 10000 || value > 5000000000) {
                continue;
            }
            data = special[value] || {
                title: safeFormatNumber(value) + " Fracture",
                subtitle: "Another threshold hits hard enough to crack the screen.",
                theme: getCutsceneTheme(value),
                durationMs: getCutsceneDuration(value)
            };
            milestones.push({
                value: value,
                title: data.title,
                subtitle: data.subtitle,
                theme: data.theme,
                mode: data.mode,
                durationMs: data.durationMs
            });
        }

        return milestones;
    }

    function getCutsceneTheme(value) {
        if (value >= 500000000) {
            return "apex";
        }
        if (value >= 10000000) {
            return "cosmic";
        }
        if (value >= 500000) {
            return "solar";
        }
        return "neon";
    }

    function getCutsceneDuration(value) {
        if (value >= 1000000000) {
            return 11000;
        }
        if (value >= 100000000) {
            return 9200;
        }
        if (value >= 10000000) {
            return 8600;
        }
        if (value >= 1000000) {
            return 8200;
        }
        return 7600;
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
            lastCriticalClickAt: 0,
            recentCutsceneTimestamps: [],
            cutsceneChainCount: 0,
            highestTemporaryLuck: 0,
            baldiBasicsBeaten: false,
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
                lastCriticalClickAt: typeof parsed.lastCriticalClickAt === "number" ? parsed.lastCriticalClickAt : fallback.lastCriticalClickAt,
                recentCutsceneTimestamps: Array.isArray(parsed.recentCutsceneTimestamps) ? parsed.recentCutsceneTimestamps : [],
                cutsceneChainCount: typeof parsed.cutsceneChainCount === "number" ? parsed.cutsceneChainCount : fallback.cutsceneChainCount,
                highestTemporaryLuck: typeof parsed.highestTemporaryLuck === "number" ? parsed.highestTemporaryLuck : fallback.highestTemporaryLuck,
                baldiBasicsBeaten: !!parsed.baldiBasicsBeaten,
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

    StorageAdapter.prototype.clear = function () {
        var storage = this.getStorage();
        if (!storage) {
            return false;
        }

        try {
            storage.removeItem(this.key);
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
            luckSpin: [],
            coinSpin: [],
            criticalClick: []
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
        this.tryCriticalClick();

        this.recomputePower();
        this.unlockAchievements();
        this.triggerCutscenes();
        this.lastSaveSucceeded = this.storage.save(this.state);
        this.emit("update", this.getSnapshot());
    };

    NumberEngine.prototype.tryCriticalClick = function () {
        var luckBoost;
        var now = Date.now();
        var lastCriticalAt = this.state.lastCriticalClickAt || this.state.sessionStartAt || now;
        var guaranteed = now - lastCriticalAt >= CRITICAL_CLICK_GUARANTEE_MS;
        if (!guaranteed && Math.random() > CRITICAL_CLICK_CHANCE) {
            return;
        }
        luckBoost = this.randomInt(CRITICAL_CLICK_MIN_LUCK, CRITICAL_CLICK_MAX_LUCK);
        this.state.lastCriticalClickAt = now;
        this.state.activeBoosts.push({
            id: "critical-click-" + now + "-" + this.randomInt(1000, 9999),
            luck: luckBoost,
            luckMultiplier: 1,
            remaining: CRITICAL_CLICK_DURATION_CLICKS,
            name: "Critical Click",
            rollsPerClick: 1
        });
        if (this.getTotalLuck() > this.state.highestTemporaryLuck) {
            this.state.highestTemporaryLuck = this.getTotalLuck();
        }
        this.emit("criticalClick", {
            luck: luckBoost,
            durationClicks: CRITICAL_CLICK_DURATION_CLICKS
        });
        this.emit("toast", {
            name: "Critical Click",
            description: "+" + safeFormatNumber(luckBoost) + " luck for " + safeFormatNumber(CRITICAL_CLICK_DURATION_CLICKS) + " clicks."
        });
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

    NumberEngine.prototype.spinCoinMachine = function () {
        var value = this.randomInt(0, 999);
        var positive = this.randomInt(0, 1) === 1;
        var delta = positive ? value : -value;
        var coinsBefore;
        var coinsAfter;

        if (this.state.permanentLuck < COIN_MACHINE_COST) {
            this.emit("toast", {
                name: "Insufficient luck",
                description: "The Coin Machine costs " + safeFormatNumber(COIN_MACHINE_COST) + " permanent luck."
            });
            this.emit("update", this.getSnapshot());
            return;
        }

        coinsBefore = this.state.coins;
        coinsAfter = Math.max(0, coinsBefore + delta);
        this.state.permanentLuck -= COIN_MACHINE_COST;
        this.state.coins = coinsAfter;
        this.lastSaveSucceeded = this.storage.save(this.state);
        this.emit("coinSpin", {
            value: value,
            delta: coinsAfter - coinsBefore,
            positive: positive,
            coinsAfter: this.state.coins,
            luckAfter: this.state.permanentLuck
        });
        this.emit("toast", {
            name: positive ? "Green Coin Hit" : "Red Coin Hit",
            description: (coinsAfter - coinsBefore >= 0 ? "+" : "") + safeFormatNumber(coinsAfter - coinsBefore) + " coins. " + safeFormatNumber(COIN_MACHINE_COST) + " permanent luck spent."
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

    NumberEngine.prototype.resetGame = function () {
        this.storage.clear();
        this.state = createDefaultState();
        this.ensureBoosterShape();
        this.recomputePower();
        this.lastSaveSucceeded = this.storage.save(this.state);
        this.emit("toast", {
            name: "Progress Reset",
            description: "Your number, coins, boosters, rolls, finds, and achievements were reset."
        });
        this.emit("update", this.getSnapshot());
    };

    NumberEngine.prototype.completeBaldiChallenge = function () {
        this.state.baldiBasicsBeaten = true;
        this.unlockAchievements();
        this.lastSaveSucceeded = this.storage.save(this.state);
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
            coinMachineCost: COIN_MACHINE_COST,
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
        this.track = BUILT_IN_TRACKS[0];
        this.volume = 0.7;
    }

    CalmMusicPlayer.prototype.getOutputVolume = function () {
        return this.track.volume * this.volume;
    };

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

            this.master.gain.value = this.getOutputVolume();
            this.filter.type = "lowpass";
            this.filter.frequency.value = this.track.filter;
            this.delay.delayTime.value = this.track.delay;
            this.delayGain.gain.value = this.track.delayGain;

            this.filter.connect(this.master);
            this.filter.connect(this.delay);
            this.delay.connect(this.delayGain);
            this.delayGain.connect(this.master);
            this.master.connect(this.context.destination);
        }
        return true;
    };

    CalmMusicPlayer.prototype.setTrack = function (trackId) {
        var index;
        for (index = 0; index < BUILT_IN_TRACKS.length; index += 1) {
            if (BUILT_IN_TRACKS[index].id === trackId) {
                this.track = BUILT_IN_TRACKS[index];
                this.step = 0;
                if (this.context) {
                    this.filter.frequency.setTargetAtTime(this.track.filter, this.context.currentTime, 0.2);
                    this.delay.delayTime.setTargetAtTime(this.track.delay, this.context.currentTime, 0.2);
                    this.delayGain.gain.setTargetAtTime(this.track.delayGain, this.context.currentTime, 0.2);
                    this.master.gain.setTargetAtTime(this.getOutputVolume(), this.context.currentTime, 0.2);
                }
                return;
            }
        }
    };

    CalmMusicPlayer.prototype.setVolume = function (volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.master && this.context && this.isPlaying) {
            this.master.gain.setTargetAtTime(this.getOutputVolume(), this.context.currentTime, 0.08);
        }
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
        }, this.track.interval);
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
        chord = this.track.chords[this.step % this.track.chords.length];
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setTargetAtTime(this.getOutputVolume(), now, 0.3);

        for (index = 0; index < chord.length; index += 1) {
            this.playTone(chord[index], now + index * 0.035, this.track.interval / 1000 + 0.45, index === 0 ? 0.22 : 0.13, this.track.wave);
        }
        this.playTone(this.track.lead[this.step % this.track.lead.length], now + 0.5, 0.48, 0.07, this.track.wave);
        this.playTone(this.track.lead[(this.step + 2) % this.track.lead.length], now + 1.05, 0.42, 0.055, this.track.wave);
        this.playTone(chord[0] / 2, now + 0.08, 0.22, 0.12, "square");
        this.step += 1;
    };

    CalmMusicPlayer.prototype.playTone = function (frequency, startAt, duration, level, wave) {
        var oscillator = this.context.createOscillator();
        var gain = this.context.createGain();
        oscillator.type = wave || "sine";
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

    function UISoundPlayer() {
        this.context = null;
        this.master = null;
        this.volume = 0.7;
    }

    UISoundPlayer.prototype.ensureContext = function () {
        var AudioContextRef = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextRef) {
            return false;
        }
        if (!this.context) {
            this.context = new AudioContextRef();
            this.master = this.context.createGain();
            this.master.gain.value = 0.18 * this.volume;
            this.master.connect(this.context.destination);
        }
        if (this.context.state === "suspended") {
            this.context.resume();
        }
        return true;
    };

    UISoundPlayer.prototype.setVolume = function (volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.master && this.context) {
            this.master.gain.setTargetAtTime(0.18 * this.volume, this.context.currentTime, 0.08);
        }
    };

    UISoundPlayer.prototype.playHover = function () {
        this.playTone(740, 0.045, 0.025, "sine");
    };

    UISoundPlayer.prototype.playClick = function () {
        this.playTone(360, 0.055, 0.06, "square");
        this.playTone(220, 0.075, 0.035, "triangle");
    };

    UISoundPlayer.prototype.playTone = function (frequency, duration, level, wave) {
        var now;
        var oscillator;
        var gain;
        if (!this.ensureContext()) {
            return;
        }
        now = this.context.currentTime;
        oscillator = this.context.createOscillator();
        gain = this.context.createGain();
        oscillator.type = wave;
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(level, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        oscillator.connect(gain);
        gain.connect(this.master);
        oscillator.start(now);
        oscillator.stop(now + duration + 0.02);
    };

    function View(engine) {
        this.engine = engine;
        this.elements = {};
        this.music = new CalmMusicPlayer();
        this.uiSounds = new UISoundPlayer();
        this.savedVolume = this.loadMusicVolume();
        this.music.setVolume(this.savedVolume);
        this.uiSounds.setVolume(this.savedVolume);
        this.spotifySongs = this.loadSpotifySongs();
        this.commentAccount = this.loadCommentAccount();
        this.comments = this.loadComments();
        this.activeSpotifyIndex = this.spotifySongs.length > 0 ? 0 : -1;
        this.adminSequence = "pplleeaasseeaaddmmiinn";
        this.adminBuffer = "";
        this.cutsceneTimer = null;
        this.cutsceneStepTimers = [];
        this.saveTimer = null;
        this.luckSpinTimer = null;
        this.luckSpinInterval = null;
        this.coinSpinTimer = null;
        this.coinSpinInterval = null;
        this.hoveredButton = null;
        this.portalTimer = null;
        this.portalHideTimer = null;
        this.baldiChallenge = null;
    }

    View.prototype.cache = function () {
        this.elements.numberWrap = document.querySelector(".number-display, .number-wrap");
        this.elements.numberValue = document.getElementById("numberValue");
        this.elements.button = document.getElementById("clickButton");
        this.elements.resetButton = document.getElementById("resetButton");
        this.elements.backpackButton = document.getElementById("backpackButton");
        this.elements.backpackPanel = document.getElementById("backpackPanel");
        this.elements.closeBackpackButton = document.getElementById("closeBackpackButton");
        this.elements.luckMachineButton = document.getElementById("luckMachineButton");
        this.elements.luckMachinePanel = document.getElementById("luckMachinePanel");
        this.elements.closeLuckMachineButton = document.getElementById("closeLuckMachineButton");
        this.elements.coinMachineButton = document.getElementById("coinMachineButton");
        this.elements.coinMachinePanel = document.getElementById("coinMachinePanel");
        this.elements.closeCoinMachineButton = document.getElementById("closeCoinMachineButton");
        this.elements.musicToggleButton = document.getElementById("musicToggleButton");
        this.elements.musicToggleText = document.getElementById("musicToggleText");
        this.elements.musicPanel = document.getElementById("musicPanel");
        this.elements.closeMusicPanelButton = document.getElementById("closeMusicPanelButton");
        this.elements.musicVolumeInput = document.getElementById("musicVolumeInput");
        this.elements.musicVolumeValue = document.getElementById("musicVolumeValue");
        this.elements.codingTutorialButton = document.getElementById("codingTutorialButton");
        this.elements.codingTutorialPanel = document.getElementById("codingTutorialPanel");
        this.elements.closeCodingTutorialButton = document.getElementById("closeCodingTutorialButton");
        this.elements.calmMusicButton = document.getElementById("calmMusicButton");
        this.elements.builtInTrackList = document.getElementById("builtInTrackList");
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
        this.elements.coinMachineCabinet = document.getElementById("coinMachineCabinet");
        this.elements.coinSpinButton = document.getElementById("coinSpinButton");
        this.elements.coinReelA = document.getElementById("coinReelA");
        this.elements.coinReelB = document.getElementById("coinReelB");
        this.elements.coinReelC = document.getElementById("coinReelC");
        this.elements.coinSpinResult = document.getElementById("coinSpinResult");
        this.elements.coinSpinDelta = document.getElementById("coinSpinDelta");
        this.elements.coinMachineNote = document.getElementById("coinMachineNote");
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
        this.elements.commentAccountStatus = document.getElementById("commentAccountStatus");
        this.elements.commentSignOutButton = document.getElementById("commentSignOutButton");
        this.elements.commentAuthPanel = document.getElementById("commentAuthPanel");
        this.elements.googleAccountButton = document.getElementById("googleAccountButton");
        this.elements.googleNameInput = document.getElementById("googleNameInput");
        this.elements.emailAccountForm = document.getElementById("emailAccountForm");
        this.elements.commentNameInput = document.getElementById("commentNameInput");
        this.elements.commentEmailInput = document.getElementById("commentEmailInput");
        this.elements.commentForm = document.getElementById("commentForm");
        this.elements.commentInput = document.getElementById("commentInput");
        this.elements.commentList = document.getElementById("commentList");
        this.elements.toastHost = document.getElementById("toastHost");
        this.elements.baldiPortalButton = document.getElementById("baldiPortalButton");
        this.elements.baldiOverlay = document.getElementById("baldiOverlay");
        this.elements.baldiTitle = document.getElementById("baldiTitle");
        this.elements.baldiQuestion = document.getElementById("baldiQuestion");
        this.elements.baldiAnswerForm = document.getElementById("baldiAnswerForm");
        this.elements.baldiAnswerInput = document.getElementById("baldiAnswerInput");
        this.elements.baldiProgressFill = document.getElementById("baldiProgressFill");
        this.elements.baldiStatus = document.getElementById("baldiStatus");
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

        // Disable right-click on the entire page
        document.addEventListener("contextmenu", function (event) {
            event.preventDefault();
        });

        document.addEventListener("pointerover", function (event) {
            self.handleButtonHover(event);
        });

        document.addEventListener("pointerout", function (event) {
            self.handleButtonLeave(event);
        });

        document.addEventListener("click", function (event) {
            self.handleButtonSoundClick(event);
        }, true);

        if (this.elements.button) {
            this.elements.button.addEventListener("click", function () {
                self.engine.click();
                self.pulseNumber();
            });
        }

        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener("click", function () {
                self.confirmResetProgress();
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

        if (this.elements.coinMachineButton) {
            this.elements.coinMachineButton.addEventListener("click", function () {
                self.toggleCoinMachine();
            });
        }

        if (this.elements.closeCoinMachineButton) {
            this.elements.closeCoinMachineButton.addEventListener("click", function () {
                self.setCoinMachineOpen(false);
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

        if (this.elements.coinSpinButton) {
            this.elements.coinSpinButton.addEventListener("click", function () {
                if (self.elements.coinSpinButton.disabled) {
                    return;
                }
                self.engine.spinCoinMachine();
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

        if (this.elements.codingTutorialButton) {
            this.elements.codingTutorialButton.addEventListener("click", function () {
                self.toggleCodingTutorial();
            });
        }

        if (this.elements.closeCodingTutorialButton) {
            this.elements.closeCodingTutorialButton.addEventListener("click", function () {
                self.setCodingTutorialOpen(false);
            });
        }

        if (this.elements.calmMusicButton) {
            this.elements.calmMusicButton.addEventListener("click", function () {
                self.toggleMusic();
            });
        }

        if (this.elements.musicVolumeInput) {
            this.elements.musicVolumeInput.addEventListener("input", function () {
                self.setMusicVolume(Number(self.elements.musicVolumeInput.value) / 100);
            });
        }

        if (this.elements.builtInTrackList) {
            this.elements.builtInTrackList.addEventListener("click", function (event) {
                var button = event.target && event.target.closest ? event.target.closest("[data-track-id]") : null;
                if (!button) {
                    return;
                }
                self.selectBuiltInTrack(button.getAttribute("data-track-id"));
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

        if (this.elements.googleAccountButton) {
            this.elements.googleAccountButton.addEventListener("click", function () {
                self.createCommentAccount(self.elements.googleNameInput.value, "google-local@numberclicker.local", "google");
            });
        }

        if (this.elements.emailAccountForm) {
            this.elements.emailAccountForm.addEventListener("submit", function (event) {
                event.preventDefault();
                self.createCommentAccount(self.elements.commentNameInput.value, self.elements.commentEmailInput.value, "email");
            });
        }

        if (this.elements.commentSignOutButton) {
            this.elements.commentSignOutButton.addEventListener("click", function () {
                self.signOutCommentAccount();
            });
        }

        if (this.elements.commentForm) {
            this.elements.commentForm.addEventListener("submit", function (event) {
                event.preventDefault();
                self.postComment();
            });
        }

        if (this.elements.baldiPortalButton) {
            this.elements.baldiPortalButton.addEventListener("click", function () {
                self.openBaldiChallenge();
            });
        }

        if (this.elements.baldiAnswerForm) {
            this.elements.baldiAnswerForm.addEventListener("submit", function (event) {
                event.preventDefault();
                self.submitBaldiAnswer();
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

        this.engine.on("coinSpin", function (result) {
            self.playCoinSpin(result);
        });

        this.engine.on("criticalClick", function (result) {
            self.playCriticalImpact(result);
        });

        this.renderBuiltInTracks();
        this.renderSpotifySongs();
        this.renderComments();
        this.renderMusicVolume();
        this.scheduleBaldiPortal();
    };

    View.prototype.loadMusicVolume = function () {
        var storage;
        var raw;
        var value;
        try {
            storage = window.localStorage;
            raw = storage.getItem(MUSIC_VOLUME_KEY);
            value = raw === null ? 0.7 : Number(raw);
            return isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.7;
        } catch (error) {
            return 0.7;
        }
    };

    View.prototype.saveMusicVolume = function () {
        try {
            window.localStorage.setItem(MUSIC_VOLUME_KEY, String(this.savedVolume));
        } catch (error) {
            return false;
        }
        return true;
    };

    View.prototype.setMusicVolume = function (volume) {
        this.savedVolume = Math.max(0, Math.min(1, volume));
        this.music.setVolume(this.savedVolume);
        this.uiSounds.setVolume(this.savedVolume);
        this.saveMusicVolume();
        this.renderMusicVolume();
    };

    View.prototype.renderMusicVolume = function () {
        var percent = Math.round(this.savedVolume * 100);
        if (this.elements.musicVolumeInput) {
            this.elements.musicVolumeInput.value = String(percent);
        }
        if (this.elements.musicVolumeValue) {
            this.elements.musicVolumeValue.textContent = percent + "%";
        }
    };

    View.prototype.scheduleBaldiPortal = function () {
        var self = this;
        window.clearTimeout(this.portalTimer);
        this.portalTimer = window.setTimeout(function () {
            self.showBaldiPortal();
        }, BALDI_PORTAL_INTERVAL_MS);
    };

    View.prototype.showBaldiPortal = function () {
        var button = this.elements.baldiPortalButton;
        var maxLeft;
        var maxTop;
        if (!button) {
            return;
        }
        maxLeft = Math.max(24, window.innerWidth - 104);
        maxTop = Math.max(90, window.innerHeight - 124);
        button.style.left = this.randomPixel(18, maxLeft) + "px";
        button.style.top = this.randomPixel(72, maxTop) + "px";
        button.classList.remove("hidden");
        window.clearTimeout(this.portalHideTimer);
        this.portalHideTimer = window.setTimeout(this.hideBaldiPortal.bind(this), BALDI_PORTAL_VISIBLE_MS);
        this.scheduleBaldiPortal();
    };

    View.prototype.hideBaldiPortal = function () {
        if (this.elements.baldiPortalButton) {
            this.elements.baldiPortalButton.classList.add("hidden");
        }
        window.clearTimeout(this.portalHideTimer);
        this.portalHideTimer = null;
    };

    View.prototype.randomPixel = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    View.prototype.openBaldiChallenge = function () {
        this.hideBaldiPortal();
        this.baldiChallenge = {
            current: 0,
            needed: 3,
            mistakes: 0,
            maxMistakes: 3,
            answer: 0
        };
        if (this.elements.baldiOverlay) {
            this.elements.baldiOverlay.classList.remove("hidden");
            this.elements.baldiOverlay.setAttribute("aria-hidden", "false");
        }
        this.nextBaldiQuestion();
    };

    View.prototype.nextBaldiQuestion = function () {
        var left;
        var right;
        var operator;
        var ops = ["+", "-", "x"];
        if (!this.baldiChallenge) {
            return;
        }
        left = this.randomPixel(2, 12);
        right = this.randomPixel(1, 9);
        operator = ops[this.randomPixel(0, ops.length - 1)];
        if (operator === "+") {
            this.baldiChallenge.answer = left + right;
        } else if (operator === "-") {
            this.baldiChallenge.answer = left - right;
        } else {
            this.baldiChallenge.answer = left * right;
        }
        if (this.elements.baldiTitle) {
            this.elements.baldiTitle.textContent = "Notebook " + (this.baldiChallenge.current + 1);
        }
        if (this.elements.baldiQuestion) {
            this.elements.baldiQuestion.textContent = left + " " + operator + " " + right + " = ?";
        }
        if (this.elements.baldiAnswerInput) {
            this.elements.baldiAnswerInput.value = "";
            this.elements.baldiAnswerInput.focus();
        }
        this.renderBaldiChallenge("Solve it before Baldi catches up.");
    };

    View.prototype.submitBaldiAnswer = function () {
        var value;
        if (!this.baldiChallenge || !this.elements.baldiAnswerInput) {
            return;
        }
        value = Number(this.elements.baldiAnswerInput.value);
        if (value === this.baldiChallenge.answer) {
            this.baldiChallenge.current += 1;
            if (this.baldiChallenge.current >= this.baldiChallenge.needed) {
                this.winBaldiChallenge();
                return;
            }
            this.nextBaldiQuestion();
            return;
        }
        this.baldiChallenge.mistakes += 1;
        if (this.baldiChallenge.mistakes >= this.baldiChallenge.maxMistakes) {
            this.loseBaldiChallenge();
            return;
        }
        this.renderBaldiChallenge("Wrong. The ruler meter moved.");
        this.elements.baldiAnswerInput.value = "";
        this.elements.baldiAnswerInput.focus();
    };

    View.prototype.renderBaldiChallenge = function (message) {
        var challenge = this.baldiChallenge;
        var ratio;
        if (!challenge) {
            return;
        }
        ratio = challenge.mistakes / challenge.maxMistakes;
        if (this.elements.baldiProgressFill) {
            this.elements.baldiProgressFill.style.width = Math.round(ratio * 100) + "%";
        }
        if (this.elements.baldiStatus) {
            this.elements.baldiStatus.textContent =
                (challenge.needed - challenge.current) + " notebook" + (challenge.needed - challenge.current === 1 ? "" : "s") +
                " left. " + message;
        }
    };

    View.prototype.winBaldiChallenge = function () {
        if (this.elements.baldiOverlay) {
            this.elements.baldiOverlay.classList.add("hidden");
            this.elements.baldiOverlay.setAttribute("aria-hidden", "true");
        }
        this.baldiChallenge = null;
        this.engine.completeBaldiChallenge();
        this.engine.emit("toast", {
            name: "Returned From Baldi's Basics",
            description: "You beat the challenge and returned to Number Clicker."
        });
    };

    View.prototype.loseBaldiChallenge = function () {
        if (this.elements.baldiTitle) {
            this.elements.baldiTitle.textContent = "Caught";
        }
        if (this.elements.baldiQuestion) {
            this.elements.baldiQuestion.textContent = "Baldi caught you. Returning to Number Clicker.";
        }
        this.renderBaldiChallenge("Try the red button again when it appears.");
        window.setTimeout(this.closeBaldiChallenge.bind(this), 1400);
    };

    View.prototype.closeBaldiChallenge = function () {
        if (this.elements.baldiOverlay) {
            this.elements.baldiOverlay.classList.add("hidden");
            this.elements.baldiOverlay.setAttribute("aria-hidden", "true");
        }
        this.baldiChallenge = null;
    };

    View.prototype.getEventButton = function (event) {
        if (!event.target || !event.target.closest) {
            return null;
        }
        return event.target.closest("button");
    };

    View.prototype.handleButtonHover = function (event) {
        var button = this.getEventButton(event);
        if (!button || button.disabled || button === this.hoveredButton) {
            return;
        }
        this.hoveredButton = button;
        this.uiSounds.playHover();
    };

    View.prototype.handleButtonLeave = function (event) {
        var button = this.getEventButton(event);
        if (!button || button !== this.hoveredButton) {
            return;
        }
        if (event.relatedTarget && button.contains(event.relatedTarget)) {
            return;
        }
        this.hoveredButton = null;
    };

    View.prototype.handleButtonSoundClick = function (event) {
        var button = this.getEventButton(event);
        if (!button || button.disabled) {
            return;
        }
        this.uiSounds.playClick();
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

    View.prototype.confirmResetProgress = function () {
        if (!window.confirm("Warning 1: Resetting will delete your saved progress on this device. Continue?")) {
            return;
        }
        if (!window.confirm("Warning 2: This cannot be undone. Reset everything now?")) {
            return;
        }
        this.engine.resetGame();
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

        if (this.elements.coinSpinButton && !this.elements.coinSpinButton.classList.contains("is-spinning")) {
            this.elements.coinSpinButton.disabled = snapshot.permanentLuck < snapshot.coinMachineCost;
            this.elements.coinSpinButton.textContent = snapshot.permanentLuck < snapshot.coinMachineCost
                ? "Insufficient luck"
                : "Spin for " + safeFormatNumber(snapshot.coinMachineCost) + " luck";
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

    View.prototype.playCriticalImpact = function (result) {
        var frame = document.createElement("div");
        var title = document.createElement("strong");
        var detail = document.createElement("span");

        frame.className = "critical-impact-frame";
        frame.setAttribute("aria-hidden", "true");
        title.textContent = "CRITICAL CLICK";
        detail.textContent = "+" + safeFormatNumber(result.luck) + " luck";

        frame.appendChild(title);
        frame.appendChild(detail);
        document.body.appendChild(frame);

        window.setTimeout(function () {
            if (frame.parentNode) {
                frame.parentNode.removeChild(frame);
            }
        }, 4000);
    };

    View.prototype.loadCommentAccount = function () {
        var raw;
        try {
            raw = window.localStorage.getItem(COMMENT_ACCOUNT_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    };

    View.prototype.saveCommentAccount = function () {
        try {
            if (this.commentAccount) {
                window.localStorage.setItem(COMMENT_ACCOUNT_KEY, JSON.stringify(this.commentAccount));
            } else {
                window.localStorage.removeItem(COMMENT_ACCOUNT_KEY);
            }
        } catch (error) {
            return false;
        }
        return true;
    };

    View.prototype.loadComments = function () {
        var raw;
        var parsed;
        try {
            raw = window.localStorage.getItem(COMMENT_LIST_KEY);
            if (!raw) {
                return [];
            }
            parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.slice(0, 80) : [];
        } catch (error) {
            return [];
        }
    };

    View.prototype.saveComments = function () {
        try {
            window.localStorage.setItem(COMMENT_LIST_KEY, JSON.stringify(this.comments.slice(0, 80)));
        } catch (error) {
            return false;
        }
        return true;
    };

    View.prototype.createCommentAccount = function (name, email, provider) {
        var cleanName = this.censorText(String(name || "").trim()).replace(/\s+/g, " ").slice(0, 18);
        var cleanEmail = String(email || "").trim().slice(0, 80);
        if (!cleanName) {
            this.showToast({
                name: "Username needed",
                description: "Choose a username before signing in."
            });
            return;
        }
        if (provider !== "google" && cleanEmail.indexOf("@") === -1) {
            this.showToast({
                name: "Account needed",
                description: "Enter a valid email to create a local chat account."
            });
            return;
        }
        this.commentAccount = {
            name: cleanName,
            email: provider === "google" ? "google-local@numberclicker.local" : cleanEmail,
            provider: provider,
            createdAt: Date.now()
        };
        this.saveCommentAccount();
        this.renderComments();
    };

    View.prototype.signOutCommentAccount = function () {
        this.commentAccount = null;
        this.saveCommentAccount();
        this.renderComments();
    };

    View.prototype.postComment = function () {
        var text;
        if (!this.commentAccount) {
            this.showToast({
                name: "Sign in required",
                description: "Create an account before posting comments."
            });
            return;
        }
        text = this.censorText(String(this.elements.commentInput.value || "").trim()).slice(0, 220);
        if (!text) {
            return;
        }
        this.comments.unshift({
            id: Date.now() + "-" + Math.floor(Math.random() * 10000),
            author: this.commentAccount.name,
            provider: this.commentAccount.provider,
            text: text,
            createdAt: Date.now()
        });
        this.comments = this.comments.slice(0, 80);
        this.saveComments();
        this.elements.commentInput.value = "";
        this.renderComments();
    };

    View.prototype.censorText = function (value) {
        var filtered = String(value || "");
        var index;
        var pattern;
        for (index = 0; index < BAD_WORDS.length; index += 1) {
            pattern = new RegExp("\\b" + BAD_WORDS[index] + "\\b", "gi");
            filtered = filtered.replace(pattern, function (match) {
                return match.charAt(0) + "*".repeat(Math.max(2, match.length - 1));
            });
        }
        return filtered;
    };

    View.prototype.renderComments = function () {
        var fragment;
        var index;
        var comment;
        var article;
        var meta;
        var author;
        var time;
        var body;
        if (this.elements.commentAccountStatus) {
            this.elements.commentAccountStatus.textContent = this.commentAccount
                ? "Signed in as " + this.commentAccount.name
                : "Sign in to chat";
        }
        if (this.elements.commentAuthPanel) {
            this.elements.commentAuthPanel.classList.toggle("hidden", !!this.commentAccount);
        }
        if (this.elements.commentForm) {
            this.elements.commentForm.classList.toggle("hidden", !this.commentAccount);
        }
        if (this.elements.commentSignOutButton) {
            this.elements.commentSignOutButton.classList.toggle("hidden", !this.commentAccount);
        }
        if (!this.elements.commentList) {
            return;
        }
        this.elements.commentList.innerHTML = "";
        fragment = document.createDocumentFragment();
        for (index = 0; index < this.comments.length; index += 1) {
            comment = this.comments[index];
            article = document.createElement("article");
            article.className = "comment-item";
            meta = document.createElement("div");
            meta.className = "comment-meta";
            author = document.createElement("strong");
            author.textContent = comment.author || "Player";
            time = document.createElement("span");
            time.textContent = this.formatCommentTime(comment.createdAt);
            body = document.createElement("p");
            this.appendMentionText(body, comment.text || "");
            meta.appendChild(author);
            meta.appendChild(time);
            article.appendChild(meta);
            article.appendChild(body);
            fragment.appendChild(article);
        }
        if (this.comments.length === 0) {
            article = document.createElement("article");
            article.className = "comment-item";
            article.textContent = "No comments yet. Sign in and recommend an update.";
            fragment.appendChild(article);
        }
        this.elements.commentList.appendChild(fragment);
    };

    View.prototype.appendMentionText = function (target, text) {
        var pieces = String(text || "").split(/(@[A-Za-z0-9_]{2,18})/g);
        var index;
        var node;
        for (index = 0; index < pieces.length; index += 1) {
            if (!pieces[index]) {
                continue;
            }
            if (/^@[A-Za-z0-9_]{2,18}$/.test(pieces[index])) {
                node = document.createElement("span");
                node.className = "comment-mention";
                node.textContent = pieces[index];
                target.appendChild(node);
            } else {
                target.appendChild(document.createTextNode(pieces[index]));
            }
        }
    };

    View.prototype.formatCommentTime = function (timestamp) {
        var diff = Math.max(0, Date.now() - (timestamp || Date.now()));
        if (diff < 60000) {
            return "now";
        }
        if (diff < 3600000) {
            return Math.floor(diff / 60000) + "m";
        }
        if (diff < 86400000) {
            return Math.floor(diff / 3600000) + "h";
        }
        return Math.floor(diff / 86400000) + "d";
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

    View.prototype.playCoinSpin = function (result) {
        var self = this;
        var reels = [this.elements.coinReelA, this.elements.coinReelB, this.elements.coinReelC];
        var finalText = padLuckValue(result.value);
        var index;

        window.clearTimeout(this.coinSpinTimer);
        window.clearInterval(this.coinSpinInterval);

        if (this.elements.coinMachineCabinet) {
            this.elements.coinMachineCabinet.classList.add("is-spinning");
            this.elements.coinMachineCabinet.classList.remove("is-positive", "is-negative");
        }
        if (this.elements.coinSpinButton) {
            this.elements.coinSpinButton.disabled = true;
            this.elements.coinSpinButton.classList.add("is-spinning");
            this.elements.coinSpinButton.textContent = "Spinning";
        }
        if (this.elements.coinSpinResult) {
            this.elements.coinSpinResult.textContent = "Spinning";
        }
        if (this.elements.coinSpinDelta) {
            this.elements.coinSpinDelta.textContent = "...";
        }

        for (index = 0; index < reels.length; index += 1) {
            if (reels[index]) {
                reels[index].classList.remove("reel-green", "reel-red");
            }
        }

        this.coinSpinInterval = window.setInterval(function () {
            var reelIndex;
            for (reelIndex = 0; reelIndex < reels.length; reelIndex += 1) {
                if (reels[reelIndex]) {
                    reels[reelIndex].textContent = String(self.engine.randomInt(0, 9));
                }
            }
        }, 55);

        this.coinSpinTimer = window.setTimeout(function () {
            window.clearInterval(self.coinSpinInterval);
            for (index = 0; index < reels.length; index += 1) {
                if (reels[index]) {
                    reels[index].textContent = finalText.charAt(index);
                    reels[index].classList.add(result.positive ? "reel-green" : "reel-red");
                }
            }
            if (self.elements.coinMachineCabinet) {
                self.elements.coinMachineCabinet.classList.remove("is-spinning");
                self.elements.coinMachineCabinet.classList.add(result.positive ? "is-positive" : "is-negative");
            }
            if (self.elements.coinSpinResult) {
                self.elements.coinSpinResult.textContent = finalText;
            }
            if (self.elements.coinSpinDelta) {
                self.elements.coinSpinDelta.textContent = (result.delta >= 0 ? "+" : "") + safeFormatNumber(result.delta) + " coins";
            }
            if (self.elements.coinMachineNote) {
                self.elements.coinMachineNote.textContent = "Spent " + safeFormatNumber(COIN_MACHINE_COST) + " luck. Coins changed by " + (result.delta >= 0 ? "+" : "") + safeFormatNumber(result.delta) + ".";
            }
            if (self.elements.coinSpinButton) {
                self.elements.coinSpinButton.classList.remove("is-spinning");
                self.elements.coinSpinButton.disabled = result.luckAfter < COIN_MACHINE_COST;
                self.elements.coinSpinButton.textContent = result.luckAfter < COIN_MACHINE_COST
                    ? "Insufficient luck"
                    : "Spin for " + safeFormatNumber(COIN_MACHINE_COST) + " luck";
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

    View.prototype.selectBuiltInTrack = function (trackId) {
        var wasPlaying = this.music.isPlaying;
        this.music.setTrack(trackId);
        if (wasPlaying) {
            this.music.stop();
            this.music.start();
            this.updateMusicButton(true, true);
        } else {
            this.updateMusicButton(false, true);
        }
        if (this.activeSpotifyIndex !== -1) {
            this.activeSpotifyIndex = -1;
            this.renderSpotifySongs();
        }
        this.renderBuiltInTracks();
    };

    View.prototype.renderBuiltInTracks = function () {
        var fragment;
        var index;
        var track;
        var button;
        var name;
        var mood;
        if (!this.elements.builtInTrackList) {
            return;
        }
        fragment = document.createDocumentFragment();
        for (index = 0; index < BUILT_IN_TRACKS.length; index += 1) {
            track = BUILT_IN_TRACKS[index];
            button = document.createElement("button");
            button.type = "button";
            button.className = "built-in-track" + (this.music.track.id === track.id ? " is-active" : "");
            button.setAttribute("data-track-id", track.id);
            name = document.createElement("strong");
            name.textContent = track.name;
            mood = document.createElement("span");
            mood.textContent = track.mood;
            button.appendChild(name);
            button.appendChild(mood);
            fragment.appendChild(button);
        }
        this.elements.builtInTrackList.innerHTML = "";
        this.elements.builtInTrackList.appendChild(fragment);
    };

    View.prototype.updateMusicButton = function (isOn, isSupported) {
        if (this.elements.calmMusicButton) {
            this.elements.calmMusicButton.classList.toggle("is-on", isOn);
            this.elements.calmMusicButton.setAttribute("aria-pressed", isOn ? "true" : "false");
            this.elements.calmMusicButton.disabled = !isSupported;
            this.elements.calmMusicButton.textContent = isSupported ? (isOn ? "Pause " + this.music.track.name : "Play " + this.music.track.name) : "No Audio";
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

    View.prototype.toggleCodingTutorial = function () {
        var isHidden = this.elements.codingTutorialPanel.classList.contains("hidden");
        this.setCodingTutorialOpen(isHidden);
    };

    View.prototype.setCodingTutorialOpen = function (isOpen) {
        if (!this.elements.codingTutorialPanel || !this.elements.codingTutorialButton) {
            return;
        }
        this.elements.codingTutorialPanel.classList.toggle("hidden", !isOpen);
        this.elements.codingTutorialPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
        this.elements.codingTutorialButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
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

    View.prototype.toggleCoinMachine = function () {
        var isHidden = this.elements.coinMachinePanel.classList.contains("hidden");
        this.setCoinMachineOpen(isHidden);
    };

    View.prototype.setCoinMachineOpen = function (isOpen) {
        if (!this.elements.coinMachinePanel || !this.elements.coinMachineButton) {
            return;
        }
        this.elements.coinMachinePanel.classList.toggle("hidden", !isOpen);
        this.elements.coinMachinePanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
        this.elements.coinMachineButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
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
