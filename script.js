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
    var COIN_MACHINE_COST = 1000;
    var FIVE_MINUTES_MS = 5 * 60 * 1000;
    var ONE_MINUTE_MS = 60 * 1000;
    var TEN_MINUTES_MS = 10 * 60 * 1000;
@@ -37,26 +38,26 @@
        {
            id: "pocket-charm",
            name: "Pocket Charm",
            cost: 500,
            luck: 235,
            durationClicks: 20,
            cost: 25,
            luck: 15,
            durationClicks: 25,
            singleUse: false,
            permanent: false,
            unlockRolls: 0,
            maxPurchases: 999999,
            description: "A cheap charm that adds +235 luck for 20 clicks."
            description: "A cheap charm that adds +15 luck for 25 clicks."
        },
        {
            id: "glass-potion",
            name: "Glass Potion",
            cost: 250,
            luck: 190,
            luck: 120,
            durationClicks: 80,
            singleUse: false,
            permanent: false,
            unlockRolls: 30,
            maxPurchases: 999999,
            description: "Adds +190 luck for 80 clicks."
            description: "Adds +120 luck for 80 clicks."
        },
        {
            id: "comet-elixir",
@@ -110,42 +111,65 @@
            id: "void-tonic",
            name: "Void Tonic",
            cost: 10000,
            luck: 14302,
            durationClicks: 4,
            luck: 10000,
            durationClicks: 1,
            singleUse: true,
            permanent: false,
            unlockRolls: 1500,
            maxPurchases: 99,
            maxPurchases: 1,
            description: "Adds +10,000 luck for 1 click only. Single-use for the whole save."
        },
        {
            id: "zenith-tonic",
            name: "Zenith Tonic",
            cost: 26000,
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
    var CUTSCENE_MILESTONES = createCutsceneMilestones();
    var DEFAULT_CUTSCENE_DURATION_MS = 7600;
    var FINALE_CUTSCENE_STEPS = [
        { at: 1200, phase: "Power Build", line: "The room goes empty. The count keeps climbing." },
@@ -193,7 +217,7 @@
        {
            id: "rare-coin-desperation",
            name: "Coin Desperation",
            description: "Reach 10063 coins within 4 minutes.",
            description: "Reach 100 coins within 5 minutes.",
            unlockedBy: function (state) {
                return state.coins >= 100 && state.sessionStartAt > 0 && Date.now() - state.sessionStartAt <= FIVE_MINUTES_MS;
            }
@@ -305,6 +329,79 @@
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
@@ -700,6 +797,41 @@
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

@@ -1009,6 +1141,7 @@
            unlockedCount: this.state.unlockedAchievements.length,
            saveOk: this.lastSaveSucceeded || this.storage.getStorage() !== null,
            luckMachineCost: LUCK_MACHINE_COST,
            coinMachineCost: COIN_MACHINE_COST,
            boosters: this.getBoosterSnapshot()
        };
    };
@@ -1200,6 +1333,8 @@
        this.saveTimer = null;
        this.luckSpinTimer = null;
        this.luckSpinInterval = null;
        this.coinSpinTimer = null;
        this.coinSpinInterval = null;
    }

    View.prototype.cache = function () {
@@ -1212,6 +1347,9 @@
        this.elements.luckMachineButton = document.getElementById("luckMachineButton");
        this.elements.luckMachinePanel = document.getElementById("luckMachinePanel");
        this.elements.closeLuckMachineButton = document.getElementById("closeLuckMachineButton");
        this.elements.coinMachineButton = document.getElementById("coinMachineButton");
        this.elements.coinMachinePanel = document.getElementById("coinMachinePanel");
        this.elements.closeCoinMachineButton = document.getElementById("closeCoinMachineButton");
        this.elements.musicToggleButton = document.getElementById("musicToggleButton");
        this.elements.musicToggleText = document.getElementById("musicToggleText");
        this.elements.musicPanel = document.getElementById("musicPanel");
@@ -1232,6 +1370,14 @@
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
@@ -1291,6 +1437,18 @@
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
@@ -1300,6 +1458,15 @@
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
@@ -1379,6 +1546,10 @@
            self.playLuckSpin(result);
        });

        this.engine.on("coinSpin", function (result) {
            self.playCoinSpin(result);
        });

        this.renderSpotifySongs();
    };

@@ -1481,6 +1652,13 @@
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
@@ -1663,6 +1841,77 @@
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
@@ -2033,119 +2282,133 @@
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
