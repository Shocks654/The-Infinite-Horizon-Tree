let modInfo = {
	name: "The Infinite Horizon Tree",
	id: "infinitehorizontree", 
	author: "Shocks654",
	pointsName: "points",
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

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) return new Decimal(0)
	let gain = new Decimal(0) // Starts at 0 until the first upgrade is bought
    
    // Safety check: Only check upgrades if prestige layer ("p") is loaded in memory
    if (player.p && player.p.unlocked) {
        if (hasUpgrade("p", 11)) gain = gain.add(1) 
        if (hasUpgrade("p", 12)) gain = gain.times(upgradeEffect("p", 12))
        if (hasUpgrade("p", 13)) gain = gain.times(upgradeEffect("p", 13))
    }
    
    // BOOSTER POINT BOOST INJECTION: Applies the exact exponential 2^x multiplier!
    if (player.b && player.b.unlocked) {
        let b_amt = new Decimal(player.b.points || 0);
        if (b_amt.gt(0)) {
            gain = gain.times(Decimal.pow(2, b_amt)); // Every single booster doubles point generation!
        }
    }
    
    // Achievement rewards multiplier logic
    if (hasAchievement("a", 12)) gain = gain.times(1.05)
    if (hasAchievement("a", 21)) gain = gain.times(1.10)
    
	return gain
}

function addedPlayerData() { return {} }
var displayThings = []
function isEndgame() { return player.points.gte(new Decimal("e1e10000000000")) }
var backgroundStyle = {}
function maxTickLength() { return(1000) }
function fixOldSave(oldVersion){}

// FIXED SOFTCAP ENGINE: Parentheses corrected to prevent Vue crashes and softlocks!
function applySoftcap(val, start, type, mag) {
    if (val.lt(start)) return val;
    start = new Decimal(start);
    mag = new Decimal(mag);
    if (type === "root") return val.times(start.pow(mag.sub(1))).root(mag);
    if (type === "expRoot") {
        let exp = Decimal.sub(1, Decimal.pow(mag, -1));
        let p = val.log10().root(mag).times(start.log10().pow(exp));
        return Decimal.pow(10, p);
    }
    if (type === "log") return val.log10().pow(mag).times(start.div(start.log10().pow(mag)));
    return val;
}
