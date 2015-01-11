/*
 * Easy Paginate
 * 
 * written by Alen Grakalic - http://cssglobe.com
 * adapted by Devi Mandiri - http://devi.web.id
 * 
 * Copyright (c) 2011 Alen Grakalic (http://cssglobe.com)
 * Dual licensed under the MIT and GPL.
 */
 
(function($){

	$.easyPaginate = function(el, options){

		var plugin = this, o;

		plugin.$el = $(el);

		plugin.$el.data("easyPaginate", plugin);

		var step, lower, upper,
			children = plugin.$el.children(),
			count = children.length,
			next, prev, page = 1,
			timer, clicked = false,
			activePage, _idx = 0;

		var show = function(){
			clearTimeout(timer);

			lower = (page - 1) * step;
			upper = lower + step;

			if (_idx == 0 ){
				children.removeClass(o.current);
				children.hide().slice(lower, upper).show();
				children.not(":hidden").eq(0).addClass(o.current);

				if (count>step){
					if (o.nextprev){
						if (upper >= count){ next.hide(); } else { next.show(); }
						if (lower >= 1){ prev.show(); } else { prev.hide(); }
					}
				}

				var p = plugin.$el.parent().find("." + o.controls);
				if (p.length > 0) {
					p.find("li").removeClass(o.current);
					p.find('li[data-index="' + page + '"]').addClass(o.current);
				}
			}

			if (o.auto){
				if (o.clickstop && clicked){} else {
					if ($.isFunction(o.onSlide)){
						var el = plugin.$el.find("."+o.current);
							o.onSlide.apply(el, arguments);
					}
					timer = setTimeout(function(){
						var len = children.not(":hidden").length -1;
						if (_idx < len){
							_idx++;
							children.removeClass(o.current);
							children.not(":hidden").eq(_idx).addClass(o.current);
						} else {
							_idx = 0;
							if (upper >= count){
								page = 1;
							} else {
								page++;
							}
						}
						show();
					}, o.delay);
				}
			}
		};

		plugin.pause = function(){
			clicked = false;
			o.auto = false;
			show();
		};

		plugin.slide = function(){
			clicked = false;
			o.auto = true;
			show();
		};

		var init = function(){
			plugin.options = o = $.extend({}, $.easyPaginate.defaults, options);

			plugin.$el.wrap('<div class="' + o.container + '" />');

			step = o.step;

			if (count > step){
				var pages = Math.floor(count / step);
				if((count/step) > pages) pages++;

				var ol = $('<ol class="' + o.controls + '"></ol>').insertAfter(plugin.$el);

				if (o.nextprev){
					prev = $('<li class="prev">' + o.prevContent + "</li>")
								.hide()
								.appendTo(ol)
								.click(function () {
									clicked = true;
									page--;
									_idx = 0;
									show();
								});
				}

				if (o.numeric){
					for (var i = 1; i <= pages; i++){
						$('<li data-index="' + i + '">' + i + "</li>")
							.appendTo(ol)
							.click(function () {
								clicked = true;
								page = $(this).attr("data-index");
								_idx = 0;
								show();
							});
					}
				}

				if (o.nextprev){
					next = $('<li class="next">' + o.nextContent + "</li>")
								.hide()
								.appendTo(ol)
								.click(function () {
									clicked = true;
									page++;
									_idx = 0;
									show();
								});
				}
			}

			if ($.isFunction(o.onClick)){
				children.click(function(){
					plugin.pause();
					children.removeClass(o.current);
					$(this).addClass(o.current);
					_idx = children.not(":hidden").index(this);
					o.onClick.apply(this, arguments);
				});
			}

			show();
		};

		init();
	};

	$.easyPaginate.defaults = {
		step: 3,
		delay: 4000,
		numeric: true,
		nextprev: true,
		auto: false,
		clickstop: true,
		controls: "pagination",
		current: "current",
		container: "container",
		prevContent: "Previous",
		nextContent: "Next",
		onClick: false,
		onSlide: false
	};

	$.fn.easyPaginate = function(options){
		return (undefined == $(this).data("easyPaginate"))
			? this.each(function(){
				(new $.easyPaginate(this, options));
			})
			: $(this).data("easyPaginate");
	};

})(jQuery);
