function carousel(container, contentFile) {
	
	// Find content JSON
	$.getJSON(contentFile, function(data) {
		this.content = data;
	});

	this.init = function() {
		$('.success-icons a').click(function(){
			if ($('.success-carousel').hasClass('animating')) return false;
			var currentIndex = $('.success-icons a.current').data('storykey');
			$('.success-icons a.current').removeClass('current');
			$(this).addClass('current');
			var newIndex = $(this).data('storykey');
			var direction = currentIndex < newIndex ? "right" : "left";

			this.goToStory(newIndex, direction);
			this.centerIcon();
		});
		$('.success-carousel .nav-right').click(function(){this.advanceStory('next')});
		$('.success-carousel .nav-left').click(function(){this.advanceStory('prev')});
		$('.success-icons').swipe({
			swipeLeft: function(){this.advanceStory('next')}, 
			swipeRight: function(){this.advanceStory('prev')}, 
			excludedElements: "button, input, select, textarea, .noSwipe"
		});
		$(window).resize(this.centerIcon);
		this.centerIcon();
	}

	this.goToStory = function(key, direction) {
		if ($('.success-carousel').hasClass('animating')) return false;
		$('.success-carousel').addClass('animating');

		var storyhtml = this.constructStory(this.stories[key]);
		if (direction == "left") {
			// 1. See if staged div has the content loaded
			$('.success-content-text.stage-left').html(storyhtml);
			// 2. Animate center and left divs
			$('.success-content-text.current, .success-content-text.stage-left').addClass('anim-right');
			window.setTimeout(function(){
				// 3. Remove stage-right, rename others
				var oldhtml = $('.success-content-text.stage-right').html();
				$('.success-content-text.stage-right').remove();
				$('.success-content-text.current').removeClass('current').removeClass('anim-right').addClass('stage-right');
				$('.success-content-text.stage-left').removeClass('stage-left').removeClass('anim-right').addClass('current');
				// 4. Re-add stage-left
				var srdiv = $('<div/>').addClass('success-content-text stage-left')//.html(oldhtml);
				srdiv.prependTo('.success-content-inner');

				$('.success-carousel').removeClass('animating');
			}, 250);
		} else {
			// 1. See if staged div has the content loaded
			$('.success-content-text.stage-right').html(storyhtml);
			// 2. Animate center and right divs
			$('.success-content-text.current, .success-content-text.stage-right').addClass('anim-left');
			window.setTimeout(function(){
				// 3. Remove stage-left, rename others
				var oldhtml = $('.success-content-text.stage-left').html();
				$('.success-content-text.stage-left').remove();
				$('.success-content-text.current').removeClass('current').removeClass('anim-left').addClass('stage-left');
				$('.success-content-text.stage-right').removeClass('stage-right').removeClass('anim-left').addClass('current');
				// 4. Re-add stage-right
				var srdiv = $('<div/>').addClass('success-content-text stage-right')//.html(oldhtml);
				srdiv.appendTo('.success-content-inner');

				$('.success-carousel').removeClass('animating');
			}, 250);
		}
	}

	this.constructStory = function(storydata) {
		var html = "";
		html += '<div id="story" class="success-story">';
		if (storydata.format != 'video') {
			html += '<figure class="success-content-image">';
			html += storydata.image;
			html += '<figcaption>' + storydata['image-caption'] + '</figcaption>';
			html += '</figure>';
		}
		html += "<h3>" + storydata.title;
		if (typeof storydata.meta['grad-year'] != "undefined") html += ", &rsquo;" + storydata.meta['grad-year'][0].substring(2);
		html += "</h3>";
		if (typeof storydata.meta['occupation'] != "undefined") {
			html += "<h4>" + storydata.meta['occupation'][0] + "</h4>";
		}
		html += storydata.content;
		return html;
	}

	this.centerIcon = function() {
		// width of container
		var container_width = $('.success-icons').width();
		var center = container_width/2;
		// distance of icon from left edge of icon row
		var offset = $('.success-icons a.current').offset().left - $('.success-icons ul').offset().left;
		// width of icon element
		var icon_width = $('.success-icons a.current').parent('li').width();
		// reposition parent ul
		$('.success-icons ul').css('left', center-offset-(icon_width/2));
	}

	this.advanceStory = function(direction) {
		if (direction == 'next') {
			var nextIcon = $('.success-icons a.current').parent('li').next().find('a');
			if (nextIcon.length > 0) nextIcon.click();
			else $('.success-icons li:first-child a').click();
		} else if (direction == 'prev') {
			var prevIcon = $('.success-icons a.current').parent('li').prev().find('a');
			if (prevIcon.length > 0) prevIcon.click();
			else $('.success-icons li:last-child a').click();
		}

		// scroll up if necessary 
		if ($('.success-carousel').offset().top < $(document).scrollTop()){
			window.scrollTo(0, $('.success-carousel').offset().top);
		}
	}
}