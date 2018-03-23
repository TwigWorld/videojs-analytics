# videojs-analytics

Track Google Analytics or Global site tag [gtag][gtag] events from video.js players

## Installation

```sh
npm install --save videojs-analytics
```

The npm installation is preferred, but Bower works, too.

```sh
bower install  --save videojs-analytics
```

## Usage

To include videojs-analytics on your website or web application, use any of the following methods. If you wish to use gtags you must pass in a mode property when setting up the player otherwise it will fallback to use Google Analytics.

```html
<script>
    player.analytics({
        mode: 'GTAG',
        events: [...]
      });
</script>
```

### `<script>` Tag

#### Google Analytics

To implement Google Analytics this is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-analytics.min.js"></script>
<script>
  var player = videojs('my-video');

  player.analytics();
</script>
```

#### Global site tag (gtag)

To implement GTags this is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available. You also must request the google tag manager script with your tracking id in the head of the page

```html
<head>
  ...
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    window.gtag =  function() { dataLayer.push(arguments); }
    window.gtag('js', new Date());

    window.gtag('config', 'GA_TRACKING_ID');
  </script>
</head>
<body>
  ...
  <script src="//path/to/video.min.js"></script>
  <script src="//path/to/videojs-analytics.min.js"></script>
  <script>
    player.analytics({
        mode: 'GTAG',
        events: [...]
      });
  </script>
</body>
```

##### Custom dimensions

If you wish to use custom dimensions simple pass in a object with your desired custom dimensions

```html
<head>
  ...
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    window.gtag =  function() { dataLayer.push(arguments); }
    window.gtag('js', new Date());
    window.gtag('config', 'GA_TRACKING_ID', {
      'custom_map': {
        'dimension1': 'access_level',
        'dimension2': 'uuid',
        'dimension3': 'whatever_you_want'
      },
      'dimension1': 'DEBUG',
      'dimension2': '12345',
      'dimension3': 'SOME_VALUE'
    });
  </script>
</head>
<body>
  ...
  <script src="//path/to/video.min.js"></script>
  <script src="//path/to/videojs-analytics.min.js"></script>
  <script>
    var player = window.player = videojs('videojs-analytics-player');
      player.analytics({
        mode: 'GTAG',
        customDimensions: {
          'access_level': 'DEBUG',
          'uuid': '12345'
        },
        events: [...]
      });
  </script>
</body>

```

### Available options

#### Google Analytics

There are two options you can pass to the plugin. The first is to configure which events you would like to trigger from videojs.
This option is an array objects for each event.  Each event contains the name of the event triggered by Video.js and a label and action which will be sent to Google Analytics.  Choose from the list below:

```javascript
player.analytics({
  events: [
    {
      name: 'play',
      label: 'video play',
      action: 'play',
    },
    {
      name: 'pause',
      label: 'video pause',
      action: 'pause',
    },
    {
      name: 'ended',
      label: 'video ended',
      action: 'ended',
    },
    {
      name: 'fullscreenchange',
      label: {
        open: 'video fullscreen open',
        exit: 'video fullscreen exit'
      },
      action: 'fullscreen change',
    },
    {
      name: 'volumechange',
      label: 'volume changed',
      action: 'volume changed',
    },
    {
      name: 'resize',
      label: 'resize',
      action: 'resize',
    },
    {
      name: 'error',
      label: 'error',
      action: 'error',
    },
    {
      name: 'resize',
      label: 'resize',
      action: 'resize',
    },
    {
      name: 'resolutionchange',
      action: 'resolution change',
    },
    {
      name: 'timeupdate',
      action: 'time updated',
    }
  ]
})
```

You can also add your own custom events which are not included in the above list. If you include any custom events the event sent to Google Analytics will be the name of the event.


To configure the default category names for audio and video files use the `defaultAudioCategory` `defaultVideoCategory` properties when initialising the plugin.

```
player.analytics({
  defaultAudioCategory: 'Audio',
  defaultVideoCategory: 'Video'
})

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
[gtag]: https://developers.google.com/analytics/devguides/collection/gtagjs/
