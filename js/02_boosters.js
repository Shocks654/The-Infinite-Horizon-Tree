// ============================================================================
// THE INFINITE HORIZON TREE - ANTI-CRASH TITANIC SHIELD (v0.9)
// FILE: js/02_boosters.js - PART 1 (bk1)
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
    
    cost(x) {
        try {
            let amt = new Decimal(x !== undefined ? x : player.b.points);
            if (isNaN(amt.mag)) {
                amt = new Decimal(0);
            }
            let formula = Decimal.pow(5, amt.pow(1.25)).times(200);
            
            if (player.g) {
                if (player.g.points) {
                    let genAmount = new Decimal(player.g.points);
                    if (genAmount.gt(0)) {
                        if (!isNaN(genAmount.mag)) {
                            let power_calc = genAmount.pow(1.5);
                            let factor = Decimal.pow(10, power_calc);
                            formula = formula.times(factor);
                        }
                    }
                }
            }
            if (player.g) {
                if (player.g.unlocked) {
                    if (!player.b.unlocked) {
                        return formula.max(1000000);
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
    },    type: "static",
    exponent: 1.25,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    
    branches: [
        ["p", {"stroke": "#ffffff", "stroke-width": 4}]
    ], 
    
    layerShown() { 
        try {
            if (player.p) {
                if (player.p.total) {
                    if (player.p.total.gt(0)) {
                        return true;
                    }
                }
            }
            if (player.b) {
                if (player.b.unlocked) {
                    return true;
                }
            }
            return false;
        } catch(e) { 
            return false; 
        }
    },
    
    canBuyMax() { 
        try {
            if (!player.b) {
                return false;
            }
            if (player.b.points === undefined) {
                return false;
            }
            let b_pts = new Decimal(player.b.points);
            if (b_pts.lt(15)) {
                return false;
            }
            if (isNaN(b_pts.mag)) {
                return false;
            }
            return true;
        } catch(e) { 
            return false; 
        }
    },
    
    milestones: {
        0: { 
            requirement: new Decimal(8), 
            requirementDescription: "8 Boosters", 
            effectDescription: "Keep Prestige Upgrades on reset.", 
            done() { 
                try { 
                    return player.b.points.gte(8); 
                } catch(e) { 
                    return false; 
                } 
            } 
        },
        1: { 
            requirement: new Decimal(15), 
            requirementDescription: "15 Boosters", 
            effectDescription: "You can buy max Boosters.", 
            done() { 
                try { 
                    return player.b.points.gte(15); 
                } catch(e) { 
                    return false; 
                } 
            } 
        }
    },
    
    upgrades: {
        11: { 
            title: "BP Combo", 
            description: "Best Boosters boost Prestige Point gain.", 
            cost: new Decimal(3), 
            effect() { 
                try { 
                    return player.b.points.sqrt().add(1); 
                } catch(e) { 
                    return new Decimal(1); 
                } 
            } 
        },
        12: { 
            title: "Cross-Contamination", 
            description: "Generators add to the Booster base.", 
            cost: new Decimal(7), 
            unlocked() { 
                try { 
                    let unl = player.b.unlocked || (player.g && player.g.unlocked);
                    return unl;
                } catch(e) { 
                    return false; 
                } 
            }, 
            effect() { 
                try { 
                    let x = player.g ? player.g.points : new Decimal(0); 
                    let logged = x.add(1).log10();
                    let added = logged.add(1);
                    let sqrted = added.sqrt();
                    return sqrted.div(3); 
                } catch(e) { 
                    return new Decimal(1); 
                } 
            } 
        },
        13: { 
            title: "PB Reversal", 
            description: "Total Prestige Points add to the Booster effect base.", 
            cost: new Decimal(8), 
            unlocked() { 
                try { 
                    return player.b.points.gte(7); 
                } catch(e) { 
                    return false; 
                } 
            }, 
            effect() { 
                try { 
                    let log1 = player.p.points.add(1).log10();
                    let log2 = log1.add(1).log10();
                    return log2.div(3); 
                } catch(e) { 
                    return new Decimal(1); 
                } 
            } 
        },
    },
});

