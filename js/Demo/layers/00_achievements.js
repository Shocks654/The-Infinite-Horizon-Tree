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
            tooltip: "Buy all 4 Prestige upgrades."
        }, // PERFECT!
    },
})
