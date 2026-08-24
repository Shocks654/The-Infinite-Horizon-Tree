addLayer("a", {
    name: "Achievements",
    symbol: "A",
    row: "side",
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "yellow",
    resource: "achievement power", 
    achievementPopups: true,
    rows: 2, 
    cols: 5,

    layerShown() { return true },

    achievements: {
        11: { name: "All that progress is gone!", done() { return player.p && player.p.points.gte(1) }, tooltip: "Perform a Prestige reset.", unlocked() { return true } },
        12: { name: "Point Hog", done() { return player.points.gte(25) }, tooltip: "Reach 25 Points.", unlocked() { return true } },
        13: { name: "Prestige all the Way", done() { return player.p && player.p.upgrades.length >= 3 }, tooltip: "Purchase 3 Prestige Upgrades.", unlocked() { return true } },
        14: { name: "Prestige^2", done() { return player.p && player.p.points.gte(25) }, tooltip: "Reach 25 Prestige Points.", unlocked() { return true } },
        15: { name: "Primary Termination", done() { return false }, tooltip: "Master Prestige.", unlocked() { return true } },
        
        21: { name: "New Rows Await!", done() { return (player.b && player.b.points.gte(1)) || (player.g && player.g.points.gte(1)) }, tooltip: "Perform a Row 2 reset.", unlocked() { return true } },
        22: { name: "I Will Have All of the Layers!", done() { return (player.b && player.b.unlocked) || (player.g && player.g.unlocked) }, tooltip: "Unlock Boosters & Generators.", unlocked() { return true } },
        23: { name: "Prestige^3", done() { return player.p && player.p.points.gte(new Decimal("1e45")) }, tooltip: "Reach 1e45 Prestige Points.", unlocked() { return true } },
        24: { name: "Hey I don't own that company yet!", done() { return player.points.gte(new Decimal("1e100")) }, tooltip: "Reach 1e100 Points.", unlocked() { return true } },
        
        // ULTIMATE SAFENET: Direct array lookup that bypasses easyAccess.js entirely!
        25: { 
            name: "Secondary Increment", 
            done() { 
                let b_m = (player.b && player.b.milestones && player.b.milestones.includes("1"));
                let g_m = (player.g && player.g.milestones && player.g.milestones.includes("2"));
                return b_m || g_m;
            }, 
            tooltip: "Master Boosters & Generators.", 
            unlocked() { return true } 
        },
    },
})
