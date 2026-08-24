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

    gainMult() { 
        let mult = new Decimal(1);
        try {
            if (player.p && player.p.upgrades) {
                if (player.p.upgrades.includes(21)) mult = mult.times(1.8);
                if (player.p.upgrades.includes(23)) {
                    let p_eff = player.points.add(1).log10().pow(1/3).add(1);
                    mult = mult.times(p_eff);
                }
                if (player.p.upgrades.includes(33)) {
                    let t_eff = player.p.points.add(1).log10().add(1).log10().div(5).add(1);
                    mult = mult.times(t_eff);
                }
            }
        } catch(e) { console.error("Prestige multiplier error shielded:", e); }
        
        try {
            if (player.b && player.b.unlocked && player.b.upgrades && player.b.upgrades.includes(11)) {
                let bx = new Decimal(player.b.points || 0);
                mult = mult.times(bx.sqrt().add(1));
            }
        } catch(e) { console.warn("Booster uninitialized shield active."); }
        
        try {
            if (player.g && player.g.unlocked && player.g.upgrades && player.g.upgrades.includes(11)) {
                let gx = new Decimal(player.g.points || 0);
                mult = mult.times(gx.sqrt().add(1));
            }
        } catch(e) { console.warn("Generator uninitialized shield active."); }
        return mult;
    },

    gainExp() { 
        try {
            let exp = new Decimal(1);
            if (player.p && player.p.upgrades && player.p.upgrades.includes(31)) exp = exp.times(1.05);
            return exp;
        } catch(e) { return new Decimal(1); }
    },

    doReset(resettingLayer) {
        try {
            let keep = [];
            if (resettingLayer === "b" && player.b && player.b.points && player.b.points.gte(8)) keep.push("upgrades");
            if (resettingLayer === "g" && player.g && player.g.points && player.g.points.gte(8)) keep.push("upgrades");
            if (layers[resettingLayer] && layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep);
        } catch(e) { console.error("Reset tracking shielded:", e); }
    },

    upgrades: {
        11: { title: "Begin", description: "Generate 1 Point every second.", cost: new Decimal(1)},
         12: {
            title: "Prestige Boost",
            description: "Prestige Points boost Point generation.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("p", 11) },
            // EXACT PT:R FORMULA: sqrt(x + 2) which yields ~1.73x at 1 PP and exactly 2.00x at 2 PP!
            effect() { 
                let eff = player.p.points.add(2).sqrt(); 
                return applySoftcap(eff, new Decimal("1e3500"), "log", 1);
            },
            effectDisplay() { try { return format(upgradeEffect(this.layer, this.id))+"x"; } catch(e) { return "1.41x"; }},
            },

        13: {
            title: "Self-Synergy",
            description: "Points boost their own generation.",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade("p", 12) },
            effect() { try { return player.points.add(1).log10().pow(0.75).add(1); } catch(e) { return new Decimal(1); } },
            effectDisplay() { try { return format(upgradeEffect(this.layer, this.id))+"x"; } catch(e) { return "1x"; } },
        },
        21: { title: "More Prestige", description: "Prestige Point gain is increased by 80%.", cost: new Decimal(20), unlocked() { return hasAchievement("a", 21) && hasUpgrade("p", 11) } },
        22: {
            title: "Upgrade Power",
            description: "Point generation is faster based on your Prestige Upgrades bought.",
            cost: new Decimal(75),
            unlocked() { return hasAchievement("a", 21) && hasUpgrade("p", 12) },
            effect() { try { return new Decimal(1.4).pow(player.p.upgrades.length); } catch(e) { return new Decimal(1); } },
            effectDisplay() { try { return format(upgradeEffect(this.layer, this.id))+"x"; } catch(e) { return "1x"; } },
        },
        23: {
            title: "Reverse Prestige Boost",
            description: "Prestige Point gain is boosted by your Points.",
            cost: new Decimal(5000),
            unlocked() { return hasAchievement("a", 21) && hasUpgrade("p", 13) },
            effect() { try { return player.points.add(1).log10().pow(1/3).add(1); } catch(e) { return new Decimal(1); } },
            effectDisplay() { try { return format(upgradeEffect(this.layer, this.id))+"x"; } catch(e) { return "1x"; } },
        },
        31: { title: "WE NEED MORE PRESTIGE", description: "Prestige Point gain is raised to the power of 1.05.", cost: new Decimal("1e45"), unlocked() { return hasAchievement("a", 23) && hasUpgrade("p", 21) } },
        32: { title: "Still Useless", description: "Upgrade Power is squared.", cost: new Decimal("1e56"), unlocked() { return hasAchievement("a", 23) && hasUpgrade("p", 22) } },
        33: {
            title: "Column Leader",
            description: "Both above upgrades are stronger based on your Total Prestige Points.",
            cost: new Decimal("1e60"),
            unlocked() { return hasAchievement("a", 23) && hasUpgrade("p", 23) },
            effect() { try { return player.p.points.add(1).log10().add(1).log10().div(5).add(1); } catch(e) { return new Decimal(1); } },
            effectDisplay() { try { return format(upgradeEffect(this.layer, this.id))+"x"; } catch(e) { return "1x"; } },
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
        try {
            let x = player.b.points;
            let formula = Decimal.pow(5, x.pow(1.25)).times(200);
            if (player.g && player.g.points) {
                let genAmount = new Decimal(player.g.points);
                if (genAmount.gt(0)) formula = formula.times(Decimal.pow(10, genAmount.pow(1.5)));
            }
            if (player.g && player.g.unlocked && !player.b.unlocked) return formula.max(1000000);
            return formula;
        } catch(e) { return new Decimal(200); }
    },
    resource: "boosters",
    baseResource: "points", 
    baseAmount() { return player.points }, 
    type: "static",
    exponent: 1.25,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    branches: ["p"], 
    layerShown() { try { return player.p && player.p.upgrades && player.p.upgrades.length >= 3; } catch(e) { return false; } },
    canBuyMax() { try { return player.b && player.b.points && player.b.points.gte(15); } catch(e) { return false; } },
    milestones: {
        0: { requirement: new Decimal(8), requirementDescription: "8 Boosters", effectDescription: "Keep Prestige Upgrades on reset.", done() { try { return player.b.points.gte(8); } catch(e) { return false; } } },
        1: { requirement: new Decimal(15), requirementDescription: "15 Boosters", effectDescription: "You can buy max Boosters.", done() { try { return player.b.points.gte(15); } catch(e) { return false; } } }
    },
    upgrades: {
        11: { title: "BP Combo", description: "Best Boosters boost Prestige Point gain.", cost: new Decimal(3), effect() { try { return player.b.points.sqrt().add(1); } catch(e) { return new Decimal(1); } } },
        12: { title: "Cross-Contamination", description: "Generators add to the Booster base.", cost: new Decimal(7), unlocked() { try { return player.b.unlocked || (player.g && player.g.unlocked); } catch(e) { return false; } }, effect() { try { let x = player.g ? player.g.points : new Decimal(0); return x.add(1).log10().add(1).sqrt().div(3); } catch(e) { return new Decimal(1); } } },
        13: { title: "PB Reversal", description: "Total Prestige Points add to the Booster effect base.", cost: new Decimal(8), unlocked() { try { return player.b.points.gte(7); } catch(e) { return false; } }, effect() { try { return player.p.points.add(1).log10().add(1).log10().div(3); } catch(e) { return new Decimal(1); } } },
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
        try {
            let x = player.g.points;
            let formula = Decimal.pow(5, x.pow(1.25)).times(200);
            if (player.b && player.b.points) {
                let boostAmount = new Decimal(player.b.points);
                if (boostAmount.gt(0)) formula = formula.times(Decimal.pow(10, boostAmount.pow(1.5)));
            }
            if (player.b && player.b.unlocked && !player.g.unlocked) return formula.max(1000000);
            return formula;
        } catch(e) { return new Decimal(200); }
    },
    resource: "generators",
    baseResource: "points", 
    baseAmount() { return player.points }, 
    type: "static",
    exponent: 1.25,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    branches: ["p"], 
    layerShown() { try { return player.p && player.p.upgrades && player.p.upgrades.length >= 3; } catch(e) { return false; } },
    canBuyMax() { try { return player.g && player.g.points && player.g.points.gte(15); } catch(e) { return false; } },
    update(diff) {
        try {
            if (player.g && player.g.unlocked) {
                let gain = player.g.points.pow(2);
                player.g.power = player.g.power.add(gain.times(diff));
                if (player.g.points.gte(10)) {
                    let ppGain = getResetGain("p");
                    player.p.points = player.p.points.add(ppGain.times(diff));
                }
            }
        } catch(e) { /* Shield telemetry active */ }
    },
    milestones: {
        0: { requirement: new Decimal(8), requirementDescription: "8 Generators", effectDescription: "Keep Prestige Upgrades on reset.", done() { try { return player.g.points.gte(8); } catch(e) { return false; } } },
        1: { requirement: new Decimal(10), requirementDescription: "10 Generators", effectDescription: "You gain 100% of Prestige Point gain every second.", done() { try { return player.g.points.gte(10); } catch(e) { return false; } } },
        2: { requirement: new Decimal(15), requirementDescription: "15 Generators", effectDescription: "You can buy max Generators.", done() { try { return player.g.points.gte(15); } catch(e) { return false; } } }
    },
    upgrades: {
        11: { title: "GP Combo", description: "Best Generators boost Prestige Point gain.", cost: new Decimal(3) },
        12: { title: "I Need More!", description: "Boosters add to the Generator base.", cost: new Decimal(7) },
        13: { title: "I Need More II", description: "Best Prestige Points add to the Generator base.", cost: new Decimal(8) },
    },
})
