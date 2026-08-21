addLayer("a", {
    name: "Achievements",
    symbol: "A",
    row: "side",
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievement power", 
    achievementPopups: true,
    
    achievements: {
        11: {
            name: "NOOO!",
            done() { return player.p.points.gte(1) },
            tooltip: "Perform a prestige reset.\n\nReward: Keep regular point generation on reset.",
        },
        12: {
            name: "Point Hog",
            done() { return player.points.gte(25) },
            tooltip: "Reach 25 regular points.\n\nReward: +5% Point generation.",
        },
        13: {
            name: "ROW 2 AWAITS!",
            done() { return player.p.upgrades.length >= 4 },
            tooltip: "Buy all 4 Prestige upgrades.\n\nReward: Unlocks Row 2. (Requirements: 200 points to choose your first layer, 1,000,000 points for the other).",
        },
        14: {
            name: "Boosted Efficiency",
            done() { return player.b.points.gte(5) },
            tooltip: "Have 5 Boosters.\n\nReward: Boosters no longer reset your Prestige Points.",
        },
        15: {
            name: "Power Generation",
            done() { return player.g.points.gte(5) },
            tooltip: "Have 5 Generators.\n\nReward: Generators generate 10% more resource.",
        },
        21: {
            name: "Perfect Harmony",
            done() { return player.b.points.gte(6) && player.g.points.gte(6) },
            tooltip: "Have 6 Boosters and 6 Generators.\n\nReward: Boosters and Generators no longer increase each other's cost requirements.",
        },
    },
})
