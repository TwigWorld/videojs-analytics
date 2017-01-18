/**
 * videojs-analytics
 * @version 0.1.0
 * @copyright 2017 Adam Oliver <mail@adamoliver.net>
 * @license MIT
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsAnalytics = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var _video = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _video2 = _interopRequireDefault(_video);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Default options for the plugin.
var defaults = {
  events: [],
  assetName: 'Video',
  defaultCategoryName: 'Video'
};

window.ga = window.ga || function () {
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
var analytics = function analytics(options) {
  var _this = this;

  options = _video2.default.mergeOptions(defaults, options);

  this.ready(function () {

    var progress = {
      quarter: false,
      half: false,
      threeQuarters: false
    };

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
      track('Asset name', options.assetName);
    }

    function fullscreenchange() {
      var status = !this.isFullscreen() ? 'Click' : 'Exit';

      track('Fullscreen', status);
    }

    function resolutionchange() {
      var resolution = {
        label: ''
      };

      // It's possible that resolutionchange is used as an event where
      // the video object doesn't have currentResolution
      // so we need to check for it's existance first.
      if (this.currentResolution) {
        resolution = this.currentResolution();
      }
      var label = resolution.label ? resolution.label : options.defaultCategoryName;

      track('Quality', label);
    }

    function timeupdate() {
      var elapsed = Math.round(this.currentTime());
      var duration = Math.round(this.duration());
      var percent = Math.round(elapsed / duration * 100);

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
      _this.one('play', play);
      options.events = options.events.filter(function (event) {
        return event !== 'play';
      });
    }

    if (options.events.indexOf('resolutionchange') > -1) {
      _this.on('resolutionchange', resolutionchange);
      options.events = options.events.filter(function (event) {
        return event !== 'resolutionchange';
      });
    }

    if (options.events.indexOf('fullscreenchange') > -1) {
      _this.on('fullscreenchange', fullscreenchange);
      options.events = options.events.filter(function (event) {
        return event !== 'fullscreenchange';
      });
    }

    if (options.events.indexOf('timeupdate') > -1) {
      _this.on('timeupdate', timeupdate);
      options.events = options.events.filter(function (event) {
        return event !== 'timeupdate';
      });
    }

    // For any other event that doesn't require special processing
    // we will use the handleEvent event handler

    for (var _iterator = options.events, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var event = _ref;

      _this.on(event, handleEvent);
    }
  });
};

// Register the plugin with video.js.
_video2.default.plugin('analytics', analytics);

// Include the version number.
analytics.VERSION = '0.1.0';

exports.default = analytics;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});