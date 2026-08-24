// ============================================================================
// LAYER 2: BOOSTERS (B) - SHIELDED INSULATION BLOCK
// ============================================================================
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
            if (player.g && player.g.unlocked && !player.b.unlocked) return formula.max(1000000);
            return formula;
        } catch(e) { return new Decimal(200); }
    },
    resource: "boosters",
    baseResource: "points", // Updated to track regular points for purchasing!
    baseAmount() { return player.points }, // Correctly tracks player regular points!
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
});
