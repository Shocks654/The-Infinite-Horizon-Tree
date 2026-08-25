// ============================================================================
// THE INFINITE HORIZON TREE - ANTI-CRASH TITANIC SHIELD (v0.9)
// FILE: js/02_boosters.js - GENUINE PT:R MATH UPGRADES
// ============================================================================

addLayer("b", {
    name: "Boosters",
    symbol: "B",
    row: 1,
    position: -1, 
    
    startData() { 
        return { 
            unlocked: false, 
            points: new Decimal(0) 
        }; 
    },
    
    color: "#4b0082", 

    effect() {
        try {
            let b_amt = new Decimal(player.b.points || 0);
            if (isNaN(b_amt.mag)) {
                return new Decimal(1);
            }
            return Decimal.pow(2, b_amt);
        } catch(e) { 
            return new Decimal(1); 
        }
    },
    
    effectDescription() {
        try { 
            let val = this.effect();
            return "which are boosting Point generation by " + format(val) + "x"; 
        } catch(e) { 
            return "boosting by 1x"; 
        }
    },
    
       // CLEAN COOP COST IMPLEMENTATION: 200^(amount + 1)^1.3826827
    cost(x) {
        try {
            let amt = new Decimal(x !== undefined ? x : player.b.points);
            if (isNaN(amt.mag)) {
                amt = new Decimal(0);
            }
            
            // Unwrapped clean mathematical scaling sequence
            let amountNumber = amt.toNumber();
            let baseShift = amountNumber + 1;
            let exponentPower = Math.pow(baseShift, 1.3826827);
            let formula = Decimal.pow(200, exponentPower);
            
            // Hard execution barrier if alternative layer is chosen first
            if (player.g) {
                if (player.g.unlocked === true) {
                    if (player.b.unlocked === false) {
                        return new Decimal("1e300"); 
                    }
                }
            }
            return formula;
        } catch(e) { 
            return new Decimal(200); 
        }
    },


    
    resource: "boosters",
    baseResource: "points", 
    
    baseAmount() { 
        try { 
            if (player.points) {
                if (!isNaN(player.points.mag)) {
                    return player.points;
                }
            }
            return new Decimal(0);
        } catch(e) { 
            return new Decimal(0); 
        }
    }, 

    type: "static",
    exponent: 1.25,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    
    branches: [
        ["p", {"stroke": "#ffffff", "stroke-width": 4}]
    ], 
    
    layerShown() { 
        try {
            if (player.g && player.g.unlocked === true && player.b.unlocked === false) {
                return false; 
            }
            if (player.p && player.p.total && player.p.total.gt(0)) {
                return true;
            }
            return false;
        } catch(e) { 
            return false; 
        }
    },
    
    canBuyMax() { return false; },
    
    milestones: {
        0: { 
            requirement: new Decimal(8), 
            requirementDescription: "8 Boosters", 
            effectDescription: "Keep Prestige Upgrades on reset.", 
            done() { try { return player.b.points.gte(8); } catch(e) { return false; } } 
        },
        1: { 
            requirement: new Decimal(15), 
            requirementDescription: "15 Boosters", 
            effectDescription: "You can buy max Boosters.", 
            done() { try { return player.b.points.gte(15); } catch(e) { return false; } } 
        }
    },
    
    upgrades: {
        11: { 
            title: "BP Combo", 
            description: "Best Boosters boost Prestige Point gain.", 
            cost: new Decimal(3), 
            effect() { 
                try { return player.b.points.sqrt().add(1); } catch(e) { return new Decimal(1); } 
            } 
        },
        12: { 
            title: "Cross-Contamination", 
            description: "Generators add to the Booster base.", 
            cost: new Decimal(7), 
            unlocked() { try { return player.b.unlocked || (player.g && player.g.unlocked); } catch(e) { return false; } }, 
            // PT:R FORMULA INJECTION
            currently() {
                try {
                    let x = player.g ? player.g.points : new Decimal(0);
                    return new Decimal(x).times(0.5); 
                } catch(e) { return new Decimal(0); }
            }
        },
        13: { 
            title: "PB Reversal", 
            description: "Total Prestige Points add to the Booster effect base.", 
            cost: new Decimal(8), 
            unlocked() { try { return player.b.points.gte(7); } catch(e) { return false; } }, 
            // PT:R FORMULA INJECTION
            currently() {
                try {
                    let log1 = player.p.points.add(1).log10();
                    return log1.div(2);
                } catch(e) { return new Decimal(0); }
            }
        },
    },
});
