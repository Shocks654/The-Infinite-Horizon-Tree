// ============================================================================
// THE INFINITE HORIZON TREE - ANTI-CRASH TITANIC SHIELD (v0.9)
// FILE: js/01_prestige.js - PART 1 (pk1)
// ============================================================================

addLayer("p", {
    name: "prestige",
    symbol: "P",
    row: 0, 
    position: 0, 
    
    layerShown() { 
        return true; 
    }, 
    
    startData() { 
        return { 
            unlocked: true, 
            points: new Decimal(0) 
        }; 
    },
    
    color: "#008080", 
    requires: new Decimal(10), 
    resource: "prestige points", 
    baseResource: "points", 
    
    baseAmount() { 
        return player.points; 
    }, 
    
    type: "normal", 
    exponent: 0.5, 

    gainMult() { 
        let mult = new Decimal(1);
        
        try {
            if (player.p) {
                if (player.p.upgrades) {
                    if (player.p.upgrades.includes(21)) {
                        mult = mult.times(1.8);
                    }
                }
            }
        } catch(e) { 
            console.error("Shielded P21 calculation:", e); 
        }
        
        try {
            if (player.p) {
                if (player.p.upgrades) {
                    if (player.p.upgrades.includes(23)) {
                        let baseLog = player.points.add(1).log10();
                        let p_eff = baseLog.pow(1/3).add(1);
                        mult = mult.times(p_eff);
                    }
                }
            }
        } catch(e) { 
            console.error("Shielded P23 calculation:", e); 
        }
        
        try {
            if (player.p) {
                if (player.p.upgrades) {
                    if (player.p.upgrades.includes(33)) {
                        let firstLog = player.p.points.add(1).log10();
                        let secondLog = firstLog.add(1).log10();
                        let t_eff = secondLog.div(5).add(1);
                        mult = mult.times(t_eff);
                    }
                }
            }
        } catch(e) { 
            console.error("Shielded P33 calculation:", e); 
        }
        
        try {
            if (player.b) {
                if (player.b.unlocked) {
                    if (player.b.upgrades) {
                        if (player.b.upgrades.includes(11)) {
                            let bx = new Decimal(player.b.points || 0);
                            if (!isNaN(bx.mag)) {
                                let b_sqrt = bx.sqrt();
                                let b_final = b_sqrt.add(1);
                                mult = mult.times(b_final);
                            }
                        }
                    }
                }
            }
        } catch(e) { 
            console.warn("Booster memory shield active."); 
        }
        
        try {
            if (player.g) {
                if (player.g.unlocked) {
                    if (player.g.upgrades) {
                        if (player.g.upgrades.includes(11)) {
                            let gx = new Decimal(player.g.points || 0);
                            if (!isNaN(gx.mag)) {
                                let g_sqrt = gx.sqrt();
                                let g_final = g_sqrt.add(1);
                                mult = mult.times(g_final);
                            }
                        }
                    }
                }
            }
        } catch(e) { 
            console.warn("Generator memory shield active."); 
        }
        
        return mult;
    },

    gainExp() { 
        try {
            let exp = new Decimal(1);
            if (player.p) {
                if (player.p.upgrades) {
                    if (player.p.upgrades.includes(31)) {
                        exp = exp.times(1.05);
                    }
                }
            }
            return exp;
        } catch(e) { 
            return new Decimal(1); 
        }
    },
    doReset(resettingLayer) {
        try {
            let keep = [];
            if (resettingLayer === "b") {
                if (player.b) {
                    if (player.b.points) {
                        let checkB = new Decimal(player.b.points);
                        if (checkB.gte(8)) {
                            keep.push("upgrades");
                        }
                    }
                }
            }
            if (resettingLayer === "g") {
                if (player.g) {
                    if (player.g.points) {
                        let checkG = new Decimal(player.g.points);
                        if (checkG.gte(8)) {
                            keep.push("upgrades");
                        }
                    }
                }
            }
            if (layers[resettingLayer]) {
                if (layers[resettingLayer].row > this.row) {
                    layerDataReset(this.layer, keep);
                }
            }
        } catch(e) { 
            console.error("Reset barrier layer shield error:", e); 
        }
    },

    upgrades: {
        11: { 
            title: "Begin", 
            description: "Generate 1 Point every second.", 
            cost: new Decimal(1) 
        },
        12: {
            title: "Prestige Boost",
            description: "Prestige Points boost Point generation.",
            cost: new Decimal(1),
            unlocked() { 
                return hasUpgrade("p", 11); 
            },
            effect() { 
                try {
                    let p_pts = new Decimal(player.p.points || 0);
                    if (isNaN(p_pts.mag)) {
                        return new Decimal(1.41);
                    }
                    let eff = p_pts.add(2).sqrt();
                    return applySoftcap(eff, new Decimal("1e3500"), "log", 1);
                } catch(e) { 
                    return new Decimal(1.41); 
                }
            },
            effectDisplay() { 
                try { 
                    let value = upgradeEffect(this.layer, this.id);
                    return format(value) + "x"; 
                } catch(e) { 
                    return "1.41x"; 
                } 
            },
        },
        13: {
            title: "Self-Synergy",
            description: "Points boost their own generation.",
            cost: new Decimal(5),
            unlocked() { 
                return hasUpgrade("p", 12); 
            },
            effect() { 
                try {
                    let pts = new Decimal(player.points || 0);
                    if (isNaN(pts.mag)) {
                        return new Decimal(1);
                    }
                    let log_base = pts.add(1).log10();
                    let power_scale = log_base.pow(0.75);
                    return power_scale.add(1);
                } catch(e) { 
                    return new Decimal(1); 
                }
            },
            effectDisplay() { 
                try { 
                    let value = upgradeEffect(this.layer, this.id);
                    return format(value) + "x"; 
                } catch(e) { 
                    return "1x"; 
                } 
            },
        },
        21: { 
            title: "More Prestige", 
            description: "Prestige Point gain is increased by 80%.", 
            cost: new Decimal(20), 
            unlocked() { 
                let condition = hasAchievement("a", 21) && hasUpgrade("p", 11);
                return condition;
            } 
        },
        22: {
            title: "Upgrade Power",
            description: "Point generation is faster based on your Prestige Upgrades bought.",
            cost: new Decimal(75),
            unlocked() { 
                let condition = hasAchievement("a", 21) && hasUpgrade("p", 12);
                return condition;
            },
            effect() { 
                try { 
                    let base_num = new Decimal(1.4);
                    let power_num = player.p.upgrades.length;
                    return base_num.pow(power_num); 
                } catch(e) { 
                    return new Decimal(1); 
                } 
            },
            effectDisplay() { 
                try { 
                    let value = upgradeEffect(this.layer, this.id);
                    return format(value) + "x"; 
                } catch(e) { 
                    return "1x"; 
                } 
            },
        },
        23: {
            title: "Reverse Prestige Boost",
            description: "Prestige Point gain is boosted by your Points.",
            cost: new Decimal(5000),
            unlocked() { 
                let condition = hasAchievement("a", 21) && hasUpgrade("p", 13);
                return condition;
            },
            effect() { 
                try { 
                    let log_val = player.points.add(1).log10();
                    let root_val = log_val.pow(1/3);
                    return root_val.add(1); 
                } catch(e) { 
                    return new Decimal(1); 
                } 
            },
            effectDisplay() { 
                try { 
                    let value = upgradeEffect(this.layer, this.id);
                    return format(value) + "x"; 
                } catch(e) { 
                    return "1x"; 
                } 
            },
        },
        31: { 
            title: "WE NEED MORE PRESTIGE", 
            description: "Prestige Point gain is raised to the power of 1.05.", 
            cost: new Decimal("1e45"), 
            unlocked() { 
                let condition = hasAchievement("a", 23) && hasUpgrade("p", 21);
                return condition;
            } 
        },
        32: { 
            title: "Still Useless", 
            description: "Upgrade Power is squared.", 
            cost: new Decimal("1e56"), 
            unlocked() { 
                let condition = hasAchievement("a", 23) && hasUpgrade("p", 22);
                return condition;
            } 
        },
        33: {
            title: "Column Leader",
            description: "Both above upgrades are stronger based on your Total Prestige Points.",
            cost: new Decimal("1e60"),
            unlocked() { 
                let condition = hasAchievement("a", 23) && hasUpgrade("p", 23);
                return condition;
            },
            effect() { 
                try { 
                    let log1 = player.p.points.add(1).log10();
                    let log2 = log1.add(1).log10();
                    let calculation = log2.div(5);
                    return calculation.add(1); 
                } catch(e) { 
                    return new Decimal(1); 
                } 
            },
            effectDisplay() { 
                try { 
                    let value = upgradeEffect(this.layer, this.id);
                    return format(value) + "x"; 
                } catch(e) { 
                    return "1x"; 
                } 
            },
        },
    },
});

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

// ============================================================================
// THE INFINITE HORIZON TREE - ANTI-CRASH TITANIC SHIELD (v0.9)
// FILE: js/03_generators.js - PART 1 (gk1)
// ============================================================================

addLayer("g", {
    name: "Generators",
    symbol: "G",
    row: 1,
    position: 1, 
    
    startData() { 
        return { 
            unlocked: false, 
            points: new Decimal(0), 
            power: new Decimal(0) 
        }; 
    },
    
    color: "#98fb98", 

    effect() {
        try {
            let g_amt = new Decimal(player.g.points || 0);
            if (isNaN(g_amt.mag)) {
                return new Decimal(1);
            }
            return Decimal.pow(2, g_amt);
        } catch(e) { 
            return new Decimal(1); 
        }
    },
    
    effectDescription() {
        try { 
            let val = this.effect();
            return "which are boosting Generator Power gain by " + format(val) + "x"; 
        } catch(e) { 
            return "boosting by 1x"; 
        }
    },
    
    cost(x) {
        try {
            let amt = new Decimal(x !== undefined ? x : player.g.points);
            if (isNaN(amt.mag)) {
                amt = new Decimal(0);
            }
            let formula = Decimal.pow(5, amt.pow(1.25)).times(200);
            
            if (player.b) {
                if (player.b.points) {
                    let boostAmount = new Decimal(player.b.points);
                    if (boostAmount.gt(0)) {
                        if (!isNaN(boostAmount.mag)) {
                            let power_calc = boostAmount.pow(1.5);
                            let factor = Decimal.pow(10, power_calc);
                            formula = formula.times(factor);
                        }
                    }
                }
            }
            if (player.b) {
                if (player.b.unlocked) {
                    if (!player.g.unlocked) {
                        return formula.max(1000000);
                    }
                }
            }
            return formula;
        } catch(e) { 
            return new Decimal(200); 
        }
    },
    
    resource: "generators",
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
            if (player.p) {
                if (player.p.total) {
                    if (player.p.total.gt(0)) {
                        return true;
                    }
                }
            }
            if (player.g) {
                if (player.g.unlocked) {
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
            if (!player.g) {
                return false;
            }
            if (player.g.points === undefined) {
                return false;
            }
            let g_pts = new Decimal(player.g.points);
            if (g_pts.lt(15)) {
                return false;
            }
            if (isNaN(g_pts.mag)) {
                return false;
            }
            return true;
        } catch(e) { 
            return false; 
        }
    },
    
    update(diff) {
        try {
            if (player.g) {
                if (player.g.unlocked) {
                    let gain = player.g.points.pow(2);
                    let g_eff = this.effect();
                    if (!isNaN(g_eff.mag)) {
                        gain = gain.times(g_eff);
                    }
                    player.g.power = player.g.power.add(gain.times(diff));
                    
                    if (player.g.points.gte(10)) {
                        let ppGain = getResetGain("p");
                        if (!isNaN(ppGain.mag)) {
                            player.p.points = player.p.points.add(ppGain.times(diff));
                        }
                    }
                }
            }
        } catch(e) { 
            /* Shield active */ 
        }
    },
    
    milestones: {
        0: { 
            requirement: new Decimal(8), 
            requirementDescription: "8 Generators", 
            effectDescription: "Keep Prestige Upgrades on reset.", 
            done() { 
                try { 
                    return player.g.points.gte(8); 
                } catch(e) { 
                    return false; 
                } 
            } 
        },
        1: { 
            requirement: new Decimal(10), 
            requirementDescription: "10 Generators", 
            effectDescription: "You gain 100% of Prestige Point gain every second.", 
            done() { 
                try { 
                    return player.g.points.gte(10); 
                } catch(e) { 
                    return false; 
                } 
            } 
        },
        2: { 
            requirement: new Decimal(15), 
            requirementDescription: "15 Generators", 
            effectDescription: "You can buy max Generators.", 
            done() { 
                try { 
                    return player.g.points.gte(15); 
                } catch(e) { 
                    return false; 
                } 
            } 
        }
    },
    
    upgrades: {
        11: { 
            title: "GP Combo", 
            description: "Best Generators boost Prestige Point gain.", 
            cost: new Decimal(3) 
        },
        12: { 
            title: "I Need More!", 
            description: "Boosters add to the Generator base.", 
            cost: new Decimal(7) 
        },
        13: { 
            title: "I Need More II", 
            description: "Best Prestige Points add to the Generator base.", 
            cost: new Decimal(8) 
        },
    },
});
