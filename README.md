# jquery.transition

##### A custom jQuery event that executes user-defined callback functions during an elements CSS transition.

***

## Demo

See the demo [here](http://nielse63.github.io/jquery.transition/).

***

## Dependencies

[jquery.transition](https://github.com/nielse63/jquery.transition) is dependent on jQuery version 1.8.4+.

***

## Installation

##### Manual installation

Reference the file in your project:

```html
<script src="js/jquery.transition.js"></script>
```

##### Using Bower

```sh
bower intsall jquery.transition
```

##### Using NPM

```sh
npm install jquery.transition --save-dev
```

***

## Options &amp; Usage

*Just as a heads up: There is also [working example of how to use the plugin in the repo](https://github.com/nielse63/jquery.transition/blob/master/tests/static/index.html).*

##### Options:

All options are set as the second parameter of the jQuery event-binding method ``` .on(...)```. For more info on this method, [read the documentation on jQuery'r website](https://api.jquery.com/on/). As an example:

```js
$(selector).on('transition', {

  // options.start - This method is executed when the element
  // begins transitioning, and is only executed once per
  // transition property
  // ***
  // Parameters:
  //   property[string] - the value of the CSS property that began to transition
  start : function( property ) {
    // ...
  },

  // options.progress - This method after the element has
  // begun transitioning, and fires every 15ms until
  // the transition is complete.
  // ***
  // Parameters:
  //   property[string] - the value of the CSS property that is currently transitioning
  //   duration[integer] - the amount of time, in milliseconds, since the transition started
  //   value[float|integer|string] - the current value of the CSS property currently transitioning
  progress : function( property, duration, value ) {
    // ...
  },

  // options.complete - This method is executed once
  // the transition has completed.
  // ***
  // Parameters:
  //   property[string] - the value of the CSS property that finished transitioning
  complete : function( property ) {
    // ...
  }
},

  // Event Callback - This callback function is
  // executed after all initial CSS transition-property
  // values have completed their transition phase. If
  // the event is unbound prior to that moment, this
  // callback will never be executed.
  // ***
  // Parameters:
  //   event[jQuery Event] - The default jQuery Event created during during initial setup
  function( evt ) {
    // ...
});
```

##### Basic usage:

Add the transition property values in your CSS:

```css
.box {
  height: 250px;
  width: 250px;
  opacity: 0.75;
  transition: 2000ms ease-in-out width 0ms, 1000ms ease-out opacity 250ms;
}
.box.active {
  width: 500px;
  opacity: 0;
}
```

Bind the event:

```js
$('.box').on('transition', {
  start : function( property ) {
    console.log( 'started', property );
  },
  progress : function( property, duration, value ) {
    console.log( 'progress', property, duration, value );
  },
  complete : function( property ) {
    console.log( 'ended', property );
  }
}, function( evt ) {
  console.log('Event callback function:', evt);
});
```

Do something to initialize the transition:

```js
setTimeout(function() {
  $('.box').addClass( 'active' );
}, 1500);
```

***

## License

This plugin is licensed under the [MIT license](http://opensource.org/licenses/MIT).  A copy of the license is included in this package.
