
;(function(plugin) {
	var chicago = window.Chicago || {
		utils : {
			now: Date.now || function() {
				return new Date().getTime();
			},
			uid : function( prefix ) {
				var d = chicago.utils.now();
				prefix = prefix || '';
				return prefix + 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace( /[xy]/g, function(c) {
					var r = ( d + Math.random() * 16 ) % 16 | 0;
					d = Math.floor( d / 16 );
					return( c === 'x' ? r : ( r & 0x3 | 0x8 )).toString( 16 );
				});
			},
			is : {
				numeric : function( obj ) {
					return ! isNaN( parseFloat( obj ) ) && isFinite( obj );
				},

				integer : function( obj ) {
					return obj && Number( obj ) === obj && obj % 1 === 0;
				},

				float : function( obj ) {
					return obj && Number( obj ) === obj && obj % 1 !== 0;
				},
			},
		},
		$ : window.jQuery || null
	};

	if(typeof define === 'function' && define.amd) {
		define('chicago', function() {
			chicago.load = function(res, req, onload, config) {
				var resources = res.split(','),
					load = [];
				var base = ( config.config && config.config.chicago && config.config.chicago.base ? config.config.chicago.base : '' ).replace( /\/+$/g, '' );
				if( ! base ) {
					throw new Error( 'Please define base path to jquery.transition in the requirejs config.' );
				}
				var i = 0;
				while(i < resources.length) {
					var resource = resources[i].replace(/\./g, '/');
					load.push(base + '/' + resource);
					i += 1;
				}
				req(load, function() {
					onload( chicago );
				});
			};
			return chicago;
		});
	}

	if( window && window.jQuery ) {
		return plugin( chicago, window, window.document );
	} else if( ! window.jQuery ) {
		throw new Error( 'jquery.transition requires jQuery' );
	}

})(function(_c, win, doc) {

	_c.$win = _c.$(win);
	_c.$doc = _c.$(doc);

	if( ! _c.events ) {
		_c.events = {};
	}

	_c.events.transition = {
		defaults: {
			start: function( property ) {},
			progress: function( property, duration, value ) {},
			complete: function( property ) {},
		},
		setup: function( data, namespaces, eventHandle ) {
			var uid = _c.utils.uid( 'transition' ),
				ele = _c.$( this ),
				keys = {
					uid: 'chicago.event.transition.uid',
					base: 'chicago.event.' + uid,
					event: 'chicago.event.' + uid + '.event',
					info: 'chicago.event.' + uid + '.info',
				},
				intervalCount = 15;
			data = _c.$.extend( {}, _c.$.event.special.transition.defaults, data );

			function getCSSValue( property ) {
				var value = ele.css( property ).replace( /px/gi, '' );
				if( _c.utils.is.numeric( value )) {
					value = parseFloat( value );
					if( _c.utils.is.float( value )) {
						value = value.toFixed( 2 );
					}
				}
				return value;
			}

			function stringToMilliseconds( string ) {
				return parseInt( parseFloat( string.replace( 's', '' )) * 1000, 10 );
			}

			function getTransitionData() {
				var info = ele.data( keys.info );
				if( info ) {
					return info;
				}
				info = {};
				var transition = ele.css( 'transition' ).split( ',' );
				for( var i = 0; i < transition.length; i++ ) {
					var values = transition[i].trim().split( ' ' ),
						property = values[0];
					if( ! info.hasOwnProperty( property )) {
						info[property] = {
							duration: stringToMilliseconds( values[1] ),
							function: values[2],
							delay: stringToMilliseconds( values[3] ),
							value: getCSSValue( property )
						};
					}
				}
				ele.data( keys.info, info )
				return info;
			}

			function removeDataForProperty( property ) {
				var keyBase = keys.base + '.' + property,
					_keys = {
						bindStart: keyBase + '.did.bind.start',
						didStart: keyBase + '.did.start',
						didStartAt: keyBase + '.did.start.at',
						progressValue: keyBase + '.progress.value'
					};
				for( var key in _keys ) {
					var string = _keys[key];
					ele.removeData( string );
				}
			}

			function allCompleteHanlder() {
				_c.$.event.special.transition.teardown.call( ele[0] );
			}

			// Set UID
			ele.data( keys.uid, uid );


			var _event = ele.data( keys.event );
			if( ! _event ) {
				_event = {};

				// Begin the interval cycle
				_event.interval = setInterval(function() {
					var info = getTransitionData();
					for( var property in info ) {
						var obj = info[property],
							origValue = obj.value,
							currentValue = getCSSValue( property ),
							keyBase = keys.base + '.' + property,
							now = _c.utils.now(),

							// Data key variables
							dataKeys = {
								bindStart: keyBase + '.did.bind.start',
								didStart: keyBase + '.did.start',
								didStartAt: keyBase + '.did.start.at',
								progressValue: keyBase + '.progress.value'
							},

							// Event key variables
							eventKeys = {
								start: keyBase + '.start',
								progress: keyBase + '.progress',
								complete: keyBase + '.complete',
							},

							// Data values
							didBindStart = ele.data( dataKeys.bindStart ),
							didStart = ele.data( dataKeys.didStart ),
							didStartAt = ele.data( dataKeys.didStartAt ),
							lastValue = ele.data( dataKeys.progressValue );

						if( didStartAt && didStartAt < now - obj.duration && lastValue === currentValue ) {
							info = ele.data( keys.info );
							delete info[property];
							ele.data( keys.info, info );
							removeDataForProperty( property );
							data.complete.call( ele[0], property );
							if( ! Object.keys( info ).length ) {
								ele.trigger( 'transition' );
								setTimeout( allCompleteHanlder );
							}
							return false;
						}

						if( ! didBindStart ) {
							ele.data( dataKeys.bindStart, true );

							function progressHandler( e, evtData ) {
								var latestDataKey = keys.base + '.' + evtData.property + '.progress.value';
								ele.data( latestDataKey, evtData.cssValue );
								data.progress.call( ele[0], evtData.property, evtData.elapsedTime, evtData.cssValue );
							}

							ele.one( eventKeys.start, function( e, evtData ) {
								data.start.call( ele[0], evtData.property );
								ele.on( keys.base + '.' + evtData.property + '.progress', progressHandler );
							});
						}

						if( didStart === undefined && currentValue !== origValue ) {
							ele.data( dataKeys.didStart, true ).data( dataKeys.didStartAt, now );
							ele.trigger( eventKeys.start, {
								property: property
							});
						} else if( didStart && currentValue !== origValue ) {
							ele.trigger( eventKeys.progress, {
								property: property,
								cssValue: currentValue,
								elapsedTime: now - ele.data( dataKeys.didStartAt ),
							});
						}
					}
				}, intervalCount );
				ele.data( keys.event, _event );
			}
			return true;
		},
		teardown: function() {
			var uid = _c.$( this ).data( 'chicago.event.transition.uid' ),
				keys = {
					uid: 'chicago.event.transition.uid',
					base: 'chicago.event.' + uid,
					event: 'chicago.event.' + uid + '.event',
					info: 'chicago.event.' + uid + '.info',
				};
			for( var k in keys ) {
				var key = keys[k],
					value = _c.$( this ).data( key );

				// Clear the interval timer
				if( k === 'event' ) {
					clearInterval( value.interval );
				}

				// Remove all data
				if( value ) {
					_c.$( this ).removeData( key );
				}
			}
		}
	};

	(function() {
		_c.$.event.special.transition = _c.events.transition;
		_c.$.fn.transition = function(options, callback) {
			return this.each(function() {
				_c.$(this).on('transition', options, callback);
			});
		};
	})();
});
