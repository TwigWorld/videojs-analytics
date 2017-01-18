import videojs from 'video.js';

// Default options for the plugin.
const defaults = {
  events: [],
  defaultCategoryName: 'Video'
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

    let assetName = this.el().getAttribute('data-asset-name');

    function track(event, category, label) {
      if (!label) {
        label = options.defaultCategoryName;
      }

      if (!category) {
        category = options.defaultCategoryName;
      }
      window.ga('send', 'event', event, category, label);
    }

    function play() {
      track('Start');
      track('Asset name', assetName);
    }

    function fullscreenchange() {
      let status = this.isFullscreen() ? 'Click' : 'Exit';

      track('Fullscreen', status);
    }

    function resolutionchange() {
      let resolution = this.currentResolution();
      let label = resolution.label ? resolution.label : options.defaultCategoryName;

      track('Quality', label);
    }

    function timeupdate() {
      let elapsed = Math.round(this.currentTime());
      let duration = Math.round(this.duration());
      let percent = Math.round(elapsed / duration * 100);

      if (!progress.quarter && percent > 25) {
        track('Percentage', 'Complete 25%');
        progress.quarter = true;
      }

      if (!progress.half && percent > 50) {
        track('Percentage', 'Complete 50%');
        progress.half = true;
      }

      if (!progress.threeQuarters && percent > 75) {
        track('Percentage', 'Complete 75%');
        progress.threeQuarters = true;
      }
    }

    function handleEvent(e) {
      track(e.type);
    }

    // Set up the custom event tracking that won't use handleEvents

    if (options.events.indexOf('play') > -1) {
      this.one('play', play);
      options.events = options.events.filter((event) => {
        return event !== 'play';
      });
    }

    if (options.events.indexOf('play') > -1) {
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
