var ObjProto=Object.prototype;
var ArrayProto=Array.prototype;
var slice=ArrayProto.slice;
var toString=ObjProto.toString;
var isFunction=isType('Function');

var falsey=not(truthy);
var isArray=isType('Array');
var isString=isType('String');
var isNumber=isType('Number');
var map=dispatch(invoker('map',Array.prototype.map),__map);

function fail(thing){
	throw new Error(thing);
}

function warn(){
	console.info(['WARNING:',thing].join(' '));
}

function note(){
	console.log(['NOTE:',thing].join(' '));
}


function existy(x){return x!=null}

function truthy(x){return existy(x)&&x!==false;}

function __map(target,iterator,context){
	var result=[];
	target=toArray(target);
	for(var i=0,l=target.length;i<l;++i){
		result[result.length]=iterator.call(context,target[i],i,target);
	}
	return result;
}

function toArray(x){return existy(x)?slice.call(x):[];}

function not(fn){
	return function(){
		var args=toArray(arguments);
		return !fn.apply(null,args);
	};
}

function when(cond){
	var value;
	var done=truthy(cond);
	var fail=falsey(cond);
	var then=function(fn){
		if(done) value=isFunction(fn)?fn(value):fn;
		return then;
	};
	var otherwise=function(fn){
		if(fail) value=isFunction(fn)?fn(value):fn;
		return otherwise;
	};
	then.value=otherwise.value=function(){
		return value;
	};
	then.then=otherwise.then=then;
	otherwise.otherwise=then.otherwise=otherwise;
	return then;
}

function always(x){return x}

function constant(x){return function(){return x};}

function dispatch(){
	var args=toArray(arguments);
	return function(){
		var ret;
		for(var i=0,l=args.length;i<l;++i){
			ret=args[i].apply(null,toArray(arguments))
			console.log(toArray(arguments),i)
			if(existy(ret))return ret;
		}
		return ret;
	};
}

function pluck(key){
	return function(target){
		return target?target[key]:undefined;
	}
}

function fnull(fn){
	var defaults=rest(fn);
	return function(){
		var args=toArray(arguments);
		var l=args.length;
		while(l--){
			if(existy(args[l]))args[l]=defaults[l];
		}
		return fn.apply(null,args);
	}
}

function first(x){ return nth(x,0);}

function second(x){ return nth(x,1);}

function rest(x){ 
	var y=toArray(x);
	y.shift();
	return y; 
}

function nth(x,key){ return isIndexed(x)?x[key]:undefined;}



function isIndexed(x){return isArray(x)||isString(x);}

function isType(x){
	return function(y){
		return toString.call(y)=='[object '+x+']';
	}
}

function invoker(key,method){
	return function(target){
		if(existy(target)&&target[key]===method)return method.apply(target,rest(arguments));
		return;
	}
}

map('fdsafsad',always)