function fx() {
    var root = typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global ||
        this;
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var Array = root.Array;
    var Object = root.Object;
    var Function = root.Function;
    var FuncProto = Function.prototype;
    var ObjProto = Object.prototype;
    var ArrayProto = Array.prototype;
    var StringProto = String.prototype;
    var _keys_ = Object.keys;
    var _push_ = ArrayProto.push;
    var _shift_ = ArrayProto.shift;
    var _unshift_ = ArrayProto.unshift;
    var _splice_ = ArrayProto.splice;
    var _pop_ = ArrayProto.pop;
    var _slice_ = ArrayProto.slice;
    var _String_slice = StringProto.slice;
    var _toString_ = ObjProto.toString;
    var _Promise_ = root.Promise;
    var _map_ = ArrayProto.map;
    var _reduce_ = ArrayProto.reduce;
    var _reduceRight_ = ArrayProto.reduceRight;
    var _forEach_ = ArrayProto.forEach;
    var _filter_ = ArrayProto.filter;
    var _some_ = ArrayProto.some;
    var _every_ = ArrayProto.every;
    var _has_ = ObjProto.hasOwnProperty;
    var _call_ = FuncProto.call;
    var _aplly_ = FuncProto.apply;
    var _bind_ = FuncProto.bind;
    var call = uncurrying(_call_);
    var apply = uncurrying(_aplly_);
    var bind = dispatch(invoker('bind', _bind_), _bind); //兼容es<5
    var slice = dispatch(invoker('slice', _slice_), invoker('slice', _String_slice), always([])); //兼容undefined and null和String
    var toString = uncurrying(_toString_);
    var push = uncurrying(_push_);
    var shift = uncurrying(_shift_);
    var splice = uncurrying(_splice_);
    var unshift = uncurrying(_unshift_);
    var pop = uncurrying(_pop_);
    var falsey = not(truthy);
    var nothingify = not(existy);
    var isObject = isType('Object');
    var isFunction = isType('Function');
    var isArray = Array.isArray || isType('Array');
    var isString = isType('String');
    var isNumber = isType('Number');
    var isRegExp = isType('RegExp');
    var map = dispatch(invoker('map', _map_), _map);
    var reduce = dispatch(invoker('reduce', _reduce_), _reduce, _reduce2);
    var reduceRight = dispatch(invoker('reduceRight', _reduceRight_), _reduceRight, _reduceRight2);
    var each = dispatch(forEach, _forEach);
    var filter = dispatch(invoker('filter', _filter_), _filter);
    var some = dispatch(invoker('some', _some_), _some);
    var every = dispatch(invoker('every', _every_), _every);
    var keys = dispatch(_keys_, _keys);

    function count(x) {
        return isArrayLike(x) ? x.length : (
            isObject(x) ? keys(x).length : 1
        );
    }

    function fail(thing) {
        throw new Error(thing);
    }

    function warn(thing) {
        console.info(['WARNING:', thing].join(' '));
    }

    function note(thing) {
        console.log(['NOTE:', thing].join(' '));
    }

    function has(obj, key) {
        return call(_has_, obj, key);
    }

    function existy(x) {
        return x != null;
    }

    function truthy(x) {
        return existy(x) && x !== false;
    }



    function and() {

    }

    function toArray(x) {
        return existy(x) ? call(_slice_, x) : [];
    }

    function first(x) {
        return nth(x, 0);
    }

    function second(x) {
        return nth(x, 1);
    }

    function iterateUntil(fn, check, seed) {
        var value = fn(seed);
        var ret = [];
        ret.push(value);

        while (check(value)) {
            value = fn(value);
            ret.push(value);
        }
        return ret;
    }

    function best(fn, list) {
        return reduce(list, function(x, y) {
            return fn(x, y) ? x : y;
        });
    }

    function curry1(fn) {
        return function(arg1) {
            return call(fn, null, arg1);
        }
    }

    function curry2r(fn) {
        return function(arg2) {
            return function(arg1) {
                return call(fn, null, arg1, arg2);
            }
        }
    }

    function throttle(fn, delay, context) {
        var last = 0;
        return function() {
            var cur = +new Date;
            if (cur - last <= delay) return;
            last = cur;
            return apply(fn, context, arguments);
        }
    }

    function curry2(fn) {
        return function(arg1) {
            return function(arg2) {
                return call(fn, null, arg1, arg2);
            }
        }
    }

    function curry3(fn) {
        return function(arg1) {
            return function(arg2) {
                return function(arg3) {
                    return call(fn, null, arg1, arg2, arg3);
                }
            }
        }
    }

    function curry3r(fn) {
        return function(arg3) {
            return function(arg2) {
                return function(arg1) {
                    return call(fn, null, arg1, arg2, arg3);
                }
            }
        }
    }

    function partial1(fn) {
        var args = _.rest(arguments);
        return function() {
            return apply(fn, null, cat(args, arguments));
        }
    }

    function rest(x) {
        return existy(x) ? call(_slice_, x, 1) : [];
    }

    function nth(x, key) {
        return isIndexed(x) ? x[key] : undefined;
    }

    function not(fn) {
        return function() {
            var args = toArray(arguments);
            return !apply(fn, null, args);
        };
    }

    function isArrayLike(collection) {
        var length = collection && collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    }

    function cat() {
        var args = toArray(arguments);
        var head = first(args);
        if (isArray(head))
            return apply(head.concat, head, rest(args));
        else
            return [];
    }

    function conj(xs, x) {
        var _xs;
        var _rest;
        if (isArrayLike(xs)) {
            _xs = toArray(xs);
            apply(_push_, _xs, rest(arguments));
            return _xs;
        } else if (isObject(xs)) {
            _rest = rest(arguments);
            var n;
            return mixin({}, xs, apply(object, null, _rest));
        }
        return [];
    }


    function object() {
        var matrix = reduce(arguments, function(s, v, k, args) {
            var cur = s.length - 1;
            return k & 1 ? (s[cur] = conj(s[cur], v), s) : conj(s, [v]);
        }, []);
        return reduce(matrix, function(s, v, k, matrix) {
            return _assoc(s, v[0], v[1]);
        }, {});
    }

    function _assoc(obj, k, v) {
        obj[k] = v;
        return obj;
    }

    function construct(head, tail) {
        return cat([head], toArray(tail));
    }

    function _keys(x) {
        if (!isObject(x)) return [];
        var keys = [];
        for (var i in x) {
            if (has(x, i)) {
                keys.push(i);
            }
        }
        return keys;
    }

    function _map(target, iterator, context) {
        var result = [];
        var indexs = !isArrayLike(target) && keys(target);
        var length = (indexs || target).length;
        var cur;
        for (var i = 0, l = length; i < l; ++i) {
            cur = indexs ? indexs[i] : i;
            result[result.length] = call(iterator, context, target[cur], cur, target);
        }
        return result;
    }

    function _reduce(array, cb, seed, context) { //处理序列
        if (!isArrayLike(array)) return;
        var length = array.length;
        var start = 0;
        if (!existy(seed)) {
            seed = array[start++];

        }
        for (var i = start, l = array.length; i < l; ++i) {
            seed = call(cb, context, seed, array[i], i, array);
        }
        return seed;
    }

    function sequence(x) {
        return isObject(x) ? reduce(x, function(s, x, k, v) {
            return conj(s, [k, x]);
        }, []) : toArray(x);
    }

    function find(sequence,item){
        return reduce(sequence,function(s,x,k,sequence){
                return item===x?s=k:false;
        },false);
    }

    function _reduce2(obj, cb, seed, context) { //处理表
        if (!isObject(obj)) return;
        var _keys = keys(obj);
        var start = 0;
        if (!existy(seed)) {
            seed = obj[_keys[start++]];
        }
        for (var i = start, l = _keys.length; i < l; ++i) {
            seed = call(cb, context, seed, obj[_keys[i]], _keys[i], obj);
        }
        return seed;
    }

    function _reduceRight(array, cb, seed, context) { //处理序列
        if (!isArrayLike(array)) return;
        var start = array.length;
        if (!existy(seed)) {
            seed = array[--start];
        }
        while (start--) {
            seed = call(cb, context, seed, array[start], start, array);
        }

        return seed;
    }

    function _reduceRight2(obj, cb, seed, context) { //处理表
        if (!isObject(obj)) return;
        var _keys = keys(obj);
        var start = _keys.length;
        if (!existy(seed)) {
            seed = obj[_keys[--start]];
        }
        while (start--) {
            seed = call(cb, context, seed, obj[_keys[start]], _keys[start], obj);
        }

        return seed;
    }

    function _filter(array, fn) {
        var ret = [];
        var l = array.length;
        var i = 0;
        while (i < l) {
            if (fn(array[i], i, array)) {
                ret.push(array[i]);
            }
            i++;
        }
        return ret;
    }

    function _some(array, fn) {
        var l = array.length;
        var i = 0;
        while (i < l) {
            if (fn(array[i], i, array)) {
                return true;
            }
            i++;
        }
        return false;
    }

    function _every(array, fn) {
        var l = array.length;
        var i = 0;
        while (i < l) {
            if (!fn(array[i], i, array)) {
                return false;
            }
            i++;
        }
        return true;
    }

    function isIndexed(x) {
        return isArray(x) || isString(x);
    }

    function isType(x) {
        return function(y) {
            return toString(y) == '[object ' + x + ']';
        }
    }

    function type(x) {
        return slice(toString(x), 7, -1);
    }

    function when(cond) {
        var value;
        var done = truthy(cond);
        var fail = falsey(cond);
        var then = function(fn) {
            if (done) value = isFunction(fn) ? fn(value) : fn;
            return then;
        };
        var otherwise = function(fn) {
            if (fail) value = isFunction(fn) ? fn(value) : fn;
            return otherwise;
        };
        then.value = otherwise.value = function() {
            return value;
        };
        then.then = otherwise.then = then;
        otherwise.otherwise = then.otherwise = otherwise;
        return then;
    }

    function always(x) {
        return function() {
            return x
        }
    }

    function identity(x) {
        return x;
    }

    function dispatch() {
        var args = toArray(arguments);
        return function() {
            var ret;
            for (var i = 0, l = args.length; i < l; ++i) {
                ret = isFunction(args[i]) ? apply(args[i], null, toArray(arguments)) : null;
                if (existy(ret)) return ret;
            }
            return ret;
        };
    }

    function pluck(key) {
        return function(target) {
            return target ? target[key] : undefined;
        }
    }

    function fnull(fn) {
        var defaults = rest(fn);
        return function() {
            var args = toArray(arguments);
            var l = args.length;
            while (l--) {
                if (existy(args[l])) args[l] = defaults[l];
            }
            return apply(fn, null, args);
        }
    }

    function invoker(key, method) { //uncurrying ,but 添加了对数据类型的校验，而uncurrying奉行的是鸭子类型思想。
        return function(target) {
            if (existy(target) && isFunction(target[key]) && target[key] === method) return apply(method, target, rest(arguments));
            return;
        }
    }



    function uncurrying(method) {
        return function() {
            return _call_.apply(method, arguments);
        }
    }

    function validator(fn, error, failure, value) {
        function _wrapper(x, value) {
            return isFunction(fn) ? fn(x, value) : (isRegExp(fn) ? (fn.test(x)) : false);
        }
        var wrapper = existy(value) ? curry2r(_wrapper)(value) : curry1(_wrapper);
        wrapper.failure = failure;
        wrapper.error = error;
        return wrapper;
    }

    function checker(validators) {
        var validators = toArray(arguments);
        return function() {
            var args = toArray(arguments);
            return reduce(validators, function(seed, validator) {
                var result = (apply(validator, null, args) === validator.failure) ? [validator.error] : [];
                return cat(seed, result);
            }, []);
        }
    }

    function aliasFor(obj) {
        var alias = function(oldname) {
            function fn(newname) {
                obj[newname] = obj[oldname];
                return fn;
            }
            fn.alias = alias;
            return fn.is = fn.are = fn.and = fn;
        };
        return alias.alias = alias;
    }

    function forEach() {
        var head = first(arguments);
        if (existy(head) && head.forEach && head.forEach === __each) {
            apply(invoker('forEach', _forEach_), null, arguments);
            return head;
        } else {
            return;
        }
    }

    function _forEach(array, cb, context) {
        array = toArray(array);
        if (!isFunction(cb)) return array;
        for (var i = 0, l = array.length; i < l; ++i) {
            call(cb, context, array[i], i, array)
        }
        return array;
    }


    function parent(prototype) {
        for (var i in prototype) {
            if (has(prototype, i)) {
                this[i] = prototype[i];
            }
        }
    };

    function plain() {}

    function createClass(prototype, __initIns, __initClass) {

        __initIns = __initIns || plain;
        __initClass = __initClass || plain;
        var parentProto = {
            __initIns__: __initIns,
            __initClass__: __initClass
        };
        parent.prototype = parentProto;
        var f = function() {
            if (!(this instanceof f)) {
                plain.prototype = fProto;
                return apply(f, new plain, arguments);
            }
            apply(this.__initIns__, this, arguments);
            this.initialize && apply(this.initialize, this, arguments);
            return this;
        };

        f.__initClass__ = __initClass;
        __initClass(f);
        f.__initIns__ = __initIns;
        f.extend = extend;

        var fProto = new parent(prototype);
        fProto.constructor = f;
        f.prototype = fProto;
        return f;
    }

    function extendClass(seed, another, initialize) {
        var child = function() {
            apply(another, this, arguments);
            initialize && apply(initialize, this, arguments);
        };
        plain.prototype = another.prototype;

        var proto = new plain;
        plain.prototype = proto;
        proto = new plain;
        child.prototype = proto;
        mixin(proto, seed);
        return child;
    }

    function mixin(des, src) {
        var args = toArray(arguments);
        var i = 0;
        var l = args.length;
        while (++i < l) {
            var next = args[i];
            for (var j in next) {
                if (has(next, j)) {
                    des[j] = next[j];
                }
            }
        }
        return des;
    }

    function merge(des, src) {
        return apply(mixin, null, construct({}, toArray(arguments)));
    }
    var Chain = createClass({
        invoke: function() {
            var args = toArray(arguments);
            this._calls.push(function(value) {
                return apply(value[args[0]], value, slice(args, 1));
            });
            return this;
        },
        value: function() {
            return reduce(this._calls, function(product, current) {
                return current(product);
            }, this._value);
        }
    }, function(value) {
        var isChain = value instanceof Chain;
        this._value = isChain ? value._value : value;
        this._calls = isChain ? value._calls : [];
        return this;
    });

    function extend(seed, initialize) {
        return extendClass(seed, this, initialize);
    }

    function pipe() {
        var args = toArray(arguments);
        return function() {
            var seed = apply(first(args), null, toArray(arguments));
            return reduce(slice(args, 1), function(product, current) {
                return call(current, null, product);
            }, seed);
        }
    }

    function compose() {
        return apply(pipe, null, toArray(arguments).reverse());
    }

    function partial(fn, length, args, holes) {
        // var boundArgs=slice(arguments,1);
        length = length || fn.length;
        args = args || [];
        holes = holes || [];
        return function() {
            var _args = toArray(args);
            var _holes = toArray(holes);
            var holeStart = _holes.length;
            var argStart = _args.length;
            var arg;
            for (var i = 0, l = arguments.length; i < l; ++i) {
                arg = arguments[i];
                if (arg === y && holeStart) {
                    push(_holes, shift(_holes));
                } else if (arg === y) {
                    push(holes, holeStart + i);
                } else if (holeStart) {
                    holeStart--;
                    splice(_args, shift(_holes), 0, arg);
                } else {
                    push(_args, arg);
                }
            }
            if (_args.length < length) {
                return call(partial, null, fn, length, _args, _holes);
            } else {
                return apply(fn, null, _args);
            }
        };
    }

    function _bind(fn, context) {
        var boundArgs = slice(arguments, 2);
        return function() {
            return apply(fn, context, cat(boundArgs, arguments));
        };
    }

    function lift(answerFn, stateFn) {
        return function(state) {
            var answer = answerFn(state);
            var state = stateFn ? stateFn(state) : answer;
            return {
                answer: answer,
                state: state
            };
        }
    }

    function actions() {
        var acts = toArray(arguments);
        return function(done) {
            return function(seed) {
                var init = {
                    values: [],
                    state: seed
                };
                var lastResult = reduce(acts, function(product, act) {
                    var result = act(product.state);
                    var values = cat(product.values, result.answer);
                    return {
                        values: values,
                        state: result.state
                    };
                }, init);
                var keep = filter(lastResult.values, existy);
                return done(keep, lastResult.state);
            }
        }
    }

    function abs(x) {
        return x > 0 ? x : -x;
    }

    function add(x, y) {
        return x + y;
    }

    function sub(x, y) {
        return x - y;
    }

    function mul(x, y) {
        return x * y;
    }

    function div(x, y) {
        return x / y;
    }

    function rem(x, y) {
        return x & y;
    }

    function inc(x) {
        return x + 1
    };

    function dec(x) {
        return x - 1
    };

    function equal(x, y) {
        return x == y
    };

    function gt(x, y) {
        return x > y;
    }

    function lt(x, y) {
        return x < y;
    }

    function negative(x) {
        return x < 0;
    }

    function positive(x) {
        return x < 0;
    }

    function sin(x) {
        return Math.sin(x);
    }

    function cos(x) {
        return Math.cos(x);
    }
    //member table
    var _hash = { //70
        existy: existy,
        truthy: truthy,
        and: and,
        count: count,
        falsey: falsey,
        nothingify: nothingify,
        not: not,
        fail: fail,
        warn: warn,
        note: note,
        toString: toString,
        type: type,
        isRegExp: isRegExp,
        isArrayLike: isArrayLike,
        isFunction: isFunction,
        isArray: isArray,
        isObject: isObject,
        isString: isString,
        isNumber: isNumber,
        isIndexed: isIndexed,
        has: has,
        find:find,
        bind: bind,
        call: call,
        apply: apply,
        uncurrying: uncurrying,
        curry1: curry1,
        curry2: curry2,
        curry3: curry3,
        curry2r: curry2r,
        curry3r: curry3r,
        partial1: partial1,
        partial: partial,
        iterateUntil: iterateUntil,
        toArray: toArray,
        sequence: sequence,
        keys: keys,
        slice: slice,
        shift: shift,
        splice: splice,
        pop: pop,
        push: push,
        unshift: unshift,
        map: map,
        reduce: reduce,
        reduceRight: reduceRight,
        each: each,
        filter: filter,
        every: every,
        some: some,
        cat: cat,
        conj: conj,
        construct: construct,
        nth: nth,
        first: first,
        rest: rest,
        second: second,
        pipe: pipe,
        compose: compose,
        Chain: Chain,
        validator: validator,
        dispatch: dispatch,
        lift: lift,
        actions: actions,
        checker: checker,
        invoker: invoker,
        pluck: pluck,
        fnull: fnull,
        throttle: throttle,
        when: when,
        always: always,
        identity: identity,
        aliasFor: aliasFor,
        mixin: mixin,
        merge: merge,
        createClass: createClass,
        extendClass: extendClass
    };

    //namespace and constuctor
    function y() {};

    mixin(y, _hash);

    //member alias
    aliasFor(y)
        .alias('reduce')
        .is('reduceLeft')
        .and('fold')
        .are('foldLeft')
        .alias('each')
        .is('forEach')
        .alias('reduceRight')
        .is('foldRight')
        .alias('createClass')
        .is('inherit')
        .alias('always')
        .is('k')
        .alias('curry1')
        .is('curry1l')
        .and('curry1r')
        .alias('curry2')
        .is('curry2l')
        .alias('curry3')
        .is('curry3l');

    return y;
}