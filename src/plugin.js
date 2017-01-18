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

    function pause() {
      track('Pause');
    }

    function ended() {
      track('Finish');
    }

    function volumechange() {
      track('Volume change');
    }

    function resize() {
      track('Resize');
    }

    function error() {
      track('Error');
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

    if (options.events.indexOf('play') > -1) {
      this.one('play', play);
    }
    if (options.events.indexOf('pause') > -1) {
      this.on('pause', pause);
    }
    if (options.events.indexOf('volumechange') > -1) {
      this.on('volumechange', volumechange);
    }
    if (options.events.indexOf('resize') > -1) {
      this.on('resize', resize);
    }
    if (options.events.indexOf('error') > -1) {
      this.on('error', error);
    }
    if (options.events.indexOf('ended') > -1) {
      this.on('ended', ended);
    }
    if (options.events.indexOf('resize') > -1) {
      this.on('resize', fullscreenchange);
    }
    if (options.events.indexOf('resolutionchange') > -1) {
      this.on('resolutionchange', resolutionchange);
    }
    if (options.events.indexOf('timeupdate') > -1) {
      this.on('timeupdate', timeupdate);
    }

  });

};

// Register the plugin with video.js.
videojs.plugin('analytics', analytics);

// Include the version number.
analytics.VERSION = '__VERSION__';

export default analytics;
