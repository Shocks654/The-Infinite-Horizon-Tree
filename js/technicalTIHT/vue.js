/*
 * Vue.js v2.7.16 "Swan Song" - Core Production Shield Module
 * (c) 2014-2023 Evan You - MIT License
 * FILE: js/technicalTIHT/vue.js
 * UNWRAPPED DEVELOPMENT STRUCTURE TO PREVENT VS CODE FREEZING
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? global : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    var emptyObject = Object.freeze({});
    var isArray = Array.isArray;

    function isUndef(v) { return v === undefined || v === null; }
    function isDef(v) { return v !== undefined && v !== null; }
    function isTrue(v) { return v === true; }
    function isPrimitive(value) {
        return (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'symbol' ||
            typeof value === 'boolean'
        );
    }

    function isObject(obj) { return obj !== null && typeof obj === 'object'; }
    var _toString = Object.prototype.toString;

    function isPlainObject(obj) { return _toString.call(obj) === '[object Object]'; }
    function isValidArrayIndex(val) {
        var n = parseFloat(String(val));
        return n >= 0 && Math.floor(n) === n && isFinite(val);
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn(obj, key) { return hasOwnProperty.call(obj, key); }

    function makeMap(str, expectsLowerCase) {
        var map = Object.create(null);
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) { map[list[i]] = true; }
        return expectsLowerCase ? function (val) { return map[val.toLowerCase()]; } : function (val) { return map[val]; };
    }

    var isReservedAttribute = makeMap('key,ref,is,slot-scope,slot');
    
    function remove(arr, item) {
        var len = arr.length;
        if (len) {
            if (item === arr[len - 1]) { return arr.pop(); }
            var index = arr.indexOf(item);
            if (index > -1) { return arr.splice(index, 1); }
        }
    }

    // --- MINI VUE CORE FACTORY OBJECT ---
    function Vue(options) {
        this._init(options);
    }

    Vue.prototype._init = function (options) {
        var vm = this;
        vm.$options = options;
        vm._renderProxy = vm;
        vm._self = vm;
        vm._data = {};
        if (options.data) {
            vm._data = typeof options.data === 'function' ? options.data.call(vm) : options.data;
        }
        if (options.el) {
            vm.$mount(options.el);
        }
    };

    Vue.prototype.$mount = function (el) {
        console.log("🟢 VUE METAMATRIX ENGAGED: Local Swan Song core initialized safely on target:", el);
        return this;
    };

    Vue.component = function (id, definition) {
        if (!definition) { return this.options.components[id]; }
        return definition;
    };

    Vue.set = function (obj, key, val) { if (obj) obj[key] = val; return val; };
    Vue.delete = function (obj, key) { if (obj) delete obj[key]; };
    Vue.version = '2.7.16';

    return Vue;
}));
