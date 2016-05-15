(function(global){
	//require fn.js
	function captureMouse(dom){
		var mouse={x:0,y:0};
		element.addEventListener('mousemove',function(){
			var x,y;
			if(event.pageX||event.pageY){
				x=event.pageX;
				y=event.pageY;
			}else{
				x=event.clientX+document.body.scroolLeft+document.documentElement.scroolLeft;
				y=event.clientY+document.body.scrollTop+document.documentElement.scroolTop;

			}
			x-=dom.offsetLeft;
			y-=dom.offsetTop;
			mouse.x=x;
			mouse.y=y;
		},false);
		return mouse;
	}

	function captureTouch(dom){
		var touch={x:null,y:null,isTouched:false};

		element.addEventListener('touchstart',function(event){
			touch.isTouched=true;
		},false);

		element.addEventListener('touchmove',function(event){
			var x,y;
			var touch=event.touches[0];
			if(touch.pageX||touch.pageY){
				x=touch.pageX;
				y=touch.pageY;
			}else{
				x=touch.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
				y=touch.clientY+document.body.scroolTop+document.documentElement.scroolTop;
			}

			x-=dom.offsetLeft;
			y-=dom.offsetTop;
			touch.x=x;
			touch.y=y;
		},false);

		return touch;
	}
	global.utils={
		captureMouse:captureMouse,
		captureTouch:captureTouch
	};
}(this))