addLayer("p", {
    name: "prestige",
    symbol: "P",
    row: 0, 
    position: 0, 
    layerShown() { return true }, 
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "#008080", 
    requires: new Decimal(10), 
    resource: "prestige points", 
    baseResource: "points", 
    baseAmount() { return player.points }, 
    type: "normal", 
    exponent: 0.5, 

        // REWRITTEN GAINMULT: Safe raw memory checks that completely bypass easyAccess.js undefined crashes!
    gainMult() { 
        let mult = new Decimal(1)
        
        // Safe check for Prestige row 2 upgrades
        if (player.p && player.p.upgrades) {
            if (player.p.upgrades.includes(21)) mult = mult.times(1.8)
            if (player.p.upgrades.includes(23)) mult = mult.times(upgradeEffect("p", 23))
            if (player.p.upgrades.includes(33)) mult = mult.times(upgradeEffect("p", 33))
        }
        
        // PURE RAW CHECK: Only checks Boosters upgrade 11 if the player has explicitly unlocked the layer!
        if (player.b && player.b.unlocked && player.b.upgrades && player.b.upgrades.includes(11)) {
            mult = mult.times(upgradeEffect("b", 11))
        }
        
        // PURE RAW CHECK: Only checks Generators upgrade 11 if the player has explicitly unlocked the layer!
        if (player.g && player.g.unlocked && player.g.upgrades && player.g.upgrades.includes(11)) {
            mult = mult.times(upgradeEffect("g", 11))
        }
        
        return mult
    },

    gainExp() { 
        let exp = new Decimal(1)
        if (hasUpgrade("p", 31)) exp = exp.times(1.05)
        return exp 
    },

    // FIXED: bm0 and gm0 ONLY work for their own separate resets!
    doReset(resettingLayer) {
        let keep = [];
        if (resettingLayer === "b" && hasMilestone("b", 0)) keep.push("upgrades")
        if (resettingLayer === "g" && hasMilestone("g", 0)) keep.push("upgrades")
        if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
    },

    upgrades: {
        11: { title: "Begin", description: "Generate 1 Point every second.", cost: new Decimal(2) },
        12: {
            title: "Prestige Boost",
            description: "Prestige Points boost Point generation.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("p", 11) },
            effect() { 
                let eff = player.p.points.add(2).pow(0.5);
                return applySoftcap(eff, new Decimal("1e3500"), "log", 1);
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "Self-Synergy",
            description: "Points boost their own generation.",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("p", 12) },
            effect() { return player.points.add(1).log10().pow(0.75).add(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: { title: "More Prestige", description: "Prestige Point gain is increased by 80%.", cost: new Decimal(20), unlocked() { return hasAchievement("a", 21) && hasUpgrade("p", 11) } },
        22: {
            title: "Upgrade Power",
            description: "Point generation is faster based on your Prestige Upgrades bought.",
            cost: new Decimal(75),
            unlocked() { return hasAchievement("a", 21) && hasUpgrade("p", 12) },
            effect() { return new Decimal(1.4).pow(player.p.upgrades.length) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        23: {
            title: "Reverse Prestige Boost",
            description: "Prestige Point gain is boosted by your Points.",
            cost: new Decimal(5000),
            unlocked() { return hasAchievement("a", 21) && hasUpgrade("p", 13) },
            effect() { return player.points.add(1).log10().pow(1/3).add(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        31: { title: "WE NEED MORE PRESTIGE", description: "Prestige Point gain is raised to the power of 1.05.", cost: new Decimal("1e45"), unlocked() { return hasAchievement("a", 23) && hasUpgrade("p", 21) } },
        32: { title: "Still Useless", description: "Upgrade Power is squared.", cost: new Decimal("1e56"), unlocked() { return hasAchievement("a", 23) && hasUpgrade("p", 22) } },
        33: {
            title: "Column Leader",
            description: "Both above upgrades are stronger based on your Total Prestige Points.",
            cost: new Decimal("1e60"),
            unlocked() { return hasAchievement("a", 23) && hasUpgrade("p", 23) },
            effect() { return player.p.points.add(1).log10().add(1).log10().div(5).add(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
})

addLayer("b", {
    name: "Boosters",
    symbol: "B",
    row: 1,
    position: -1, 
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#4b0082", 
    
    cost() {
        let x = player.b.points
        let formula = Decimal.pow(5, x.pow(1.25)).times(200)
        if (player.g && player.g.unlocked && !player.b.unlocked) return formula.max(1000000)
        return formula
    },
    
    resource: "boosters",
    baseResource: "prestige points",
    baseAmount() { return player.p.points },
    type: "static",
    exponent: 1.25,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    branches: ["p"], 
    layerShown() { return player.p.upgrades.length >= 3 },

    // bm1 BLENDED CODE EFFECT: Activates max buy at 15 boosters
    canBuyMax() { return hasMilestone("b", 1) },

    milestones: {
        0: {
            requirement: new Decimal(8),
            requirementDescription: "8 Boosters",
            effectDescription: "Keep Prestige Upgrades on reset.",
            done() { return player.b.points.gte(8) },
        },
        1: {
            requirement: new Decimal(15),
            requirementDescription: "15 Boosters",
            effectDescription: "You can buy max Boosters.",
            done() { return player.b.points.gte(15) },
        }
    },

    upgrades: {
        11: { title: "BP Combo", description: "Best Boosters boost Prestige Point gain.", cost: new Decimal(3), effect() { return player.b.points.sqrt().add(1) } },
        12: { title: "Cross-Contamination", description: "Generators add to the Booster base.", cost: new Decimal(7), unlocked() { return player.b.unlocked || (player.g && player.g.unlocked) } },
        13: { title: "PB Reversal", description: "Total Prestige Points add to the Booster effect base.", cost: new Decimal(8), unlocked() { return player.b.points.gte(7) } },
    },
})

addLayer("g", {
    name: "Generators",
    symbol: "G",
    row: 1,
    position: 1, 
    startData() { return { unlocked: false, points: new Decimal(0), power: new Decimal(0) }},
    color: "#98fb98", 
    
    cost() {
        let x = player.g.points
        let formula = Decimal.pow(5, x.pow(1.25)).times(200)
        if (player.b && player.b.unlocked && !player.g.unlocked) return formula.max(1000000)
        return formula
    },

    resource: "generators",
    baseResource: "prestige points",
    baseAmount() { return player.p.points },
    type: "static",
    exponent: 1.25,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    branches: ["p"], 
    layerShown() { return player.p.upgrades.length >= 3 },

    // gm2 BLENDED CODE EFFECT: Activates max buy at 15 generators
    canBuyMax() { return hasMilestone("g", 2) },

    update(diff) {
        if (player.g.unlocked) {
            let gain = player.g.points.pow(2)
            player.g.power = player.g.power.add(gain.times(diff))

            // gm1 CODE EFFECT REALIZED: 100% passive PP gain every single tick
            if (hasMilestone("g", 1)) {
                let ppGain = getResetGain("p")
                player.p.points = player.p.points.add(ppGain.times(diff))
            }
        }
    },

    milestones: {
        0: {
            requirement: new Decimal(8),
            requirementDescription: "8 Generators",
            effectDescription: "Keep Prestige Upgrades on reset.",
            done() { return player.g.points.gte(8) },
        },
        1: {
            requirement: new Decimal(10),
            requirementDescription: "10 Generators",
            effectDescription: "You gain 100% of Prestige Point gain every second.",
            done() { return player.g.points.gte(10) },
        },
        2: {
            requirement: new Decimal(15),
            requirementDescription: "15 Generators",
            effectDescription: "You can buy max Generators.",
            done() { return player.g.points.gte(15) },
        }
    },

    upgrades: {
        11: { title: "GP Combo", description: "Best Generators boost Prestige Point gain.", cost: new Decimal(3) },
        12: { title: "I Need More!", description: "Boosters add to the Generator base.", cost: new Decimal(7) },
        13: { title: "I Need More II", description: "Best Prestige Points add to the Generator base.", cost: new Decimal(8) },
    },
})
