/**
 * todo:防止数据突变
 * todo:写一个不可变的数据结构来替换js原生的数据结构
 * 加油啊，Red!
 * thanks Michael Fogus!
 * 除了函数式api外还加入了一些面向对象的工具和函数，只有一个目的：效率;
 */
;void function(name,factory, root) {
    var hasDefine=typeof define==='function';
    var hasExports=typeof module==='object'&&module!=null&&typeof module.exports==='object';
    if(hasExports){
        module.exports=factory();
    }else if(hasDefine){
        if(define.amd){
            define('_f',[],factory);
        }
    }else{
        root[name] = factory();
    }
}('_f',function() {
    // 'use strict'
    //native code
    var root = typeof self==='object'&&self.self===self&&self||
               typeof global==='object' && global.global===global&&global||
               this;//借鉴了underscore的获取根对象的技巧。
    var __Array = root.Array;
    var __Object = root.Object;
    var ObjProto = __Object.prototype;
    var ArrayProto = __Array.prototype;
    var slice = ArrayProto.slice;
    var toString = ObjProto.toString;
    var __Promise = root.Promise;
    var __map = ArrayProto.map;
    var __reduce = ArrayProto.reduce;
    var __reduceRight = ArrayProto.reduceRight;
    var __forEach = ArrayProto.forEach;
    var __filter = ArrayProto.filter;
    var __some = ArrayProto.some;
    var __every = ArrayProto.every;
    var __has = ObjProto.hasOwnProperty;

    var _Promise=createClass({},function(async,defferd){
        defferd=defferd instanceof  Defferd?((defferd.promise=this),defferd):new Defferd(this);
        if(isFunction(async)) async(partial1(defferd.resolve,defferd),partial1(defferd.reject,defferd));
        this.then=function(onFulfilled,onRejected,onProgress){
            if(isFunction(onFulfilled)) defferd.once('success',onFullfilled);
            if(isFunction(onRejected)) defferd.once('success',onRejected);
            if(isFunction(onProgress)) defferd.once('success',onProgress);
            return new _Promise;
        };
    });


    var Event=createClass({});//to continue

    var Defferd=Event.extend({
        resolve:function(obj){
            this.state='fulfilled';
            this.trigger('success',obj);
        },
        reject:function(error){
            this.state='rejected';
            this.trigger('error',error);
        },
        progress:function(chunck){
            this.trigger('progress',chunck);
        }
    },function(promise){
        this.state='pending';
        this.promise=promise instanceof _Promise?promise:new _Promise(null,this);
    });

    //isType
    var falsey = not(truthy);
    var nothingify = not(existy);
    var isFunction = isType('Function');
    var isArray = Array.isArray || isType('Array');
    var isString = isType('String');
    var isNumber = isType('Number');

    //closure and combinor
    var map = dispatch(invoker('map', __map), _map);
    var reduce = dispatch(invoker('reduce', __reduce), _reduce);
    var reduceRight = dispatch(invoker('reduceRight', __reduceRight), _reduceRight);
    var each = dispatch(forEach, _forEach);
    var filter = dispatch(invoker('filter', __filter), _filter);
    var some = dispatch(invoker('some', __some), _some);
    var every = dispatch(invoker('every', __every), _every);
    var Promise = dispatch(__Promise, _Promise);

    //two underscore means native code,one underscore means poly;
    function fail(thing) {throw new Error(thing);}

    function warn() {console.info(['WARNING:', thing].join(' '));}

    function note() {console.log(['NOTE:', thing].join(' '));}

    function has(obj, key) {return __has.call(obj, key);}

    function existy(x) {return x != null;}

    function truthy(x) {return existy(x) && x !== false;}

    function toArray(x) {return existy(x) ? slice.call(x) : [];}

    function first(x) {return nth(x, 0);}

    function second(x) {return nth(x, 1);}

    function curry1(fn) {
        return function(arg) {
            return fn.call(null, arg);
        }
    }

    function partial1() {
        var fn = _.first(arguments);
        var args = _.rest(arguments);
        return function() {
            var arg = cat(args, arguments);
            return fn.apply(null, arg);
        }
    }

    function rest(x) {return toArray(x).slice(1);}

    function nth(x, key) {return isIndexed(x) ? x[key] : undefined;}

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

    function construct(head, tail) {return cat([head], toArray(tail));}

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
        var l = array.length;
        while (l--) {
            seed = cb.call(context, seed, array[i], i, array)
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

    function isIndexed(x) {return isArray(x) || isString(x);}

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

    function identity(x) {return x;}

    function dispatch() {
        var args = toArray(arguments);
        return function() {
            var ret;
            for (var i = 0, l = args.length; i < l; ++i) {
                ret = isFunction(args[i]) ? args[i].apply(null, toArray(arguments)) : null;
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

    function invoker(key, method) {//uncurrying ,but 添加了对数据类型的校验，而uncurrying奉行的是鸭子类型思想。
        return function(target) {
            if (existy(target) && isFunction(target[key]) && target[key] === method) return method.apply(target, rest(arguments));
            return;
        }
    }



    function uncurrying(fn){
        return function(host){
            return fn.call(host,rest(arguments));
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
        var alias = function(oldname) {
            function fn(newname) {
                obj[newname] = obj[oldname];
                return fn;
            }
            return fn.is = fn.are = fn.and = fn;
        };
        return alias.alias = alias;
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

    function mixin(target, resource) {
        for (var i in resource) {
            if (has(resource, i)) {
                target[i] = resource[i];
            }
        }
    }

    function parent(prototype) { //父类的实例存放实例初始化和class初始化属性
        for (var i in prototype) {
            if (has(prototype,i)) {
                this[i] = prototype[i];
            }
        }
    };

    function plain() {};

    function createClass(prototype, __initIns, __initClass) {

        __initIns = __initIns || plain;
        __initClass = __initClass || plain;
        var parentProto = {
            __initIns__: __initIns,
            __initClass__: __initClass
        };
        parent.prototype = parentProto;
        var f = function() {
            if(!(this instanceof f)){
                plain.prototype=fProto;
                return f.apply(new plain,arguments);
            }
            this.__initIns__.apply(this, arguments);
            this.initialize && this.initialize.apply(this, arguments);
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
    };

    function inherit(seed, another, initialize) {
        var child = function() {
            another.apply(this, arguments);
            initialize && initialize.apply(this, arguments);
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
        for (var i in src) {
            if (has(src,i)) {
                des[i] = src[i];
            }
        }
    }

    var Chain=createClass({
        invoke:function(){
            var args=toArray(arguments);
            this._chains.push(function(value){
                return value[args[0]].apply(value,args.slice(1));
            });
            return this;
        },
        value:function(){
            return reduce(this._chains,function(product,current){
                return current(product);
            },this._value);
        }
    },function(value){
        this._value=value;
        this._chains=[];
        return this;
    });

    function extend(seed, initialize) {return inherit(seed, this, initialize);}
    
    function pipe(){
        var args=toArray(arguments);
        return function(){
            var seed=first(args).apply(null,toArray(arguments));
            return reduce(args.slice(1),function(product,current){
                return current.call(null,product);
            },seed);
        }
    }
    //member table
    var __map__ = {//47
        uncurrying:uncurrying,
        pipe:pipe,
        Chain:Chain,
        has: has,
        curry1: curry1,
        partial1: partial1,
        map: map,
        reduce: reduce,
        reduceRight: reduceRight,
        each: each,
        filter: filter,
        every: every,
        some: some,
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
        falsey: falsey,
        nothingify: nothingify,
        not: not,
        fail: fail,
        warn: warn,
        note: note,
        aliasFor: aliasFor,
        mixin: mixin,
        createClass:createClass,
        inherit:inherit,
        Promise:Promise
    };

    //namespace and constuctor
    var f = function() {};

    //member alias
    var aliasFor__map__ = __map__.aliasFor(__map__);


    aliasFor__map__.alias('reduce')
                   .is('reduceLeft')
                   .and('fold')
                   .are('foldLeft');

    aliasFor__map__.alias('each')
                   .is('forEach');

    aliasFor__map__.alias('reduceRight')
                   .is('foldRight');

    mixin(f, __map__);

    return f;
}, this);



/**
 *test
 */
var a=_f.Chain([1,2,3]).invoke('concat',4,5,6).invoke('map',function(value){
    return value+1;
}).value();
var b=_f.pipe(function(a){
    return a+1
},function(a){
    return a+2
});
// var a=new _f.Chain([1,2,3]).invoke('push',4,5,6).invoke('map',alert)
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
