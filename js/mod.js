let modInfo = {
	name: "The Infinite Horizon Tree",
	id: "infinitehorizontree", 
	author: "Shocks654",
	pointsName: "points",
    
    // FIXED LOADING ORDER: Kept only individual clean files to prevent duplicates!
    modFiles: [
        "tree.js", 
        "00_achievements.js", 
        "01_prestige.js",
        "02_boosters.js",
        "03_generators.js"
    ],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10), 
	initialLayers: ["p"], 
	offlineLimit: 1000, 
}

let VERSION = { num: "0.9", name: "Prototype" }
let changelog = `<h1>Changelog:</h1><br><h3>v0.9</h3><br>- Adding a LOT of layers.<br>`
let winText = `Congratulations! You have reached the end of the current version!`
var doNotCallTheseFunctionsEveryTick = ["Idonotknowwhatisthis"]

function getStartPoints(){ return new Decimal(modInfo.initialStartPoints) }
function canGenPoints(){ return true }

// FIXED POINT GENERATION CHAIN: Now links perfectly with your separate layers and achi rewards!
function getPointGen() {
	if(!canGenPoints()) return new Decimal(0)
	let gain = new Decimal(0) 
    
    if (player.p && player.p.unlocked) {
        if (hasUpgrade("p", 11)) gain = gain.add(1) 
        if (hasUpgrade("p", 12)) gain = gain.times(upgradeEffect("p", 12))
        if (hasUpgrade("p", 13)) gain = gain.times(upgradeEffect("p", 13))
        if (hasUpgrade("p", 22)) gain = gain.times(upgradeEffect("p", 22))
    }
    
    // Achi 12 reward: +5% point generation
    if (hasAchievement("a", 12)) gain = gain.times(1.05)
    // Achi 21 reward: Generate points 10% faster
    if (hasAchievement("a", 21)) gain = gain.times(1.10)
    
	return gain
}

function addedPlayerData() { return {} }
var displayThings = []
function isEndgame() { return player.points.gte(new Decimal("e1e10000000000")) }
var backgroundStyle = {}
function maxTickLength() { return(1000) }
function fixOldSave(oldVersion){}

// GLOBAL SOFTCAP ENGINE FUNCTION
// Formulas: root, expRoot, log
function applySoftcap(val, start, type, mag) {
    if (val.lt(start)) return val;
    start = new Decimal(start);
    mag = new Decimal(mag);
    if (type === "root") return val.times(start.pow(mag.sub(1))).root(mag);
    if (type === "expRoot") {
        let exp = Decimal.sub(1, Decimal.pow(mag, -1));
        return Decimal.pow(10, val.log10().root(mag).times(start.log10().pow(exp)));
    }
    if (type === "log") return val.log10().pow(mag).times(start.div(start.log10().pow(mag)));
    return val;
}
