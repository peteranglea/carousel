/**
 * IN PROGRESS: Gonna convert this to ES6/ES2015
 * Teaching myself a new trick
 */
class Carousel {
	constructor(container, contentFile) {
		this.container = $(container);

		// Find content JSON
		let obj = this;
		$.getJSON(contentFile, function(data) {
			if (data.length > 0) {
				obj.data = data;
				obj.init();
			} else {
				console.log('No data retrieved.');
			}
		});
	}

	// Initialize object, generate markup, assign interactions, etc.
	init() {
		let obj = this;
		// Generate markup from object data
		let markup = "";
		// Make thumbnail row
		markup += '<div class="carousel-thumbs">' + 
			'<div class="carousel-thumbs-inner">' + 
				'<ul class="clearfix">';
		for (let i = 0; i < this.data.length; i++) {
			var current = i == 0 ? ' class="current"' : '';
			markup += '<li><a href="javascript:;" data-itemkey="' + i + '"' + current + '><img src="' + this.data[i].thumbnail + '" /></a></li>';
		}
		markup += '</ul>' +
			'</div>' +
		'</div>';

		// Make content area
		markup += '<div class="carousel-content">' +
			'<div class="carousel-content-inner">' +
				'<div class="carousel-content-text stage-left"></div>' +
				'<div class="carousel-content-text current">' + this.data[0].content + '</div>' +
				'<div class="carousel-content-text stage-right"></div>' +
			'</div>' +
		'</div>';

		// Make nav
		markup += '<div class="carousel-nav">' +
			'<ul class="clearfix">' +
				'<li class="nav-left">' +
					'<a href="javascript:;">&larr; Previous</a>' +
				'</li>' +
				'<li class="nav-right">' +
					'<a href="javascript:;">Next &rarr;</a>' +
				'</li>' +
			'</ul>' +
		'</div>';

		this.container.html(markup);

		// Assign interactivity
		this.container.find('.carousel-thumbs a').click(function(){
			if (obj.container.hasClass('animating')) return false;
			var currentIndex = obj.container.find('.carousel-thumbs a.current').data('itemkey');
			obj.container.find('.carousel-thumbs a.current').removeClass('current');
			$(this).addClass('current');
			var newIndex = $(this).data('itemkey');
			var direction = currentIndex < newIndex ? "right" : "left";

			obj.goToStory(newIndex, direction);
			obj.centerIcon();
		});
		this.container.find('.nav-right').click(function(){obj.advanceStory('next')});
		this.container.find('.nav-left').click(function(){obj.advanceStory('prev')});
		this.container.find('.carousel-thumbs').swipe({
			swipeLeft: function(){obj.advanceStory('next')}, 
			swipeRight: function(){obj.advanceStory('prev')}, 
			excludedElements: "button, input, select, textarea, .noSwipe"
		});
		$(window).resize(function(){obj.centerIcon()});
		this.centerIcon();
	}

	goToStory(key, direction) {
		let obj = this;
		if (this.container.hasClass('animating')) return false;
		this.container.addClass('animating');

		if (direction == "left") {
			// 1. See if staged div has the content loaded
			this.container.find('.carousel-content-text.stage-left').html(this.data[key].content);
			// 2. Animate center and left divs
			this.container.find('.carousel-content-text.current, .carousel-content-text.stage-left').addClass('anim-right');
			window.setTimeout(function(){
				// 3. Remove stage-right, rename others
				obj.container.find('.carousel-content-text.stage-right').remove();
				obj.container.find('.carousel-content-text.current').removeClass('current').removeClass('anim-right').addClass('stage-right');
				obj.container.find('.carousel-content-text.stage-left').removeClass('stage-left').removeClass('anim-right').addClass('current');
				// 4. Re-add stage-left
				let newdiv = $('<div/>').addClass('carousel-content-text stage-left');
				let dest = obj.container.find('.carousel-content-inner');
				newdiv.prependTo(dest);

				obj.container.removeClass('animating');
			}, 250);
		} else {
			// 1. See if staged div has the content loaded
			this.container.find('.carousel-content-text.stage-right').html(this.data[key].content);
			// 2. Animate center and right divs
			this.container.find('.carousel-content-text.current, .carousel-content-text.stage-right').addClass('anim-left');
			window.setTimeout(function(){
				// 3. Remove stage-left, rename others
				obj.container.find('.carousel-content-text.stage-left').remove();
				obj.container.find('.carousel-content-text.current').removeClass('current').removeClass('anim-left').addClass('stage-left');
				obj.container.find('.carousel-content-text.stage-right').removeClass('stage-right').removeClass('anim-left').addClass('current');
				// 4. Re-add stage-right
				let newdiv = $('<div/>').addClass('carousel-content-text stage-right');
				let dest = obj.container.find('.carousel-content-inner');
				newdiv.appendTo(dest);

				obj.container.removeClass('animating');
			}, 250);
		}
	}

	centerIcon() {
		// width of container
		let container_width = this.container.find('.carousel-thumbs').width();
		let center = container_width/2;
		// distance of icon from left edge of icon row
		let offset = this.container.find('.carousel-thumbs a.current').offset().left - this.container.find('.carousel-thumbs ul').offset().left;
		// width of icon element
		let icon_width = this.container.find('.carousel-thumbs a.current').parent('li').width();
		// reposition parent ul
		this.container.find('.carousel-thumbs ul').css('left', center-offset-(icon_width/2));
	}

	advanceStory(direction) {
		if (direction == 'next') {
			let nextIcon = this.container.find('.carousel-thumbs a.current').parent('li').next().find('a');
			if (nextIcon.length > 0) nextIcon.click();
			else this.container.find('.carousel-thumbs li:first-child a').click();
		} else if (direction == 'prev') {
			let prevIcon = this.container.find('.carousel-thumbs a.current').parent('li').prev().find('a');
			if (prevIcon.length > 0) prevIcon.click();
			else this.container.find('.carousel-thumbs li:last-child a').click();
		}

		// scroll up if necessary 
		if (this.container.offset().top < $(document).scrollTop()){
			window.scrollTo(0, this.container.offset().top);
		}
	}
}