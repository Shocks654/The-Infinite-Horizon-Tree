addLayer("p", {
    name: "prestige",
    symbol: "P",
    row: 0, 
    position: 0, 

    layerShown() { return true }, 

    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},

    color: "#008080", // Colors of the night Teal
    requires: new Decimal(10), 
    resource: "prestige points", 
    baseResource: "points", 
    baseAmount() { return player.points }, 

    type: "normal", 
    exponent: 0.5, 

    gainMult() { 
        let mult = new Decimal(1)
        if (player.p && player.p.upgrades.includes(21)) mult = mult.times(1.8)
        if (player.p && player.p.upgrades.includes(23)) mult = mult.times(upgradeEffect("p", 23))
        if (player.p && player.p.upgrades.includes(33)) mult = mult.times(upgradeEffect("p", 33))
        
        // Multiplies Prestige gain based on Row 2 layers if upgrades are bought
        if (player.b && hasUpgrade("b", 11)) mult = mult.times(upgradeEffect("b", 11))
        if (player.g && hasUpgrade("g", 11)) mult = mult.times(upgradeEffect("g", 11))
        return mult
    },
    
    gainExp() { 
        let exp = new Decimal(1)
        if (player.p && player.p.upgrades.includes(31)) exp = exp.times(1.01)
        return exp 
    },

    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    upgrades: {
        11: { title: "Begin", description: "Generate 1 Point every second.", cost: new Decimal(1) },
        12: {
            title: "Prestige Boost",
            description: "Prestige Points boost Point generation. (Softcaps at 1e3,500x)",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("p", 11) },
            effect() { 
                let eff = player.p.points.add(2).pow(0.5); // Baseline: (x+2)^0.50
                
                // FIXED WITH YOUR EXACT SOFTCAP MATH: Starts at 1e3500, type log, mag 1
                return applySoftcap(eff, new Decimal("1e3500"), "log", 1);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        13: {
            title: "Self-Synergy",
            description: "Points boost their own generation. (Hardcapped at 1,000,000x)",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("p", 12) },
            effect() { 
                let eff = player.points.add(1).pow(0.25)
                if (eff.gte(1000000)) return new Decimal(1000000)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: { title: "More Prestige", description: "Prestige Point gain is increased by 80%.", cost: new Decimal(20), unlocked() { return hasUpgrade("p", 13) } },
        22: {
            title: "Upgrade Power",
            description: "Point generation is faster based on your Prestige Upgrades bought.",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade("p", 21) },
            effect() { return new Decimal(1.5).pow(player.p.upgrades.length) },
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
        31: { title: "Super-Synergy", description: "Prestige Point gain is raised to the power of 1.01.", cost: new Decimal(1000), unlocked() { return hasUpgrade("p", 23) } },
        32: { title: "Squared Power", description: "The 'Upgrade Power' upgrade (22) is raised to the power of 1.3.", cost: new Decimal(5000), unlocked() { return hasUpgrade("p", 31) } },
        33: {
            title: "Total Transcendence",
            description: "Both previous upgrades (31 and 32) are stronger based on your Total Prestige Points. (Hardcapped at 10x)",
            cost: new Decimal(25000),
            unlocked() { return hasUpgrade("p", 32) },
            effect() { 
                let eff = player.p.points.add(1).log10().add(1).pow(0.1)
                if (eff.gte(10)) return new Decimal(10)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
})
