var existy=function(x){return x!=null};
var truthy=function(x){return existy(x)&&x!==false;};
var isFunction=function(x){return Object.prototype.toString.call(x)=='[object Function]';};
var toArray=function(x){return [].slice.call(x);};
var falsey=not(truthy);
var not=function(fn){
	return function(){
		var args=toArray(arguments);
		return !fn.apply(null,args);
	};
};
var when=function(cond){
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
};
var dispatch=function(){
	var args=toArray(arguments);
	return function(){
		var ret;
		for(var i=0,l=args.length;i<l;++i){
			ret=args[i].apply(null,toArray(arguments))
			if(existy(ret))return ret;
		}
		return ret;
	};
};
var pluck=function(key){
	return function(target){
		return target?target[key]:undefined;
	}
};