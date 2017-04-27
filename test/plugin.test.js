import document from 'global/document';

import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';

import plugin from '../src/plugin';

const Player = videojs.getComponent('Player');

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.module('videojs-analytics', {

  beforeEach() {

    // Mock the environment's timers because certain things - particularly
    // player readiness - are asynchronous in video.js 5. This MUST come
    // before any player is created; otherwise, timers could get created
    // with the actual timer methods!
    this.clock = sinon.useFakeTimers();

    this.fixture = document.getElementById('qunit-fixture');
    this.video = document.createElement('video');
    this.fixture.appendChild(this.video);
    this.player = videojs(this.video);
    sinon.stub(window, 'ga');
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
    window.ga.restore();
  }
});

QUnit.test('registers itself with video.js', function(assert) {
  assert.expect(1);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics();

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);
});

QUnit.test('the play event calls ga', function(assert) {
  assert.expect(4);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    events: [
      {
        name: 'play',
        label: 'video play',
        action: 'play'
      }
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.trigger('play');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'play', 'video play'),
    'ga should have been called with the play event'
  );

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'Asset name', 'Test video'),
    'ga should have been called with the asset name event'
  );

  assert.ok(
    window.ga.calledTwice,
    'ga should have been called twice'
  );
});

QUnit.test('the pause event calls ga', function(assert) {
  assert.expect(3);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    events: [
      {
        name: 'pause',
        label: 'video pause',
        action: 'pause'
      }
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.trigger('pause');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'pause', 'video pause'),
    'ga should have been called with the pause event'
  );

  assert.ok(
    window.ga.calledOnce,
    'ga should have been called once'
  );
});

QUnit.test('the ended event calls ga', function(assert) {
  assert.expect(3);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    events: [
      {
        name: 'ended',
        label: 'video ended',
        action: 'ended'
      }
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.trigger('ended');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'ended', 'video ended'),
    'ga should have been called with the ended event'
  );

  assert.ok(
    window.ga.calledOnce,
    'ga should have been called once'
  );
});

QUnit.test('custom events should call ga', function(assert) {

  assert.expect(3);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    events: [
      {
        name: 'customevent',
        label: 'custom event',
        action: 'custom event action'
      }
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.trigger('customevent');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'custom event action', 'custom event'),
    'ga should have been called with the customevent event'
  );

  assert.ok(
    window.ga.calledOnce,
    'ga should have been called once'
  );
});

QUnit.test('fullscreenchange events should call ga', function(assert) {
  assert.expect(3);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.analytics({
    events: [
      {
        name: 'fullscreenchange',
        label: {
          open: 'video fullscreen open',
          exit: 'video fullscreen exit'
        },
        action: 'fullscreen change'
      }
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.trigger('fullscreenchange');

  assert.ok(
    window.ga.calledWith(
      'send',
      'event',
      'Video',
      'fullscreen change',
      'video fullscreen exit'
    ),
    'ga should have been called with the fullscreen change event'
  );

  assert.ok(
    window.ga.calledOnce,
    'ga should have been called once'
  );
});

QUnit.test('resolutionchange should call ga', function(assert) {
  assert.expect(3);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    events: [
      {
        name: 'resolutionchange',
        action: 'resolution change'
      }
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.trigger('resolutionchange');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'resolution change', 'Default'),
    'ga should have been called with the resolutionchange event'
  );

  assert.ok(
    window.ga.calledOnce,
    'ga should have been called once'
  );
});

QUnit.test(`timeupdate should call ga when
  player is more than quater way through`, function(assert) {
  assert.expect(3);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    events: [
      {
        name: 'timeupdate',
        action: 'time updated'
      }
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.duration = function() {
    return 100;
  };
  this.player.currentTime = function() {
    return 26;
  };

  this.player.trigger('timeupdate');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'time updated', 'Complete 25%'),
    'ga should have been called for 25% with the timeupdate event'
  );

  assert.ok(
    window.ga.calledOnce,
    'ga should have been called twice'
  );
});

QUnit.test(`timeupdate should call ga when
  player is more than half way through`, function(assert) {
  assert.expect(4);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    events: [
      {
        name: 'timeupdate',
        action: 'time updated'
      }
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.duration = function() {
    return 100;
  };
  this.player.currentTime = function() {
    return 55;
  };
  this.player.trigger('timeupdate');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'time updated', 'Complete 25%'),
    'ga should have been called for 25% with the timeupdate event'
  );

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'time updated', 'Complete 50%'),
    'ga should have been called for 50% with the timeupdate event'
  );

  assert.ok(
    window.ga.calledTwice,
    'ga should have been called twice'
  );
});

QUnit.test('timeupdate should call ga when player is complete', function(assert) {
  assert.expect(5);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    events: [
      {
        name: 'timeupdate',
        action: 'time updated'
      }
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.duration = function() {
    return 100;
  };
  this.player.currentTime = function() {
    return 100;
  };
  this.player.trigger('timeupdate');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'time updated', 'Complete 25%'),
    'ga should have been called for 25% with the timeupdate event'
  );

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'time updated', 'Complete 50%'),
    'ga should have been called for 50% with the timeupdate event'
  );

  assert.ok(
    window.ga.calledWith('send', 'event', 'Video', 'time updated', 'Complete 75%'),
    'ga should have been called for 75% with the timeupdate event'
  );

  assert.ok(
    window.ga.calledThrice,
    'ga should have been called three times'
  );
});
