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
