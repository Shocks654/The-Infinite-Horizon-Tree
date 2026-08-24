addLayer("b", {
    name: "Boosters",
    symbol: "B",
    row: 1,
    position: -1, 
    startData() { return { unlocked: false, points: new Decimal(0) }},
    color: "#4b0082", 
    
    // JEEHAN STATIC COST METHOD: Uses the raw parameter 'x' to calculate solid scaling
    cost(x) {
        try {
            let amt = new Decimal(x !== undefined ? x : player.b.points);
            let formula = Decimal.pow(5, amt.pow(1.25)).times(200);
            
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
    branches: [
        ["p", {"stroke": "#ffffff", "stroke-width": 4}]
    ], 
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
