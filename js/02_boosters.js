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
