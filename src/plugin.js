import videojs from 'video.js';

// Default options for the plugin.
const defaults = {
  events: [],
  assetName: 'Video',
  defaultVideoCategory: 'Video',
  defaultAudioCategory: 'Audio'
};

const analyticsMode = {
  googleAnalytics: 'GA',
  googleTags: 'GTAG'
};

window.ga = window.ga || function() {
  return void 0;
};

window.gtag = window.gtag || function() {
  return void 0;
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function analytics
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const analytics = function(options) {

  options = videojs.mergeOptions(defaults, options);

  this.ready(() => {

    let progress = {
      quarter: false,
      half: false,
      threeQuarters: false
    };

    function track(player, action, label) {
      let category = options.defaultVideoCategory;
      let customDimensions = options.customDimensions || {};

      if (player.isAudio()) {
        category = options.defaultAudioCategory;
      }

      if (!label) {
        label = '';
      }

      if (options.mode === analyticsMode.googleTags) {
        window.gtag('event', action,
        /* eslint camelcase: 0 */
        {event_category: category, event_label: label, customDimensions});
      } else {
        window.ga('send', 'event', category, action, label);
      }
    }

    function play(player, event) {
      track(player, event.action, event.label);
      track(player, 'Asset name', options.assetName);
    }

    function pause(player, event) {
      track(player, event.action, event.label);
    }

    function ended(player, event) {
      track(player, event.action, event.label);
    }

    function fullscreenchange(player, event) {
      const label = player.isFullscreen() ? event.label.open : event.label.exit;

      track(player, event.action, label);
    }

    function resolutionchange(player, event) {
      let resolution = {
        label: ''
      };

      // It's possible that resolutionchange is used as an event where
      // the video object doesn't have currentResolution
      // so we need to check for it's existance first.
      if (player.currentResolution) {
        resolution = player.currentResolution();
      }
      let label = resolution.label ? resolution.label : 'Default';

      track(player, event.action, label);
    }

    function timeupdate(player, event) {
      let elapsed = Math.round(player.currentTime());
      let duration = Math.round(player.duration());
      let percent = Math.round(elapsed / duration * 100);

      if (!progress.quarter && percent > 25) {
        track(player, event.action, 'Complete 25%');
        progress.quarter = true;
      }

      if (!progress.half && percent > 50) {
        track(player, event.action, 'Complete 50%');
        progress.half = true;
      }

      if (!progress.threeQuarters && percent > 75) {
        track(player, event.action, 'Complete 75%');
        progress.threeQuarters = true;
      }
    }

    function handleEvent(player, event) {
      track(player, event.action, event.label);
    }

    function getEvent(eventName) {
      return options.events.filter(function(event) {
        return event.name === eventName;
      })[0];
    }

    // Set up the custom event tracking that won't use handleEvents

    const eventNames = options.events.map(function(event) {
      return event.name || event;
    });

    if (eventNames.indexOf('play') > -1) {
      const playEvent = getEvent('play');

      this.one('play', function() {
        play(this, playEvent);
      });
      options.events = options.events.filter((event) => {
        return event.name !== 'play';
      });
    }

    if (eventNames.indexOf('pause') > -1) {
      const pauseEvent = getEvent('pause');

      this.one('pause', function() {
        pause(this, pauseEvent);
      });
      options.events = options.events.filter((event) => {
        return event.name !== 'pause';
      });
    }

    if (eventNames.indexOf('ended') > -1) {
      const endedEvent = getEvent('ended');

      this.one('ended', function() {
        ended(this, endedEvent);
      });
      options.events = options.events.filter((event) => {
        return event.name !== 'ended';
      });
    }

    if (eventNames.indexOf('resolutionchange') > -1) {
      const resolutionchangeEvent = getEvent('resolutionchange');

      this.on('resolutionchange', function() {
        resolutionchange(this, resolutionchangeEvent);
      });
      options.events = options.events.filter((event) => {
        return event.name !== 'resolutionchange';
      });
    }

    if (eventNames.indexOf('fullscreenchange') > -1) {
      const fullscreenEvent = getEvent('fullscreenchange');

      this.on('fullscreenchange', function() {
        fullscreenchange(this, fullscreenEvent);
      });
      options.events = options.events.filter((event) => {
        return event.name !== 'fullscreenchange';
      });
    }

    if (eventNames.indexOf('timeupdate') > -1) {
      const timeupdateEvent = getEvent('timeupdate');

      this.on('timeupdate', function() {
        timeupdate(this, timeupdateEvent);
      });
      options.events = options.events.filter((event) => {
        return event.name !== 'timeupdate';
      });
    }

    // For any other event that doesn't require special processing
    // we will use the handleEvent event handler
    for (let event of options.events) {
      this.on(event.name, function() {
        handleEvent(this, event);
      });
    }

  });

};

// Register the plugin with video.js.
videojs.plugin('analytics', analytics);

// Include the version number.
analytics.VERSION = '__VERSION__';

export default analytics;
