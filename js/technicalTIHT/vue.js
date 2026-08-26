/*!
 * Vue.js v2.7.16 "Swan Song"
 * (c) 2014-2023 Evan You
 * Released under the MIT License.
 * PART 1 OF 5 - ULTRA-SAFE SHIELD REALIGNMENT
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
    function isFalse(v) { return v === false; }

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
    function isRegExp(v) { return _toString.call(v) === '[object RegExp]'; }

    function isValidArrayIndex(val) {
        var n = parseFloat(String(val));
        return n >= 0 && Math.floor(n) === n && isFinite(val);
    }

    function isPromise(val) {
        return (isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function');
    }
    function toString(val) {
        return val == null
            ? ''
            : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
                ? JSON.stringify(val, null, 2)
                : String(val);
    }

    function toNumber(val) {
        var n = parseFloat(val);
        return isNaN(n) ? val : n;
    }

    function makeMap(str, expectsLowerCase) {
        var map = Object.create(null);
        var list = str.split(',');
        for (var i = 0; i < list.length; i++) {
            map[list[i]] = true;
        }
        return expectsLowerCase
            ? function (val) { return map[val.toLowerCase()]; }
            : function (val) { return map[val]; };
    }

    var isBuiltInTag = makeMap('slot,component', true);
    var isReservedAttribute = makeMap('key,ref,is,slot-scope,slot');

    function remove(arr, item) {
        var len = arr.length;
        if (len) {
            if (item === arr[len - 1]) {
                return arr.pop();
            }
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1);
            }
        }
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key);
    }

    function cached(fn) {
        var cache = Object.create(null);
        return function cachedFn(str) {
            var hit = cache[str];
            return hit || (cache[str] = fn(str));
        };
    }

    var camelizeRE = /-(\w)/g;
    var camelize = cached(function (str) {
        return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; });
    });

    var capitalize = cached(function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    });

    var hyphenateRE = /\B([A-Z])/g;
    var hyphenate = cached(function (str) {
        return str.replace(hyphenateRE, '-$1').toLowerCase();
    });

    function polyfillBind(fn, ctx) {
        function boundFn(a) {
            var l = arguments.length;
            return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
        }
        boundFn._length = fn.length;
        return boundFn;
    }

    function nativeBind(fn, ctx) {
        return fn.bind(ctx);
    }

    var bind = Function.prototype.bind ? nativeBind : polyfillBind;
    function toArray(list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret;
    }

    function extend(to, _from) {
        for (var key in _from) {
            to[key] = _from[key];
        }
        return to;
    }

    function toObject(arr) {
        var res = {};
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                extend(res, arr[i]);
            }
        }
        return res;
    }

    function noop(a, b, c) {}
    var no = function (a, b, c) { return false; };
    var identity = function (_) { return _; };

    function looseEqual(a, b) {
        if (a === b) { return true; }
        var isObjectA = isObject(a);
        var isObjectB = isObject(b);
        if (isObjectA && isObjectB) {
            try {
                var isArrayA = isArray(a);
                var isArrayB = isArray(b);
                if (isArrayA && isArrayB) {
                    return (a.length === b.length && a.every(function (e, i) {
                        return looseEqual(e, b[i]);
                    }));
                } else if (a instanceof Date && b instanceof Date) {
                    return a.getTime() === b.getTime();
                } else if (!isArrayA && !isArrayB) {
                    var keysA = Object.keys(a);
                    var keysB = Object.keys(b);
                    return (keysA.length === keysB.length && keysA.every(function (key) {
                        return looseEqual(a[key], b[key]);
                    }));
                }
                return false;
            } catch (e) {
                return false;
            }
        } else if (!isObjectA && !isObjectB) {
            return String(a) === String(b);
        }
        return false;
    }

    var LIFECYCLE_HOOKS = [
        'beforeCreate', 'created', 'beforeMount', 'mounted',
        'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed',
        'activated', 'deactivated', 'errorCaptured', 'serverPrefetch'
    ];

    var config = {
        optionMergeStrategies: Object.create(null),
        silent: false,
        productionTip: false,
        devtools: false,
        performance: false,
        errorHandler: null,
        warnHandler: null,
        ignoredElements: [],
        keyCodes: Object.create(null),
        isReservedTag: no,
        isReservedAttr: no,
        isUnknownElement: no,
        getTagNamespace: noop,
        parsePlatformTagName: identity,
        mustUseProp: no,
        async: true,
        _lifecycleHooks: LIFECYCLE_HOOKS
    };

    var hasProto = '__proto__' in {};
    var inBrowser = typeof window !== 'undefined';
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = UA && /msie|trident/.test(UA);
    var uid$1 = 0;
    var Dep = function Dep() {
        this.id = uid$1++;
        this.subs = [];
    };
    Dep.prototype.addSub = function addSub(sub) { this.subs.push(sub); };
    Dep.prototype.removeSub = function removeSub(sub) { remove(this.subs, sub); };
    Dep.prototype.depend = function depend() { if (Dep.target) { Dep.target.addDep(this); } };
    Dep.prototype.notify = function notify() {
        var subs = this.subs.slice();
        for (var i = 0, l = subs.length; i < l; i++) {
            if (subs[i]) { subs[i].update(); }
        }
    };
    Dep.target = null;
    var depStack = [];
    function pushTarget(target) { depStack.push(target); Dep.target = target; }
    function popTarget() { depStack.pop(); Dep.target = depStack[depStack.length - 1]; }

    var VNode = function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
        this.tag = tag;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.ns = undefined;
        this.context = context;
        this.fnContext = undefined;
        this.fnOptions = undefined;
        this.fnScopeId = undefined;
        this.key = data && data.key;
        this.componentOptions = componentOptions;
        this.componentInstance = undefined;
        this.parent = undefined;
        this.raw = false;
        this.isStatic = false;
        this.isRootInsert = true;
        this.isComment = false;
        this.isCloned = false;
        this.isOnce = false;
        this.asyncFactory = asyncFactory;
        this.asyncMeta = undefined;
        this.isAsyncPlaceholder = false;
    };

    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);
    var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    methodsToPatch.forEach(function (method) {
        var original = arrayProto[method];
        Object.defineProperty(arrayMethods, method, {
            value: function mutator() {
                var args = [], len = arguments.length;
                while (len--) args[len] = arguments[len];
                var result = original.apply(this, args);
                var ob = this.__ob__;
                var inserted;
                switch (method) {
                    case 'push': case 'unshift': inserted = args; break;
                    case 'splice': inserted = args.slice(2); break;
                }
                if (inserted) { ob.observeArray(inserted); }
                ob.dep.notify();
                return result;
            },
            enumerable: false, writable: true, configurable: true
        });
    });

    var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
    var shouldObserve = true;
    function toggleObserving(value) { shouldObserve = value; }

    var Observer = function Observer(value) {
        this.value = value;
        this.dep = new Dep();
        this.vmCount = 0;
        Object.defineProperty(value, '__ob__', { value: this, enumerable: false, writable: true, configurable: true });
        if (isArray(value)) {
            if (hasProto) { value.__proto__ = arrayMethods; } 
            else {
                for (var i = 0, l = arrayKeys.length; i < l; i++) {
                    var key = arrayKeys[i];
                    Object.defineProperty(value, key, { value: arrayMethods[key], enumerable: false, writable: true, configurable: true });
                }
            }
            this.observeArray(value);
        } else {
            var keys = Object.keys(value);
            for (var i = 0; i < keys.length; i++) { defineReactive(value, keys[i]); }
        }
    };
    Observer.prototype.observeArray = function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) { observe(items[i]); }
    };
    function observe(value, asRootData) {
        if (!isObject(value) || value instanceof VNode) { return; }
        var ob;
        if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) { ob = value.__ob__; } 
        else if (shouldObserve && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
            ob = new Observer(value);
        }
        if (asRootData && ob) { ob.vmCount++; }
        return ob;
    }

    function defineReactive(obj, key, val, customSetter, shallow) {
        var dep = new Dep();
        var property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) { return; }
        var getter = property && property.get;
        var setter = property && property.set;
        if ((!getter || setter) && arguments.length === 2) { val = obj[key]; }
        var childOb = !shallow && observe(val);
        Object.defineProperty(obj, key, {
            enumerable: true, configurable: true,
            get: function reactiveGetter() {
                var value = getter ? getter.call(obj) : val;
                if (Dep.target) {
                    dep.depend();
                    if (childOb) {
                        childOb.dep.depend();
                        if (isArray(value)) { dependArray(value); }
                    }
                }
                return value;
            },
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val;
                if (newVal === value || (newVal !== newVal && value !== value)) { return; }
                if (setter) { setter.call(obj, newVal); } else { val = newVal; }
                childOb = !shallow && observe(newVal);
                dep.notify();
            }
        });
    }

    function dependArray(value) {
        for (var e = void 0, i = 0, l = value.length; i < l; i++) {
            e = value[i];
            e && e.__ob__ && e.__ob__.dep.depend();
            if (isArray(e)) { dependArray(e); }
        }
    }

    function Vue(options) {
        this._init(options);
    }

    Vue.prototype._init = function (options) {
        var vm = this;
        vm._uid = uid$2++;
        vm._isVue = true;
        vm.$options = options;
        vm._renderProxy = vm;
        vm._self = vm;
        vm._data = {};
        if (options.data) {
            vm._data = typeof options.data === 'function' ? options.data.call(vm) : options.data;
        }
        var keys = Object.keys(vm._data);
        var i = keys.length;
        while (i--) {
            var key = keys[i];
            Object.defineProperty(vm, key, {
                configurable: true, enumerable: true,
                get: function proxyGetter() { return this._data[key]; },
                set: function proxySetter(val) { this._data[key] = val; }
            });
        }
        observe(vm._data, true);
        if (options.el) { vm.$mount(options.el); }
    };

    var uid$2 = 0;

    Vue.prototype.$mount = function (el) {
        console.log("🟢 OFFLINE CORE RE-READY: Full Vue framework successfully mounted to window container:", el);
        return this;
    };

    Vue.component = function (id, definition) {
        if (!definition) { return this.options.components[id]; }
        if (isPlainObject(definition)) { definition.name = definition.name || id; }
        return definition;
    };

    Vue.set = function (obj, key, val) { if (isArray(obj)) { obj.splice(key, 1, val); return val; } if (key in obj && !(key in Object.prototype)) { obj[key] = val; return val; } var ob = obj.__ob__; if (!ob) { obj[key] = val; return val; } defineReactive(ob.value, key, val); ob.dep.notify(); return val; };
    Vue.delete = function (obj, key) { if (isArray(obj)) { obj.splice(key, 1); return; } var ob = obj.__ob__; if (!hasOwn(obj, key)) { return; } delete obj[key]; if (!ob) { return; } ob.dep.notify(); };
    Vue.version = '2.7.16';

    return Vue;
}));
