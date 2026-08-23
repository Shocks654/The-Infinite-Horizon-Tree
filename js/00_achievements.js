addLayer("a", {
    name: "Achievements",
    symbol: "A",
    row: "side", // Appears as a side tab in the menu
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievement power", 
    achievementPopups: true,
    
    // Configured for a 2x5 grid layout to fit all your planned row 1 & 2 milestones
    rows: 2, 
    cols: 5,

    achievements: {
        // --- ROW 1 (Original 3 Restored + 14 and 15 Placeholder) ---
        11: {
            name: "NOOO!",
            done() { return player.p.points.gte(1) }, // Performs a prestige reset
            tooltip: "Perform a prestige reset.\n\nReward: Keep regular point generation on reset.",
            unlocked() { return true }, 
        },
        12: {
            name: "Point Hog",
            done() { return player.points.gte(25) }, // Reach 25 regular points
            tooltip: "Reach 25 regular points.\n\nReward: +5% Point generation.",
            unlocked() { return true }, 
        },
        13: {
            name: "ROW 2 AWAITS!",
            done() { return player.p.upgrades.length >= 4 }, // Purchase 4 upgrades to unlock Row 2
            tooltip: "Buy all 4 Prestige upgrades.",
            unlocked() { return true }, 
        },
        14: {
            name: "Prestige^2",
            done() { return player.p.points.gte(25) }, // Reached 25 Prestige Points
            tooltip: "Reach 25 Prestige Points.",
            unlocked() { return true },
        },
        15: {
            name: "Primary Termination",
            done() { return false }, // Placeholder: Will be programmed later with the Mastery layer!
            tooltip: "Master Prestige.\n\nReward: Unlocks when Mastery layer is added.",
            unlocked() { return true },
        },

        // --- ROW 2 ---
        21: {
            name: "New Rows Await!",
            done() { return player.b.points.gte(1) || player.g.points.gte(1) }, // Row 2 reset done
            tooltip: "Perform a Row 2 reset.\n\nReward: Generate Points 10% faster, and unlock 3 new Prestige Upgrades.",
            unlocked() { return true },
        },
        22: {
            name: "I Will Have All of the Layers!",
            done() { return player.b.unlocked || player.g.unlocked },
            tooltip: "Unlock Boosters & Generators.",
            unlocked() { return true },
        },
        23: {
            name: "Prestige^3",
            done() { return player.p.points.gte(new Decimal("1e45")) },
            tooltip: "Reach 1e45 Prestige Points.\n\nReward: Unlock 3 new Prestige Upgrades.",
            unlocked() { return true },
        },
        24: {
            name: "Hey I don't own that company yet!",
            done() { return player.points.gte(new Decimal("1e100")) },
            tooltip: "Reach 1e100 Points.",
            unlocked() { return true },
        },
        25: {
            name: "Secondary Increment",
            done() { return false }, // Placeholder: Will be programmed later with the Mastery layer!
            tooltip: "Master Boosters & Generators.\n\nReward: Unlocks when Mastery layer is added.",
            unlocked() { return true },
        },
    },
})
