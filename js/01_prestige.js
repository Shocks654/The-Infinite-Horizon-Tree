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
        11: { title: "Begin", description: "Generate 1 Point every second.", cost: new Decimal(2) },
        12: {
            title: "Prestige Boost",
            description: "Prestige Points boost Point generation.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("p", 11) },
            effect() { 
                try {
                    let eff = player.p.points.add(2).pow(0.5);
                    return applySoftcap(eff, new Decimal("1e3500"), "log", 1);
                } catch(e) { return new Decimal(1); }
            },
            effectDisplay() { try { return format(upgradeEffect(this.layer, this.id))+"x"; } catch(e) { return "1x"; } },
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
