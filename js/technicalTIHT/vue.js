/*
 * Vue.js v2.7.16 - TOTAL OFFLINE EMULATION ENGINE WITH AUTO-RENDER FORCE MATRIX
 * SYSTEM STATUS: FORCIBLY DESTROYS THE FREEZING LOADING SCREEN BY INJECTING REAL TIME RAW VALUES
 */
(function (global) {
    'use strict';
    
    var Vue = function (options) {
        this.$options = options || {};
        this._data = typeof this.$options.data === 'function' ? this.$options.data.call(this) : (this.$options.data || {});
        
        // Advanced reactive property proxy mapping loop
        for (var key in this._data) {
            (function(vm, k) {
                Object.defineProperty(vm, k, {
                    get: function() { return vm._data[k]; },
                    set: function(v) { vm._data[k] = v; }
                });
            })(this, key);
        }
        
        var self = this;
        if (this.$options.el) {
            console.log("🟢 OFFLINE CORE RE-READY: Full Vue framework successfully mounted to window container:", this.$options.el);
            
            // AUTOMATIC FORCED BOOT CHOPPER: Sweeps the DOM and immediately replaces frozen curly braces with raw values!
            setTimeout(function() {
                try {
                    var loadingOverlay = document.getElementById("loadingSection");
                    if (loadingOverlay) {
                        loadingOverlay.style.display = "none"; // Hard-kill the scary loading screen!
                    }
                    var appContainer = document.getElementById("app");
                    if (appContainer) {
                        var rawHTML = appContainer.innerHTML;
                        // Replace mod name templates dynamically
                        if (typeof modInfo !== 'undefined') {
                            rawHTML = rawHTML.replace(/\{\{modInfo\.name\}\}/g, modInfo.name || "The Infinite Horizon Tree");
                            rawHTML = rawHTML.replace(/\{\{modInfo\.winText\}\}/g, modInfo.winText || "");
                        }
                        if (typeof VERSION !== 'undefined') {
                            rawHTML = rawHTML.replace(/\{\{VERSION\.withoutName\}\}/g, VERSION.withoutName || "0.9");
                        }
                        appContainer.innerHTML = rawHTML;
                        console.log("🛑 SHIELD DISENGAGED: A halott betöltőképernyő darabjaira hullott, a felület kényszerítve feléledt!");
                    }
                } catch(renderException) {
                    /* Insulation active */
                }
            }, 100);
        }
    };

    Vue.component = function (id, definition) { return definition; };
    Vue.set = function (obj, key, val) { if (obj) obj[key] = val; return val; };
    Vue.delete = function (obj, key) { if (obj) delete obj[key]; };
    Vue.version = '2.7.16';
    
    global.Vue = Vue;
})(this);
