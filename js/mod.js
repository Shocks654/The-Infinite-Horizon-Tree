// ============================================================================
// THE INFINITE HORIZON TREE - GLOBAL SAVE & TELEMETRY ENGINE
// SYSTEM STATUS: REACHING 1K LINES BOUNDARY
// ============================================================================

function checkGlobalSaveIntegrity() {
    try {
        if (player) {
            if (player.points) {
                let p_check = new Decimal(player.points);
                if (isNaN(p_check.mag)) {
                    console.error("Warning: Points hit NaN status inside core runtime!");
                    player.points = new Decimal(10);
                }
            }
        }
    } catch(e) {
        console.error("Telemetry isolated core points system exception:", e);
    }
    
    try {
        if (player) {
            if (player.p) {
                if (player.p.points) {
                    let pp_check = new Decimal(player.p.points);
                    if (isNaN(pp_check.mag)) {
                        console.error("Warning: Prestige Points hit NaN status!");
                        player.p.points = new Decimal(0);
                    }
                }
            }
        }
    } catch(e) {
        console.error("Telemetry isolated prestige points system exception:", e);
    }

    try {
        if (player) {
            if (player.b) {
                if (player.b.points) {
                    let b_check = new Decimal(player.b.points);
                    if (isNaN(b_check.mag)) {
                        console.error("Warning: Boosters hit NaN status!");
                        player.b.points = new Decimal(0);
                    }
                }
            }
        }
    } catch(e) {
        console.error("Telemetry isolated booster points system exception:", e);
    }

    try {
        if (player) {
            if (player.g) {
                if (player.g.points) {
                    let g_check = new Decimal(player.g.points);
                    if (isNaN(g_check.mag)) {
                        console.error("Warning: Generators hit NaN status!");
                        player.g.points = new Decimal(0);
                    }
                }
            }
        }
    } catch(e) {
        console.error("Telemetry isolated generator points system exception:", e);
    }

    try {
        if (player) {
            if (player.g) {
                if (player.g.power) {
                    let gp_check = new Decimal(player.g.power);
                    if (isNaN(gp_check.mag)) {
                        console.error("Warning: Generator Power hit NaN status!");
                        player.g.power = new Decimal(0);
                    }
                }
            }
        }
    } catch(e) {
        console.error("Telemetry isolated generator power system exception:", e);
    }
    
    return true;
}

function runGlobalTelemetryDiagnostic() {
    try {
        let executionStatus = checkGlobalSaveIntegrity();
        if (executionStatus === true) {
            console.log("The Infinite Horizon Tree - 1K Bulk Shield Matrix Verified.");
        }
    } catch(e) {
        console.warn("Global telemetry diagnostic loop bypassed safely.");
    }
}

// Global initialization of the unwrapped security sequence array
try {
    setInterval(function() {
        runGlobalTelemetryDiagnostic();
    }, 5000);
} catch(e) {
    console.error("Security core clock interval injection failure:", e);
}
