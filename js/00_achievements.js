addLayer("a", {
    name: "Achievements",
    symbol: "A",
    row: "side",
    startData() { return { unlocked: true, points: new Decimal(0) }},
    color: "yellow",
    resource: "achievement power", 
    achievementPopups: true,
    rows: 2, 
    cols: 5, // Expanded 2x5 grid for row 1 and 2

    achievements: {
        // --- ROW 1 ---
        11: {
            name: "All that progress is gone!",
            done() { return player.p && player.p.points.gte(1) },
            tooltip: "Perform a Prestige reset.",
            unlocked() { return true },
        },
        12: {
            name: "Point Hog",
            done() { return player.points.gte(25) },
            tooltip: "Reach 25 Points.\n\nReward: +5% Point generation.",
            unlocked() { return true },
        },
        13: {
            name: "Prestige all the Way",
            done() { return player.p && player.p.upgrades.length >= 3 },
            tooltip: "Purchase 3 Prestige Upgrades.\n\nReward: Gain 10% more Prestige Points.",
            unlocked() { return true },
        },
        14: {
            name: "Prestige^2",
            done() { return player.p && player.p.points.gte(25) },
            tooltip: "Reach 25 Prestige Points.",
            unlocked() { return true },
        },
        15: {
            name: "Primary Termination",
            done() { return player.p && player.p.upgrades.length >= 9 },
            tooltip: "Master Prestige.",
            unlocked() { return true },
        },

        // --- ROW 2 ---
        21: {
            name: "New Rows Await!",
            done() { return (player.b && player.b.points.gte(1)) || (player.g && player.g.points.gte(1)) },
            tooltip: "Perform a Row 2 reset.\n\nReward: Generate Points 10% faster, and unlock 3 new Prestige Upgrades.",
            unlocked() { return true },
        },
        22: {
            name: "I Will Have All of the Layers!",
            done() { return (player.b && player.b.unlocked) || (player.g && player.g.unlocked) },
            tooltip: "Unlock Boosters & Generators.",
            unlocked() { return true },
        },
        23: {
            name: "Prestige^3",
            done() { return player.p && player.p.points.gte(new Decimal("1e45")) },
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
            done() { return hasMilestone("b", 1) || hasMilestone("g", 2) },
            tooltip: "Master Boosters & Generators.",
            unlocked() { return true },
        },
    },
})
