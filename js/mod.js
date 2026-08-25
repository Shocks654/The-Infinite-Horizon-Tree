// ============================================================================
// THE INFINITE HORIZON TREE - MOD.JS RAW ENGINE CORES
// SYSTEM STATUS: CLEAN PRODUCTION REALIGNMENT
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
    return new Decimal(modInfo.initialStartPoints);
}

function canGenPoints() {
    return true;
}

function getPointGen() {
    if (!canGenPoints()) return new Decimal(0);
    let gain = new Decimal(0);
    
    if (player.p && player.p.unlocked) {
        if (hasUpgrade("p", 11)) gain = gain.add(1);
        if (hasUpgrade("p", 12)) gain = gain.times(upgradeEffect("p", 12));
        if (hasUpgrade("p", 13)) gain = gain.times(upgradeEffect("p", 13));
    }
    
    if (player.b && player.b.unlocked) {
        let b_amt = new Decimal(player.b.points || 0);
        if (b_amt.gt(0)) {
            gain = gain.times(Decimal.pow(2, b_amt));
        }
    }
    
    if (hasAchievement("a", 12)) gain = gain.times(1.05);
    if (hasAchievement("a", 21)) gain = gain.times(1.10);
    
    return gain;
}

function addedPlayerData() { return {}; }
var displayThings = [];
function isEndgame() { return player.points.gte(new Decimal("e1e10000000000")); }
var backgroundStyle = {};
function maxTickLength() { return 1000; }
function fixOldSave(oldVersion) {}
