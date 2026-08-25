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
