addLayer("p", {
    name: "prestige",
    symbol: "P",
    
    // Grid positioning for the layer node on the tree map
    row: 0, 
    position: 0, 

    // This tells the engine to ALWAYS display the "P" node on the tree map
    layerShown() { return true }, 

    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},

    color: "#008080", // Updated to official Teal/Dark Cyan!
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
        // 31: Super-Synergy applies a flat ^1.01 power to Prestige Point gain directly here!
        if (player.p && player.p.upgrades && player.p.upgrades.includes(31)) {
            exp = exp.times(1.01)
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
            description: "Prestige Points boost Point generation. (Hardcapped at e500x)",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("p", 11) },
            effect() { 
                let eff = player.p.points.add(1)
                // Hardcap at exactly 1e500 to keep the simulation controlled
                if (eff.gte(new Decimal("1e500"))) return new Decimal("1e500")
                return eff
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
                // Hardcap at 1,000,000x to prevent infinite explosion
                if (eff.gte(1000000)) return new Decimal(1000000)
                return eff
            },
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
            description: "Prestige Point gain is raised to the power of 1.01.",
            cost: new Decimal(1000),
            unlocked() { return hasUpgrade("p", 23) },
        },
        32: {
            title: "Squared Power",
            description: "The 'Upgrade Power' upgrade (22) is raised to the power of 1.3.", // Upgraded to ^1.3 as requested!
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade("p", 31) },
        },
        33: {
            title: "Total Transcendence",
            description: "Both previous upgrades (31 and 32) are stronger based on your Total Prestige Points. (Hardcapped at 10x)",
            cost: new Decimal(25000),
            unlocked() { return hasUpgrade("p", 32) },
            effect() { 
                let eff = player.p.points.add(1).log10().add(1).pow(0.1)
                // Hardcap at exactly 10x boost to control inflation
                if (eff.gte(10)) return new Decimal(10)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
})

addLayer("b", {
    name: "Boosters",
    symbol: "B",
    row: 1,
    position: -1, 
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#4b0082", // Updated to official Indigo!
    
    // Dynamic Base Cost: 200 baseline. Spikes to 1,000,000 if Generators are bought first
    cost() {
        let baseCost = new Decimal(200)
        if (player.g && player.g.unlocked && !player.b.unlocked) {
            return new Decimal(1000000)
        }
        return baseCost
    },
    
    resource: "boosters",
    baseResource: "prestige points",
    baseAmount() { return player.p.points },
    type: "static",
    exponent: 1.25,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },

    // Visibility system: Appears grey at 4 Prestige Upgrades, lights up at 200 points
    layerShown() {
        if (player.p && player.p.upgrades.length >= 4) return true 
        return false 
    },

    milestones: {
        0: {
            requirement: new Decimal(8),
            requirementDescription: "8 Boosters",
            effectDescription: "Keep Prestige Upgrades on reset.",
            done() { return player.b.points.gte(8) }, // FIXED: Added mandatory done() function!
            unlocked() { return player.b.unlocked },
        },
        1: {
            requirement: new Decimal(15),
            requirementDescription: "15 Boosters",
            effectDescription: "You can buy max Boosters.",
            done() { return player.b.points.gte(15) }, // FIXED: Added mandatory done() function!
            unlocked() { return player.b.unlocked },
        }
    },


    upgrades: {
        // --- ROW 1 ---
        11: {
            title: "BP Combo",
            description: "Best Boosters boost Prestige Point gain.",
            cost: new Decimal(3),
            effect() {
                let x = player.b.points
                return x.sqrt().add(1) // sqrt(x)+1 formula
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "Cross-Contamination",
            description: "Generators add to the Booster base.",
            cost: new Decimal(7),
            unlocked() { return player.b.unlocked || player.g.unlocked }, // Prerequisites check
            effect() {
                let x = player.g ? player.g.points : new Decimal(0)
                return x.add(1).log10().add(1).sqrt().div(3) // sqrt(log(x+1))/3 formula
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "PB Reversal",
            description: "Total Prestige Points add to the Booster effect base.",
            cost: new Decimal(8),
            unlocked() { return player.b.points.gte(7) }, // Requires >=7 best boosters
            effect() {
                let x = player.p.points
                return x.add(1).log10().add(1).log10().div(3) // log(log(x+1)+1)/3 formula
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        // --- ROW 2 ---
        21: {
            title: "Gen Z^2",
            description: "Square the Generator Power effect.",
            cost: new Decimal(9),
            unlocked() { return hasUpgrade("b", 11) && hasUpgrade("b", 12) },
        },
        22: {
            title: "Up to the Fifth Floor",
            description: "Raise the Generator Power effect ^1.2.",
            cost: new Decimal(15),
            unlocked() { return hasUpgrade("b", 12) && hasUpgrade("b", 13) },
        },
        23: {
            title: "Discount One",
            description: "Boosters are cheaper based on your Points.",
            cost: new Decimal(18),
            unlocked() { return hasUpgrade("b", 21) && hasUpgrade("b", 22) },
            effect() {
                let x = player.points
                return x.add(1).log10().add(1).pow(3.2) // (log(x+1)+1)^3.2 formula
            },
            effectDisplay() { return "-"+format(upgradeEffect(this.layer, this.id))+" cost" },
        },

        // --- ROW 3 ---
        31: {
            title: "Worse BP Combo",
            description: "Super Boosters boost Prestige Point gain.",
            cost: new Decimal(103),
            unlocked() { return hasAchievement("a", 41) }, // Locked behind Achievement 41
        },
        32: {
            title: "Better BP Combo",
            description: "BP Combo uses a better formula.",
            cost: new Decimal(111),
            unlocked() { return hasAchievement("a", 41) },
        },
        33: {
            title: "Even More Additions",
            description: "More Additions is stronger based on your Super Boosters.",
            cost: new Decimal(118),
            unlocked() { return hasAchievement("a", 41) },
        },

        // --- PSEUDO UPGRADES ---
        14: {
            title: "Meta Combo",
            description: "The first 3 Booster Upgrades are stronger based on your Super Boosters.",
            cost: new Decimal(2250),
            unlocked() { return false }, // Hidden placeholder for: 30 Super Boosters condition
        },
        24: {
            title: "Boost Recursion",
            description: "Boosters multiply their own base.",
            cost: new Decimal(2225),
            unlocked() { return false }, // Hidden placeholder for: 2,150 Boosters condition
        },
        34: {
            title: "Anti-Metric",
            description: "Imperium Bricks raise Prestige Boost to an exponent.",
            cost: new Decimal(2275),
            unlocked() { return false }, // Hidden placeholder for: ee15,000,000 condition
        },
    },
})


addLayer("g", {
    name: "Generators",
    symbol: "G",
    row: 1,
    position: 1, 
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        power: new Decimal(0), // Added storage for Generator Power (GP) tracking
    }},

    color: "#98fb98", // Updated to official Pale Green!

    // Dynamic Base Cost: 200 baseline. Spikes to 1,000,000 if Boosters are bought first
    cost() {
        let baseCost = new Decimal(200)
        if (player.b && player.b.unlocked && !player.g.unlocked) {
            return new Decimal(1000000)
        }
        return baseCost
    },

    resource: "generators",
    baseResource: "prestige points",
    baseAmount() { return player.p.points },
    type: "static",
    exponent: 1.25,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },

    // Visibility system: Appears grey at 4 Prestige Upgrades, lights up at 200 points
    layerShown() {
        if (player.p && player.p.upgrades.length >= 4) return true 
        return false 
    },

    // Automated passive generation for Generator Power (GP) resource
    update(diff) {
        if (player.g.unlocked) {
            let gain = player.g.points.pow(2) // Standard production scale baseline
            if (hasUpgrade("g", 21)) gain = gain.times(player.g.power.add(1).log10().add(1))
            if (hasUpgrade("g", 25)) gain = gain.times(player.p.points.add(1).log10().pow(3).add(1))
            player.g.power = player.g.power.add(gain.times(diff))
        }
    },

       milestones: {
        0: {
            requirement: new Decimal(8),
            requirementDescription: "8 Generators",
            effectDescription: "Keep Prestige Upgrades on reset.",
            done() { return player.g.points.gte(8) }, // FIXED: Added mandatory done() function!
            unlocked() { return player.g.unlocked },
        },
        1: {
            requirement: new Decimal(10),
            requirementDescription: "10 Generators",
            effectDescription: "You gain 100% of Prestige Point gain every second.",
            done() { return player.g.points.gte(10) }, // FIXED: Added mandatory done() function!
            unlocked() { return player.g.unlocked },
        },
        2: {
            requirement: new Decimal(15),
            requirementDescription: "15 Generators",
            effectDescription: "You can buy max Generators.",
            done() { return player.g.points.gte(15) }, // FIXED: Added mandatory done() function!
            unlocked() { return player.g.unlocked },
        }
    },


    upgrades: {
        // --- ROW 1 ---
        11: {
            title: "GP Combo",
            description: "Best Generators boost Prestige Point gain.",
            cost: new Decimal(3),
            effect() { return player.g.points.sqrt().add(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        12: {
            title: "I Need More!",
            description: "Boosters add to the Generator base.",
            cost: new Decimal(7),
            unlocked() { return player.b.unlocked || player.g.unlocked },
            effect() {
                let x = player.b ? player.b.points : new Decimal(0)
                return x.add(1).log10().add(1).sqrt().div(3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        13: {
            title: "I Need More II",
            description: "Best Prestige Points add to the Generator base.",
            cost: new Decimal(8),
            unlocked() { return player.g.points.gte(8) },
            effect() { return player.p.points.add(1).log10().add(1).log10().div(3) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        14: {
            title: "Boost the Boost",
            description: "Prestige Boost is raised to the power of 1.5.",
            cost: new Decimal(13),
            unlocked() { return player.g.points.gte(10) },
        },
        15: {
            title: "Outer Synergy",
            description: "Self-Synergy is stronger based on your Generators.",
            cost: new Decimal(15),
            unlocked() { return hasUpgrade("g", 13) },
            effect() { return player.g.points.sqrt().add(1) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },

        // --- ROW 2 (Generator Power Costs) ---
        21: {
            title: "I Need More III",
            description: "Generator Power boosts its own generation.",
            cost: new Decimal("1e10"),
            currencyDisplayName: "Generator Power",
            currencyInternalName: "power",
            currencyLayer: "g",
            unlocked() { return hasUpgrade("g", 15) },
        },
        22: {
            title: "Discount Two",
            description: "Generators are cheaper based on your Prestige Points.",
            cost: new Decimal("1e11"),
            currencyDisplayName: "Generator Power",
            currencyInternalName: "power",
            currencyLayer: "g",
            unlocked() { return hasUpgrade("g", 15) },
            effect() { return player.p.points.add(1).pow(0.25) },
            effectDisplay() { return "/"+format(upgradeEffect(this.layer, this.id)) },
        },
        23: {
            title: "Double Reversal",
            description: "Reverse Prestige Boost is stronger based on your Boosters.",
            cost: new Decimal("1e12"),
            currencyDisplayName: "Generator Power",
            currencyInternalName: "power",
            currencyLayer: "g",
            unlocked() { return hasUpgrade("g", 15) && player.b.unlocked },
            effect() {
                let x = player.b ? player.b.points : new Decimal(0)
                return x.pow(0.85).add(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
        24: {
            title: "Boost the Boost Again",
            description: "Prestige Boost is raised to the power of 1.467.",
            cost: new Decimal(20),
            unlocked() { return hasUpgrade("g", 14) && (hasUpgrade("g", 21) || hasUpgrade("g", 22)) },
        },
        25: {
            title: "I Need More IV",
            description: "Prestige Points boost Generator Power gain.",
            cost: new Decimal("1e14"),
            currencyDisplayName: "Generator Power",
            currencyInternalName: "power",
            currencyLayer: "g",
            unlocked() { return hasUpgrade("g", 23) && hasUpgrade("g", 24) },
        },

        // --- PSEUDO UPGRADES ---
        31: {
            title: "Absurd Generation",
            description: "Generator Power multiplies the Super Generator base.",
            cost: new Decimal("e44000000"),
            currencyDisplayName: "Generator Power",
            currencyInternalName: "power",
            currencyLayer: "g",
            unlocked() { return false }, // Hidden condition placeholder
        },
        32: {
            title: "Primal Instincts",
            description: "The Quaternary Space Building also affects Discount Two.",
            cost: new Decimal(2200),
            unlocked() { return false }, // Hidden condition placeholder
        },
        33: {
            title: "Dust Production",
            description: "Generators boost Dust gain.",
            cost: new Decimal("e56000000"),
            currencyDisplayName: "Generator Power",
            currencyInternalName: "power",
            currencyLayer: "g",
            unlocked() { return false }, // Hidden condition placeholder
        },
        34: {
            title: "Boost the Boost Again^2",
            description: "Prestige Boost is raised to the power of 1.433.",
            cost: new Decimal(2200),
            unlocked() { return player.a.achievements.length >= 36 }, // Requires 36 achievements
        },
        35: {
            title: "Into The Future",
            description: "Nebula Energy, Honour, and Hyperspace Energy gains are boosted by Generator Power.",
            cost: new Decimal("e44000000"),
            currencyDisplayName: "Generator Power",
            currencyInternalName: "power",
            currencyLayer: "g",
            unlocked() { return false }, // Hidden condition placeholder
        },
    },
})
