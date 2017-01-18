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
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
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
      'play'
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  sinon.stub(window, 'ga');

  this.player.trigger('play');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Start', 'Video', 'Video'),
    'ga should have been called with the start event'
  );

  assert.ok(
    window.ga.calledWith('send', 'event', 'Asset name', 'Test video'),
    'ga should have been called with the asset name event'
  );

  assert.ok(
    window.ga.calledTwice,
    'ga should have been called twice'
  );

  window.ga.restore();
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
      'customevent'
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  sinon.stub(window, 'ga');

  this.player.trigger('customevent');

  assert.ok(
    window.ga.calledWith('send', 'event', 'customevent', 'Video', 'Video'),
    'ga should have been called with the customevent event'
  );

  assert.ok(
    window.ga.calledOnce,
    'ga should have been called once'
  );

  window.ga.restore();
});

QUnit.test('fullscreenchange events should call ga', function(assert) {
  assert.expect(3);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    events: [
      'fullscreenchange'
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  sinon.stub(window, 'ga');

  this.player.trigger('fullscreenchange');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Fullscreen', 'Click', 'Video'),
    'ga should have been called with the customevent event'
  );

  assert.ok(
    window.ga.calledOnce,
    'ga should have been called once'
  );

  window.ga.restore();
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
      'resolutionchange'
    ],
    assetName: 'Test video'
  });

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  sinon.stub(window, 'ga');

  this.player.trigger('resolutionchange');

  assert.ok(
    window.ga.calledWith('send', 'event', 'Quality', 'Video', 'Video'),
    'ga should have been called with the resolutionchange event'
  );

  assert.ok(
    window.ga.calledOnce,
    'ga should have been called once'
  );

  window.ga.restore();
});
