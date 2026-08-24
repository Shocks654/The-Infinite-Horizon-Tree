addLayer("b", {
    name: "Boosters",
    symbol: "B",
    row: 1,
    position: -1, 
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#4b0082", // Colors of the night Indigo
    
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

    // Draws the branch connection lines directly on the map
    branches: ["p"], 
    layerShown() { return player.p.upgrades.length >= 4 },

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
        11: {
            title: "BP Combo",
            description: "Best Boosters boost Prestige Point gain.",
            cost: new Decimal(3),
            effect() { return player.b.points.sqrt().add(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "Cross-Contamination",
            description: "Generators add to the Booster base.",
            cost: new Decimal(7),
            unlocked() { return player.b.unlocked || (player.g && player.g.unlocked) },
            effect() {
                let x = player.g ? player.g.points : new Decimal(0)
                return x.add(1).log10().add(1).sqrt().div(3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "PB Reversal",
            description: "Total Prestige Points add to the Booster effect base.",
            cost: new Decimal(8),
            unlocked() { return player.b.points.gte(7) },
            effect() { return player.p.points.add(1).log10().add(1).log10().div(3) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        21: { title: "Gen Z^2", description: "Square the Generator Power effect.", cost: new Decimal(9), unlocked() { return hasUpgrade("b", 11) && hasUpgrade("b", 12) } },
        22: { title: "Up to the Fifth Floor", description: "Raise the Generator Power effect ^1.2.", cost: new Decimal(15), unlocked() { return hasUpgrade("b", 12) && hasUpgrade("b", 13) } },
        23: {
            title: "Discount One",
            description: "Boosters are cheaper based on your Points.",
            cost: new Decimal(18),
            unlocked() { return hasUpgrade("b", 21) && hasUpgrade("b", 22) },
            effect() { return player.points.add(1).log10().add(1).pow(3.2) },
            effectDisplay() { return "-"+format(upgradeEffect(this.layer, this.id))+" cost" },
        },
    },
})
