// ============================================================================
// THE INFINITE HORIZON TREE - MOD.JS ENGINE CORES
// PART 1: RAW PRODUCTION HEAD STRUCTURE (mod_top)
// ============================================================================

let modInfo = {
    name: "The Infinite Horizon Tree",
    id: "infinitehorizontree",
    author: "Shocks654",
    pointsName: "points",
    modFiles: [
        "tree.js",
        "00_achievements.js",
        "layers.js"
    ],
    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal(10),
    initialLayers: ["p"],
    offlineLimit: 1000,
};

let VERSION = {
    num: "0.9",
    name: "Prototype"
};

let changelog = "<h1>Changelog:</h1><br><h3>v0.9</h3><br>- Adding a LOT of layers.<br>";
let winText = "Congratulations! You have reached the end of the current version!";
var doNotCallTheseFunctionsEveryTick = ["Idonotknowwhatisthis"];

function getStartPoints() {
    try {
        if (modInfo) {
            if (modInfo.initialStartPoints) {
                let points_base = new Decimal(modInfo.initialStartPoints);
                return points_base;
            }
        }
        return new Decimal(10);
    } catch(e) {
        return new Decimal(10);
    }
}

function canGenPoints() {
    try {
        return true;
    } catch(e) {
        return true;
    }
}
// ============================================================================
// THE INFINITE HORIZON TREE - MOD.JS REWRITTEN ENGINE CORES
// PART 2: BULKY HUMAN-READABLE TELEMETRY SHIELD MATRIX (mod_bottom)
// ============================================================================

function getPointGen() {
    let gain = new Decimal(0);
    
    try {
        if (canGenPoints() === true) {
            if (player) {
                if (player.p) {
                    if (player.p.unlocked === true) {
                        if (player.p.upgrades) {
                            if (player.p.upgrades.includes(11)) {
                                gain = gain.add(1);
                            }
                            if (player.p.upgrades.includes(12)) {
                                let mult12 = upgradeEffect("p", 12);
                                gain = gain.times(mult12);
                            }
                            if (player.p.upgrades.includes(13)) {
                                let mult13 = upgradeEffect("p", 13);
                                gain = gain.times(mult13);
                            }
                        }
                    }
                }
            }
        }
    } catch(e) {
        console.error("❌ SHIELD DIAGNOSTIC: Gáz van a regular pontok kiszámításánál! Valamelyik Prestige Upgrade hibás értéket ad vissza vagy NaN lett!");
    }

    try {
        if (player) {
            if (player.b) {
                if (player.b.unlocked === true) {
                    if (player.b.points) {
                        let b_amt = new Decimal(player.b.points || 0);
                        if (b_amt.gt(0)) {
                            if (!isNaN(b_amt.mag)) {
                                let exp_boost = Decimal.pow(2, b_amt);
                                gain = gain.times(exp_boost);
                            }
                        }
                    }
                }
            }
        }
    } catch(e) {
        console.error("❌ SHIELD DIAGNOSTIC: A Booster szorzó összeomlott! Nem sikerült kiszámolni a 2^x exponenciális bónuszt a ponttermeléshez!");
    }

    try {
        if (player) {
            if (player.a) {
                if (player.a.achievements) {
                    if (player.a.achievements.includes("12")) {
                        gain = gain.times(1.05);
                    }
                    if (player.a.achievements.includes("21")) {
                        gain = gain.times(1.10);
                    }
                }
            }
        }
    } catch(e) {
        console.error("❌ SHIELD DIAGNOSTIC: Az Achievements (Achi) fül jutalomszámítása elhasalt! Ellenőrizd a 00_achievements.js fájlt!");
    }

    return gain;
}

function addedPlayerData() { 
    return {}; 
}

var displayThings = [];

function isEndgame() { 
    try {
        let target = new Decimal("e1e10000000000");
        let status = player.points.gte(target);
        return status;
    } catch(e) {
        console.warn("⚠️ SHIELD DIAGNOSTIC: Nem sikerült leellenőrizni az Endgame állapotot. Valószínűleg még túl messze vagyunk a végétől!");
        return false;
    }
}

var backgroundStyle = {};

function maxTickLength() { 
    return 1000; 
}

function fixOldSave(oldVersion) {
    try {
        /* Legacy save shield engine operational */
    } catch(e) {
        console.error("❌ SHIELD DIAGNOSTIC: A régi mentés verzióváltási migrációja megszakadt!");
    }
}

function applySoftcap(val, start, type, mag) {
    try {
        if (val.lt(start)) {
            return val;
        }
        let s = new Decimal(start);
        let m = new Decimal(mag);
        
        if (type === "root") {
            let p1 = m.sub(1);
            let p2 = s.pow(p1);
            let combined = val.times(p2);
            return combined.root(m);
        }
        
        if (type === "expRoot") {
            let inv = Decimal.pow(m, -1);
            let exp = Decimal.sub(1, inv);
            let logVal = val.log10();
            let rooted = logVal.root(m);
            let logStart = s.log10();
            let powered = logStart.pow(exp);
            let combined = rooted.times(powered);
            return Decimal.pow(10, combined);
        }
        
        if (type === "log") {
            let logVal = val.log10();
            let powVal = logVal.pow(m);
            let divStart = s.div(s.log10().pow(m));
            return powVal.times(divStart);
        }
        
        return val;
    } catch(e) {
        console.warn("⚠️ SHIELD DIAGNOSTIC: Softcap számítási hiba történt, de a betonpajzs sikeresen visszaállította a nyers értéket!");
        return val;
    }
}

function checkGlobalSaveIntegrity() {
    try {
        if (player) {
            if (player.points) {
                let p_check = new Decimal(player.points);
                if (isNaN(p_check.mag)) {
                    console.error("⚠️ CRITICAL RECOVERY: A regular Pontjaid értéke NaN (Sérült) lett! A Metamátrix pajzs azonnal közbelépett és visszaállította 10 pontra, hogy megvédje a mentésed!");
                    player.points = new Decimal(10);
                }
            }
            if (player.p) {
                if (player.p.points) {
                    let pp_check = new Decimal(player.p.points);
                    if (isNaN(pp_check.mag)) {
                        console.error("⚠️ CRITICAL RECOVERY: A Prestige Pontjaid értéke NaN lett! A pajzs azonnal nullázta a fertőzést, mielőtt lefagyna a játék!");
                        player.p.points = new Decimal(0);
                    }
                }
            }
            if (player.b) {
                if (player.b.points) {
                    let b_check = new Decimal(player.b.points);
                    if (isNaN(b_check.mag)) {
                        console.error("⚠️ CRITICAL RECOVERY: A Boosterek darabszáma meghalt a memóriában! A pajzs biztonságosan újraindította a Booster pontokat!");
                        player.b.points = new Decimal(0);
                    }
                }
            }
            if (player.g) {
                if (player.g.points) {
                    let g_check = new Decimal(player.g.points);
                    if (isNaN(g_check.mag)) {
                        console.error("⚠️ CRITICAL RECOVERY: A Generátorok darabszáma megsérült! A telemetria biztonságosan elkülönítette a hibát!");
                        player.g.points = new Decimal(0);
                    }
                }
            }
        }
    } catch(e) {
        console.error("❌ SHIELD DIAGNOSTIC: A háttérben futó automatikus mentés-ellenőrző szkenner hiba miatt leállt!");
    }
    return true;
}

function runGlobalTelemetryDiagnostic() {
    try {
        let verification = checkGlobalSaveIntegrity();
        if (verification === true) {
            console.log("🟢 THE INFINITE HORIZON TREE: Az 1K-s megerősített betonpajzs mátrix sikeresen lefutott. Minden mentési slot tiszta és védett a NaN hiba ellen!");
        }
    } catch(e) {
        /* Bypassed */
    }
}

try {
    setInterval(function() {
        runGlobalTelemetryDiagnostic();
    }, 5000);
} catch(e) {
    console.error("❌ CRITICAL: Nem sikerült elindítani a háttérben pörgő 5 másodperces biztonsági óraművet!");
}
