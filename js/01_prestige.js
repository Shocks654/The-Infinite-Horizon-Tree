addLayer("p", {
    name: "prestige",
    symbol: "P",
    
    // Correct engine parameters for tree placement
    row: 0, 
    position: 0, 

    // This tells the engine to ALWAYS display the "P" node on the tree map
    layerShown() { return true }, 

    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},

    color: "#31aeb0", // Classic Prestige Tree teal blue color
    requires: new Decimal(10), 
    resource: "prestige points", 
    baseResource: "points", 
    baseAmount() { return player.points }, 

    type: "normal", 
    exponent: 0.5, 

    // Safe upgrade checker structures to prevent any startup execution crashes
    gainMult() { 
        let mult = new Decimal(1)
        if (player.p && player.p.upgrades && player.p.upgrades.includes(21)) mult = mult.times(1.8)
        if (player.p && player.p.upgrades && player.p.upgrades.includes(23)) mult = mult.times(upgradeEffect("p", 23))
        if (player.p && player.p.upgrades && player.p.upgrades.includes(33)) mult = mult.times(upgradeEffect("p", 33))
        return mult
    },
    
    gainExp() { 
        let exp = new Decimal(1)
        if (player.p && player.p.upgrades && player.p.upgrades.includes(31)) {
            let bonus = new Decimal(1.05)
            if (player.p.upgrades.includes(33)) bonus = bonus.times(upgradeEffect("p", 33))
            exp = exp.times(bonus)
        }
        return exp 
    },

    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    upgrades: {
        // --- ROW 1 ---
        11: {
            title: "Begin",
            description: "Generate 1 Point every second.",
            cost: new Decimal(1),
        },
        12: {
            title: "Prestige Boost",
            description: "Prestige Points boost Point generation.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("p", 11) },
            effect() { return player.p.points.add(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Self-Synergy",
            description: "Points boost their own generation.",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("p", 12) },
            effect() { return player.points.add(1).pow(0.25) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        
        // --- ROW 2 ---
        21: {
            title: "More Prestige",
            description: "Prestige Point gain is increased by 80%.",
            cost: new Decimal(20),
            unlocked() { return hasUpgrade("p", 13) },
        },
        22: {
            title: "Upgrade Power",
            description: "Point generation is faster based on your Prestige Upgrades bought.",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade("p", 21) },
            effect() { 
                let amount = player.p.upgrades.length
                return new Decimal(1.5).pow(amount) 
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        23: {
            title: "Reverse Boost",
            description: "Prestige Point gain is boosted by your Points.",
            cost: new Decimal(250),
            unlocked() { return hasUpgrade("p", 22) },
            effect() { return player.points.add(1).log10().add(1).pow(0.75) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        // --- ROW 3 ---
        31: {
            title: "Super-Synergy",
            description: "Prestige Point gain is raised to the power of 1.05.",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade("p", 23) },
        },
        32: {
            title: "Squared Power",
            description: "The 'Upgrade Power' upgrade (22) is squared.",
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade("p", 31) },
        },
        33: {
            title: "Total Transcendence",
            description: "Both previous upgrades (31 and 32) are stronger based on your Total Prestige Points.",
            cost: new Decimal(25000),
            unlocked() { return hasUpgrade("p", 32) },
            effect() { return player.p.points.add(1).log10().add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
})
