var falsey=not(truthy);
function existy(x){return x!=null};
function truthy(x){return existy(x)&&x!==false;};
function isFunction(x){return Object.prototype.toString.call(x)=='[object Function]';};
function toArray(x){return [].slice.call(x);};
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
function dispatch(){
	var args=toArray(arguments);
	return function(){
		var ret;
		for(var i=0,l=args.length;i<l;++i){
			ret=args[i].apply(null,toArray(arguments))
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