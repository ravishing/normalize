;void function(factory, root) {
	// console.log(root)
    root.f = factory.call(root);
}(function() {
    'use strict'
    //nativeFn
    var __Array = Array;
    var __Object = Object;
    var ObjProto = __Object.prototype;
    var ArrayProto = __Array.prototype;
    var slice = ArrayProto.slice;
    var toString = ObjProto.toString;
    var has=ObjProto.hasOwnProperty;
    var __map = ArrayProto.map;
    var __reduce = ArrayProto.reduce;
    var __reduceRight=ArrayProto.reduceRight;
    var __forEach = ArrayProto.forEach;
    //isType
    var falsey = not(truthy);
    var nothingify = not(existy);
    var isFunction = isType('Function');
    var isArray = Array.isArray || isType('Array');
    var isString = isType('String');
    var isNumber = isType('Number');

    //closure
    var map = dispatch(invoker('map', __map), _map);
    var reduce = dispatch(invoker('reduce', __reduce), _reduce);
    var reduceRight =dispatch(invoker('reduceRight',__reduceRight),_reduceRight)
    var each = dispatch(forEach, _forEach);

    //
    function fail(thing) {
        throw new Error(thing);
    }

    function warn() {
        console.info(['WARNING:', thing].join(' '));
    }

    function note() {
        console.log(['NOTE:', thing].join(' '));
    }


    function existy(x) {
        return x != null
    }

    function truthy(x) {
        return existy(x) && x !== false;
    }

    function toArray(x) {
        return existy(x) ? slice.call(x) : [];
    }

    function first(x) {
        return nth(x, 0);
    }

    function second(x) {
        return nth(x, 1);
    }

    function rest(x) {
        var y = toArray(x);
        y.shift();
        return y;
    }

    function nth(x, key) {
        return isIndexed(x) ? x[key] : undefined;
    }

    function not(fn) {
        return function() {
            var args = toArray(arguments);
            return !fn.apply(null, args);
        };
    }

    function cat() {
        var args = toArray(arguments);
        var head = first(args);
        if (isArray(head))
            return head.concat.apply(head, rest(args));
        else
            return [];
    }

    function construct(head, tail) {
        return cat([head], toArray(tail));
    }


    function _map(target, iterator, context) {
        var result = [];
        target = toArray(target);
        for (var i = 0, l = target.length; i < l; ++i) {
            result[result.length] = iterator.call(context, target[i], i, target);
        }
        return result;
    }

    function _reduce(array, cb, seed, context) {
        array = toArray(array);
        if (!isFunction(cb)) {
            return array[array.length - 1];
        }
        if (!existy(seed)) {
            seed = array.shift();
        }
        for (var i = 0, l = array.length; i < l; ++i) {
            seed = cb.call(context, seed, array[i], i, array)
        }
        return seed;
    }


    function _reduceRight(array, cb, seed, context) {
        array = toArray(array);
        if (!isFunction(cb)) {
            return array[array.length - 1];
        }
        if (!existy(seed)) {
            seed = array.shift();
        }
        var l=array.length;
        while(l--){
        	seed = cb.call(context, seed, array[i], i, array)
        }

        return seed;
    }

    function isIndexed(x) {
        return isArray(x) || isString(x);
    }

    function isType(x) {
        return function(y) {
            return toString.call(y) == '[object ' + x + ']';
        }
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
    };

    function identity(x) {
        return x
    };

    function dispatch() {
        var args = toArray(arguments);
        return function() {
            var ret;
            for (var i = 0, l = args.length; i < l; ++i) {
                ret = args[i].apply(null, toArray(arguments))
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
            return fn.apply(null, args);
        }
    }

    function invoker(key, method) {
        return function(target) {
            if (existy(target) && isFunction(target[key]) && target[key] === method) return method.apply(target, rest(arguments));
            return;
        }
    }

    function validator(fn, error, failure) {
        var wapper = function(x) {
            return isFunction(fn) ? fn(x) : undefined;
        };
        wapper.failure = failure;
        wapper.error = error;
        return wapper;
    }

    function checkor(validators) {
        var validators = toArray(arguments);
        return function() {
            var args = toArray(arguments);
            return reduce(validators, function(seed, validator) {
                var result = (validator.apply(null, args) === validator.failure) ? [validator.error] : [];
                return cat(seed, result);
            }, []);
        }
    }

    function aliasFor(obj) {
        var alias=function(oldname) {
            function fn(newname) {
                obj[newname] = obj[oldname];
                return fn;
            }
            return fn.is = fn.are = fn.and = fn;
        };
        return alias.alias=alias;
    }

    function forEach() {
        var head = first(arguments);
        if (existy(head) && head.forEach && head.forEach === __each) {
            invoker('forEach', __forEach).apply(null, arguments);
            return head;
        } else {
            return;
        }
    }

    function _forEach(array, cb, context) {
        array = toArray(array);
        if (!isFunction(cb)) return array;
        for (var i = 0, l = array.length; i < l; ++i) {
            cb.call(context, array[i], i, array)
        }
        return array;
    }

    function extend(target,resource){
    	for(var i in resource){
    		if(has.call(resource,i)){
    			target[i]=resource[i];
    		}
    	}
    }
    var __map__ = {
        map: map,
        reduce: reduce,
        reduceRight:reduceRight,
        each: each,
        isFunction: isFunction,
        isArray: isArray,
        isString: isString,
        isNumber: isNumber,
        isIndexed: isIndexed,
        cat: cat,
        construct: construct,
        validator: validator,
        checkor: checkor,
        invoker: invoker,
        nth: nth,
        first: first,
        rest: rest,
        second: second,
        pluck: pluck,
        dispatch: dispatch,
        fnull: fnull,
        when: when,
        always: always,
        identity: identity,
        toArray: toArray,
        existy: existy,
        truthy: truthy,
        falsey:falsey,
        nothingify:nothingify,
        not: not,
        fail: fail,
        warn: warn,
        note: note,
        aliasFor: aliasFor,
        extend:extend
    };

    var f=function(){};
    var aliasOn__map__=__map__.aliasFor(__map__);
    aliasOn__map__.alias('reduce').is('reduceLeft').and('fold').are('foldLeft');
    aliasOn__map__.alias('each').is('forEach');
    aliasOn__map__.alias('reduceRight').is('foldRight');
    extend(f,__map__);
    return f;
}, this);




// f.map('fdsafsad', f.identity);
// f.reduce('123456789', function(seed, v, k, l) {
//     seed = seed + v;
//     return seed;
// }, 0);
// var rule = {
//     type: 'display',
//     message: 'hi'
// };
// var validate1 = f.validator(function(x) {
//     if (x.type == 'display') return false
//     else return true;
// }, '不能为display', true);
// var validate2 = f.validator(function(x) {
//     if (x.message == 'hi') return true;
//     else return false;
// }, '不能为hi', false);
// var check1 = f.checkor(validate1, validate2);
// check1(rule);
