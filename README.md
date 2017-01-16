# videojs-analytics

Track Google Analytics events from video.js players

## Installation

```sh
npm install --save videojs-analytics
```

The npm installation is preferred, but Bower works, too.

```sh
bower install  --save videojs-analytics
```

## Usage

To include videojs-analytics on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-analytics.min.js"></script>
<script>
  var player = videojs('my-video');

  player.analytics();
</script>
```

### Browserify

When using with Browserify, install videojs-analytics via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-analytics');

var player = videojs('my-video');

player.analytics();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-analytics'], function(videojs) {
  var player = videojs('my-video');

  player.analytics();
});
```

## License

MIT. Copyright (c) Adam Oliver &lt;mail@adamoliver.net&gt;


[videojs]: http://videojs.com/
