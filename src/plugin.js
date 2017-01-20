import videojs from 'video.js';

// Default options for the plugin.
const defaults = {
  events: [],
  assetName: 'Video',
  defaultVideoCategory: 'Video',
  defaultAudioCategory: 'Audio'
};

window.ga = window.ga || function() {
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

      if (player.isAudio()) {
        category = options.defaultAudioCategory;
      }

      if (!label) {
        label = '';
      }

      window.ga('send', 'event', category, action, label);
    }

    function play() {
      track(this, 'General', 'Start');
      track(this, 'Asset name', options.assetName);
    }

    function pause() {
      track(this, 'General', 'Pause');
    }

    function ended() {
      track(this, 'General', 'Finish');
    }

    function fullscreenchange() {
      let status = this.isFullscreen() ? 'Click' : 'Exit';

      track(this, 'Fullscreen', status);
    }

    function resolutionchange() {
      let resolution = {
        label: ''
      };

      // It's possible that resolutionchange is used as an event where
      // the video object doesn't have currentResolution
      // so we need to check for it's existance first.
      if (this.currentResolution) {
        resolution = this.currentResolution();
      }
      let label = resolution.label ? resolution.label : 'Default';

      track(this, 'Quality', label);
    }

    function timeupdate() {
      let elapsed = Math.round(this.currentTime());
      let duration = Math.round(this.duration());
      let percent = Math.round(elapsed / duration * 100);

      if (!progress.quarter && percent > 25) {
        track(this, 'Percentage', 'Complete 25%');
        progress.quarter = true;
      }

      if (!progress.half && percent > 50) {
        track(this, 'Percentage', 'Complete 50%');
        progress.half = true;
      }

      if (!progress.threeQuarters && percent > 75) {
        track(this, 'Percentage', 'Complete 75%');
        progress.threeQuarters = true;
      }
    }

    function handleEvent(e) {
      let uppercaseFirstChar = e.type.charAt(0).toUpperCase() + e.type.slice(1);

      track(this, uppercaseFirstChar);
    }

    // Set up the custom event tracking that won't use handleEvents

    if (options.events.indexOf('play') > -1) {
      this.one('play', play);
      options.events = options.events.filter((event) => {
        return event !== 'play';
      });
    }

    if (options.events.indexOf('pause') > -1) {
      this.one('pause', pause);
      options.events = options.events.filter((event) => {
        return event !== 'pause';
      });
    }

    if (options.events.indexOf('ended') > -1) {
      this.one('ended', ended);
      options.events = options.events.filter((event) => {
        return event !== 'ended';
      });
    }

    if (options.events.indexOf('resolutionchange') > -1) {
      this.on('resolutionchange', resolutionchange);
      options.events = options.events.filter((event) => {
        return event !== 'resolutionchange';
      });
    }

    if (options.events.indexOf('fullscreenchange') > -1) {
      this.on('fullscreenchange', fullscreenchange);
      options.events = options.events.filter((event) => {
        return event !== 'fullscreenchange';
      });
    }

    if (options.events.indexOf('timeupdate') > -1) {
      this.on('timeupdate', timeupdate);
      options.events = options.events.filter((event) => {
        return event !== 'timeupdate';
      });
    }

    // For any other event that doesn't require special processing
    // we will use the handleEvent event handler

    for (let event of options.events) {
      this.on(event, handleEvent);
    }

  });

};

// Register the plugin with video.js.
videojs.plugin('analytics', analytics);

// Include the version number.
analytics.VERSION = '__VERSION__';

export default analytics;
