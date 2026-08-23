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
    
    // Setting up the grid dimensions for the 3 achievements
    rows: 1, 
    cols: 3,

    achievements: {
        // --- ROW 1 ---
        11: {
            name: "NOOO!",
            done() { return player.p.points.gte(1) }, // Unlocked after the first Prestige reset
            tooltip: "Perform a prestige reset.\n\nReward: Keep regular point generation on reset.",
        },
        12: {
            name: "Point Hog",
            done() { return player.points.gte(25) }, // Unlocked upon reaching 25 points
            tooltip: "Reach 25 regular points.\n\nReward: +5% Point generation.",
        },
        13: {
            name: "ROW 2 AWAITS!",
            done() { return player.p.upgrades.length >= 4 }, // Unlocked after buying 4 Prestige upgrades
            tooltip: "Buy all 4 Prestige upgrades."
        },
    },
})
