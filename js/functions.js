(function(_c) {
	var GLOBALS, fixedNavbar, parallaxHeader, setActiveNavbar;
	GLOBALS = {
		header: _c.$('.header').height(),
		nav: {
			top: 0,
			left: 0,
			width: 0
		}
	};
	parallaxHeader = function(y) {
		var h1, h2, percentage;
		percentage = y / GLOBALS.header;
		_c.$('.header-cover').css('top', percentage * (GLOBALS.header * 0.22));
		h1 = _c.$('.header-center h1');
		if(y <= h1.offset().top + h1.height()) {
			h1.css('top', percentage * (GLOBALS.header * -0.17));
		}
		h2 = _c.$('.header-center h2');
		if(y <= h2.offset().top + h2.height()) {
			return h2.css('top', percentage * (GLOBALS.header * -0.11));
		}
	};
	fixedNavbar = function(y) {
		var aside;
		aside = _c.$('.aside-inner');
		if(y < GLOBALS.header) {
			if(aside.hasClass('aside-fixed')) {
				return aside.removeClass('aside-fixed').removeAttr('style');
			}
		} else {
			if(!aside.hasClass('aside-fixed')) {
				aside.addClass('aside-fixed').css({
					top: GLOBALS.nav.top,
					left: GLOBALS.nav.left
				});
			}
			return aside.width(GLOBALS.nav.width);
		}
	};
	setActiveNavbar = function(y) {
		var articles;
		if(y === _c.$html.height() - _c.$win.height()) {
			_c.$('.nav-side li').removeClass('active');
			_c.$('.nav-side li:last-child').addClass('active');
			return;
		}
		articles = _c.$(_c.$('.article').get().reverse());
		return articles.each(function(i) {
			var id, parent;
			if(y >= _c.$(this).offset().top) {
				id = _c.$(this).attr('id');
				parent = _c.$("[href='#" + id + "']").parent();
				if(parent.hasClass('active')) {
					return false;
				}
				parent.siblings().removeClass('active');
				parent.addClass('active');
				return false;
			}
		});
	};
	_c.$html.on('click', '.nav-side a', function(e) {
		var id, parent;
		id = _c.$(this).attr('href');
		if(id.indexOf('http') > -1) {
			return;
		}
		e.preventDefault();
		parent = _c.$(this).parent();
		return _c.$('html, body').stop().animate({
			scrollTop: _c.$(id).offset().top
		}, function() {
			parent.siblings().removeClass('active');
			return parent.addClass('active');
		});
	});
	_c.$doc.on('ready reloaded.clique.dom', function() {
		var parent;
		GLOBALS.header = _c.$('.header').height();
		parent = _c.$('.aside-inner').parent();
		return GLOBALS.nav = {
			top: parseInt(_c.$('.header + *').css('paddingTop'), 10),
			left: parent.offset().left - parseInt(parent.css('paddingLeft'), 10),
			width: parent.width()
		};
	});
	_c.$doc.on('ready scrolling.clique.dom reloaded.clique.dom', function(e, memory) {
		var y;
		if(_c.$html.hasClass('screen-mini')) {
			return;
		}
		y = memory ? memory.y : _c.$win.scrollTop();
		if(y < GLOBALS.header) {
			parallaxHeader(y);
		} else {
			setActiveNavbar(y);
		}
		return fixedNavbar(y);
	});
	return _c.$html.on('click', '.demo-button', function(e) {
		var btn, pre;
		e.preventDefault();
		btn = _c.$(this);
		if(btn.hasClass('disabled')) {
			return;
		}
		btn.addClass('disabled');
		pre = _c.$('.demo-pre');
		_c.$('.demo-box').one('transition', {
			start: function(prop) {
				var html;
				html = ['<span class="demo-pre-method">method:</span> <span class="demo-pre-val">start</span>\n', '<span class="demo-pre-method">parameters:</span> {\n\tproperty : <span class="demo-pre-val">' + prop + '</span>\n}', '<hr>'];
				pre.html(html.join(''));
				return console.log('start', prop);
			},
			progress: function(prop, duration, value) {
				var html;
				html = ['<span class="demo-pre-method">method:</span> <span class="demo-pre-val">progress</span>\n', '<span class="demo-pre-method">parameters:</span> {\n\tproperty : <span class="demo-pre-val">' + prop + '</span>\n\tduration : <span class="demo-pre-val">' + duration + '</span>\n\tvalue : <span class="demo-pre-val">' + value + '</span>\n}', '<hr>'];
				pre.append(html.join(''));
				return console.log('progress', prop, duration, value);
			},
			complete: function(prop) {
				var html;
				html = ['<span class="demo-pre-method">method:</span> <span class="demo-pre-val">complete</span>\n', '<span class="demo-pre-method">parameters:</span> {\n\tproperty : <span class="demo-pre-val">' + prop + '</span>\n}'];
				pre.append(html.join(''));
				console.log('complete', prop);
				return btn.removeClass('disabled');
			}
		}, function() {
			return console.log('all done');
		});
		return _c.$('.demo-box').toggleClass('active');
	});
})(Clique);
