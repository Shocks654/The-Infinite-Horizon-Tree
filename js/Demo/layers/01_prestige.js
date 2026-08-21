addLayer("p", {
    name: "Prestige",
    symbol: "P",
    position: 0,
    row: 0, 

    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},

    color: "#31aeb0", // Ez a hivatalos, klasszikus Prestige Tree kék!
    requires: new Decimal(10), 
    resource: "prestige points", 
    baseResource: "points", 
    baseAmount() { return player.points }, 

    type: "normal", 
    exponent: 0.5, 

    gainMult() { 
        let mult = new Decimal(1)
        if (hasUpgrade("c", 21)) mult = mult.times(1.8)
        if (hasUpgrade("c", 23)) mult = mult.times(upgradeEffect("c", 23))
        if (hasUpgrade("c", 33)) mult = mult.times(upgradeEffect("c", 33))
        return mult
    },
    
    gainExp() { 
        let exp = new Decimal(1)
        if (hasUpgrade("c", 31)) {
            let bonus = new Decimal(1.05)
            if (hasUpgrade("c", 33)) bonus = bonus.times(upgradeEffect("c", 33))
            exp = exp.times(bonus)
        }
        return exp 
    },

    upgrades: {
        11: {
            title: "Begin",
            description: "Generate 1 Point every second.",
            cost: new Decimal(1),
        },
        12: {
            title: "Prestige Boost",
            description: "Prestige Points boost Point generation.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("c", 11) },
            effect() { return player.c.points.add(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Self-Synergy",
            description: "Points boost their own generation.",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("c", 12) },
            effect() { return player.points.add(1).pow(0.25) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: {
            title: "More Prestige",
            description: "Prestige Point gain is increased by 80%.",
            cost: new Decimal(20),
            unlocked() { return hasUpgrade("c", 13) },
        },
        22: {
            title: "Upgrade Power",
            description: "Point generation is faster based on your Prestige Upgrades bought.",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade("c", 21) },
            effect() { 
                let amount = player.c.upgrades.length
                return new Decimal(1.5).pow(amount) 
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        23: {
            title: "Reverse Boost",
            description: "Prestige Point gain is boosted by your Points.",
            cost: new Decimal(250),
            unlocked() { return hasUpgrade("c", 22) },
            effect() { return player.points.add(1).log10().add(1).pow(0.75) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        31: {
            title: "Super-Synergy",
            description: "Prestige Point gain is raised to the power of 1.05.",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade("c", 23) },
        },
        32: {
            title: "Squared Power",
            description: "The 'Upgrade Power' upgrade (22) is squared.",
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade("c", 31) },
        },
        33: {
            title: "Total Transcendence",
            description: "Both previous upgrades (31 and 32) are stronger based on your Total Prestige Points.",
            cost: new Decimal(25000),
            unlocked() { return hasUpgrade("c", 32) },
            effect() { return player.c.points.add(1).log10().add(1).pow(0.5) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
})
