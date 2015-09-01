
do (_c = Clique)->

	GLOBALS =
		header : _c.$('.header').height()
		nav :
			top : 0
			left : 0
			width : 0

	parallaxHeader = (y)->
		percentage = y / GLOBALS.header
		_c.$('.header-cover').css 'top', percentage * ( GLOBALS.header * 0.22 )
		h1 = _c.$('.header-center h1')
		if y <= h1.offset().top + h1.height()
			h1.css 'top', percentage * ( GLOBALS.header * -0.17 )
		h2 = _c.$('.header-center h2')
		if y <= h2.offset().top + h2.height()
			h2.css 'top', percentage * ( GLOBALS.header * -0.11 )

	fixedNavbar = (y)->
		aside = _c.$('.aside-inner')
		if y < GLOBALS.header
			if aside.hasClass 'aside-fixed'
				aside
					.removeClass 'aside-fixed'
					.removeAttr 'style'
		else
			if ! aside.hasClass 'aside-fixed'
				aside
					.addClass 'aside-fixed'
					.css
						top : GLOBALS.nav.top
						left : GLOBALS.nav.left
			aside.width GLOBALS.nav.width

	setActiveNavbar = (y)->
		if y is _c.$html.height() - _c.$win.height()
			_c.$('.nav-side li').removeClass 'active'
			_c.$('.nav-side li:last-child').addClass 'active'
			return
		articles = _c.$ _c.$('.article').get().reverse()
		articles.each (i)->
			if y >= _c.$(@).offset().top
				id = _c.$(@).attr 'id'
				parent = _c.$("[href='##{id}']").parent()
				if parent.hasClass 'active'
					return false
				parent.siblings().removeClass 'active'
				parent.addClass 'active'
				return false

	_c.$html.on 'click', '.nav-side a', (e)->
		id = _c.$(@).attr 'href'
		if id.indexOf( 'http' ) > -1
			return
		e.preventDefault()
		parent = _c.$(@).parent()
		_c.$('html, body').stop().animate
			scrollTop : _c.$(id).offset().top
		, ->
			parent.siblings().removeClass 'active'
			parent.addClass 'active'

	_c.$doc.on 'ready reloaded.clique.dom', ->
		GLOBALS.header = _c.$('.header').height()
		parent = _c.$('.aside-inner').parent()
		GLOBALS.nav =
			top : parseInt( _c.$('.header + *').css('paddingTop'), 10 )
			left : parent.offset().left - parseInt( parent.css('paddingLeft'), 10 )
			width : parent.width()

	_c.$doc.on 'ready scrolling.clique.dom reloaded.clique.dom', (e, memory)->
		if _c.$html.hasClass 'screen-mini'
			return
		y = if memory then memory.y else _c.$win.scrollTop()
		if y < GLOBALS.header
			parallaxHeader y
		else
			setActiveNavbar y
		fixedNavbar y

	_c.$html.on 'click', '.demo-button', (e)->
		e.preventDefault()
		btn = _c.$(@)
		if btn.hasClass 'disabled'
			return
		btn.addClass 'disabled'
		pre = _c.$('.demo-pre')
		_c.$('.demo-box').one 'transition', {
			start : (prop)->
				html = [
					'<span class="demo-pre-method">method:</span> <span class="demo-pre-val">start</span>\n'
					'<span class="demo-pre-method">parameters:</span> {\n\tproperty : <span class="demo-pre-val">' + prop + '</span>\n}'
					'<hr>'
				]
				pre.html html.join ''
				console.log 'start', prop
			progress : (prop, duration, value)->
				html = [
					'<span class="demo-pre-method">method:</span> <span class="demo-pre-val">progress</span>\n'
					'<span class="demo-pre-method">parameters:</span> {\n\tproperty : <span class="demo-pre-val">' + prop + '</span>\n\tduration : <span class="demo-pre-val">' + duration + '</span>\n\tvalue : <span class="demo-pre-val">' + value + '</span>\n}'
					'<hr>'
				]
				pre.append html.join ''
				console.log 'progress', prop, duration, value
			complete : (prop)->
				html = [
					'<span class="demo-pre-method">method:</span> <span class="demo-pre-val">complete</span>\n'
					'<span class="demo-pre-method">parameters:</span> {\n\tproperty : <span class="demo-pre-val">' + prop + '</span>\n}'
				]
				pre.append html.join ''
				console.log 'complete', prop
				btn.removeClass 'disabled'
		}, ->
			console.log 'all done'
		_c.$('.demo-box').toggleClass 'active'
