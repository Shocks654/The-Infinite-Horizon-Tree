let modInfo = {
	name: "The Infinite Horizon Tree",
	author: "Shocks654",
	pointsName: "points",
	modFiles: [
	"tree.js",
	modFiles: [
    "tree.js", 
    "00_achievements.js", 
    "01_prestige.js", // This loads your main Prestige layer
	"02_boosters.js", // This loads your main Boosters layer
    "layers.js"       // Kept at the end as an empty file to satisfy the engine
],



	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
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

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
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

	let gain = new Decimal(0)
    
    // 11
		if (hasUpgrade("p", 11)) gain = gain.add(1)
    
    // 12
		if (hasUpgrade("p", 12)) gain = gain.times(upgradeEffect("p", 12))
    
    // 13
		if (hasUpgrade("p", 13)) gain = gain.times(upgradeEffect("p", 13))
    
    // 22
		if (hasUpgrade("p", 22)) {
			let eff = upgradeEffect("p", 22)
        // 32: Négyzetre emeli a 22-es bónuszát
			if (hasUpgrade("p", 32)) eff = eff.pow(2)
        gain = gain.times(eff)
    }
    
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e1000000000000000000000000000000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(1000) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}