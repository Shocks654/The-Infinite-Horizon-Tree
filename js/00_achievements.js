// ============================================================================
// THE INFINITE HORIZON TREE - ANTI-CRASH TITANIC SHIELD (v0.9)
// FILE: js/00_achievements.js - BULKY VERSION
// ============================================================================

addLayer("a", {
    name: "Achievements",
    symbol: "A",
    row: "side",
    
    startData() { 
        return { 
            unlocked: true, 
            points: new Decimal(0) 
        }; 
    },
    
    color: "yellow",
    resource: "achievement power", 
    achievementPopups: true,
    rows: 2, 
    cols: 5,

    layerShown() { 
        return true; 
    },

    achievements: {
        11: { 
            name: "All that progress is gone!", 
            done() { 
                if (player.p) {
                    if (player.p.points) {
                        return player.p.points.gte(1);
                    }
                }
                return false;
            }, 
            tooltip: "Perform a Prestige reset.", 
            unlocked() { 
                return true; 
            } 
        },
        12: { 
            name: "Point Hog", 
            done() { 
                if (player.points) {
                    return player.points.gte(25);
                }
                return false;
            }, 
            tooltip: "Reach 25 Points.", 
            unlocked() { 
                return true; 
            } 
        },
        13: { 
            name: "Prestige all the Way", 
            done() { 
                if (player.p) {
                    if (player.p.upgrades) {
                        return player.p.upgrades.length >= 3;
                    }
                }
                return false;
            }, 
            tooltip: "Purchase 3 Prestige Upgrades.", 
            unlocked() { 
                return true; 
            } 
        },
        14: { 
            name: "Prestige^2", 
            done() { 
                if (player.p) {
                    if (player.p.points) {
                        return player.p.points.gte(25);
                    }
                }
                return false;
            }, 
            tooltip: "Reach 25 Prestige Points.", 
            unlocked() { 
                return true; 
            } 
        },
        15: { 
            name: "Primary Termination", 
            done() { 
                return false; 
            }, 
            tooltip: "Master Prestige.", 
            unlocked() { 
                return true; 
            } 
        },
        21: { 
            name: "New Rows Await!", 
            done() { 
                let b_pts = false;
                let g_pts = false;
                if (player.b) {
                    if (player.b.points) {
                        b_pts = player.b.points.gte(1);
                    }
                }
                if (player.g) {
                    if (player.g.points) {
                        g_pts = player.g.points.gte(1);
                    }
                }
                return b_pts || g_pts;
            }, 
            tooltip: "Perform a Row 2 reset.", 
            unlocked() { 
                return true; 
            } 
        },
        22: { 
            name: "I Will Have All of the Layers!", 
            done() { 
                let b_unl = false;
                let g_unl = false;
                if (player.b) {
                    b_unl = player.b.unlocked;
                }
                if (player.g) {
                    g_unl = player.g.unlocked;
                }
                return b_unl || g_unl;
            }, 
            tooltip: "Unlock Boosters & Generators.", 
            unlocked() { 
                return true; 
            } 
        },
        23: { 
            name: "Prestige^3", 
            done() { 
                if (player.p) {
                    if (player.p.points) {
                        return player.p.points.gte(new Decimal("1e45"));
                    }
                }
                return false;
            }, 
            tooltip: "Reach 1e45 Prestige Points.", 
            unlocked() { 
                return true; 
            } 
        },
        24: { 
            name: "Hey I don't own that company yet!", 
            done() { 
                if (player.points) {
                    return player.points.gte(new Decimal("1e100"));
                }
                return false;
            }, 
            tooltip: "Reach 1e100 Points.", 
            unlocked() { 
                return true; 
            } 
        },
        25: { 
            name: "Secondary Increment", 
            done() { 
                let b_m = false;
                let g_m = false;
                if (player.b) {
                    if (player.b.milestones) {
                        b_m = player.b.milestones.includes("1");
                    }
                }
                if (player.g) {
                    if (player.g.milestones) {
                        g_m = player.g.milestones.includes("2");
                    }
                }
                return b_m || g_m;
            }, 
            tooltip: "Master Boosters & Generators.", 
            unlocked() { 
                return true; 
            } 
        },
    },
});
