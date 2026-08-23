let modInfo = {
	name: "The Infinite Horizon Tree",
	id: "infinitehorizontree", 
	author: "Shocks654",
	pointsName: "points",
    
    // List of files that contain the layers of your game tree
    modFiles: [
        "tree.js", 
        "00_achievements.js", 
        "layers.js" 
    ],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10), // Used for hard resets and new players
	initialLayers: ["p"], 
	offlineLimit: 1000,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.9",
	name: "Prototype",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.9</h3><br>
		- Adding a LOT of layers.<br>`

let winText = `Congratulations! You have reached the end of the current version of The Infinite Horizon Tree!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
var doNotCallTheseFunctionsEveryTick = ["Idonotknowwhatisthis"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0) // Starts at 0 until the first upgrade is bought
    
    // Safety check: Only check upgrades if the prestige layer ("p") is fully loaded in memory
    if (player.p && player.p.upgrades) {
        // 11: Base +1 point/sec
        if (player.p.upgrades.includes(11)) gain = gain.add(1) 
        
        // 12: Prestige Point boost
        if (player.p.upgrades.includes(12)) gain = gain.times(upgradeEffect("p", 12))
        
        // 13: Point self-synergy boost
        if (player.p.upgrades.includes(13)) gain = gain.times(upgradeEffect("p", 13))
        
        // 22: Bought upgrades boost
        if (player.p.upgrades.includes(22)) {
            let eff = upgradeEffect("p", 22)
            // 32: Raised to the power of 1.3 exactly!
            if (player.p.upgrades.includes(32)) eff = eff.pow(1.3)
            gain = gain.times(eff)
        }
    }
    
    // Safety check for achievements layer ("a")
    if (player.a && player.a.achievements) {
        // Achievement 12 boost: +5% Point generation
        if (player.a.achievements.includes(12)) gain = gain.times(1.05)
    }
    
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends" and shows the win screen
function isEndgame() {
    // Balanced hyper-exponential endgame target set to ee1e10!
    return player.points.gte(Decimal.fromHyperE("ee1e10"))
}

// Style for the background, can be a function
var backgroundStyle = {
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(1000) 
}

// Use this if you need to undo inflation from an older version.
function fixOldSave(oldVersion){
}
