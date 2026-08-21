let modInfo = {
	name: "The Infinite Horizon Tree",
	author: "Shocks654",
	pointsName: "points",
	modFiles: [
    "tree.js", 
    "00_achievements.js", 
    "01_prestige.js", // Itt van a "p" réteged kódja!
    "boosters.js", 
    "generators.js"
],


	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1000,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "Release",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added a LOT of layers.<br>`

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

	let gain = new Decimal(0) // 0-ról indul, amíg nincs meg az első upgrade
    
    // 11: Alap +1 pont/mp
    if (hasUpgrade("c", 11)) gain = gain.add(1) 
    
    // 12: PP alapú bónusz
    if (hasUpgrade("c", 12)) gain = gain.times(upgradeEffect("c", 12))
    
    // 13: Sima pont alapú bónusz
    if (hasUpgrade("c", 13)) gain = gain.times(upgradeEffect("c", 13))
    
    // 22: Vásárolt upgrade-ek száma alapú bónusz
    if (hasUpgrade("c", 22)) {
        let eff = upgradeEffect("c", 22)
        // 32: Négyzetre emeli a 22-es bónuszát
        if (hasUpgrade("c", 32)) eff = eff.pow(2)
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