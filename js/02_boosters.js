addLayer("b", {
    name: "Boosters",
    symbol: "B",
    row: 1,
    position: -1, // Placed on the left side of Row 1
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "#4bacdc",
    requires: new Decimal(100),
    resource: "boosters",
    baseResource: "prestige points",
    baseAmount() { return player.p.points },
    type: "static",
    exponent: 1.25,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    layerShown() { return hasUpgrade("p", 33) || player.b.unlocked }, // Unlocks dynamically

    milestones: {
        0: {
            requirement: new Decimal(8),
            unlocked() { return player.b.unlocked },
            requirementDescription: "8 Boosters",
            effectDescription: "Keep Prestige Upgrades on reset.",
        },
        1: {
            requirement: new Decimal(15),
            unlocked() { return player.b.unlocked },
            requirementDescription: "15 Boosters",
            effectDescription: "You can buy max Boosters.",
            effect() { return true } // Handled by standard engine for canBuyMax
        }
    }
})
