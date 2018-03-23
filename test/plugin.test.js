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
    sinon.stub(window, 'gtag');
  },

  afterEach() {
    this.player.dispose();
    this.clock.restore();
    window.ga.restore();
    window.gtag.restore();
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
  assert.expect(5);

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

  assert.ok(
    window.gtag.notCalled,
    'gtag should not have been called'
  );
});

QUnit.test('the pause event calls ga', function(assert) {
  assert.expect(4);

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

  assert.ok(
    window.gtag.notCalled,
    'gtag should not have been called'
  );
});

QUnit.test('the ended event calls ga', function(assert) {
  assert.expect(4);

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

  assert.ok(
    window.gtag.notCalled,
    'gtag should not have been called'
  );
});

QUnit.test('custom events should call ga', function(assert) {

  assert.expect(4);

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

  assert.ok(
    window.gtag.notCalled,
    'gtag should not have been called'
  );
});

QUnit.test('fullscreenchange events should call ga', function(assert) {
  assert.expect(4);

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

  assert.ok(
    window.gtag.notCalled,
    'gtag should not have been called'
  );
});

QUnit.test('resolutionchange should call ga', function(assert) {
  assert.expect(4);

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

  assert.ok(
    window.gtag.notCalled,
    'gtag should not have been called'
  );
});

QUnit.test(`timeupdate should call ga when
  player is more than quater way through`, function(assert) {
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

  assert.ok(
    window.gtag.notCalled,
    'gtag should not have been called'
  );
});

QUnit.test(`timeupdate should call ga when
  player is more than half way through`, function(assert) {
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

  assert.ok(
    window.gtag.notCalled,
    'gtag should not have been called'
  );
});

QUnit.test('timeupdate should call ga when player is complete', function(assert) {
  assert.expect(6);

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

  assert.ok(
    window.gtag.notCalled,
    'gtag should not have been called'
  );
});

QUnit.test('Gtags: the play event calls gtags with correct event', function(assert) {
  assert.expect(5);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
    events: [
      {
        name: 'play',
        label: 'video play',
        action: 'play'
      }
    ],
    assetName: 'Test video'
  });

  this.clock.tick(1);

  this.player.trigger('play');
  assert.ok(
    /* eslint camelcase: 0 */
    window.gtag.calledWith('event', 'play',
      {
        event_category: 'Video',
        event_label: 'video play',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
      'gtag should have been called with video play event'
  );

  assert.ok(
    window.gtag.calledWith('event', 'Asset name',
      {
        event_category: 'Video',
        event_label: 'Test video',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
      'gtag should have been called with asset name'
  );

  assert.ok(
    window.gtag.calledTwice
  );

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test('Gtags: the play event does not call ga', function(assert) {
  assert.expect(2);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
    events: [
      {
        name: 'play',
        label: 'video play',
        action: 'play'
      }
    ],
    assetName: 'Test video'
  });

  this.clock.tick(1);

  this.player.trigger('play');

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test('the pause event calls gtag', function(assert) {
  assert.expect(4);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
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
    /* eslint camelcase: 0 */
    window.gtag.calledWith('event', 'pause',
      {
        event_category: 'Video',
        event_label: 'video pause',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called with the pause event'
  );

  assert.ok(
    window.gtag.calledOnce,
    'gtag should have been called once'
  );

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test('the ended event calls gtag', function(assert) {
  assert.expect(4);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
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
    window.gtag.calledWith('event', 'ended',
      {
        event_category: 'Video',
        event_label: 'video ended',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called with the ended event'
  );

  assert.ok(
    window.gtag.calledOnce,
    'gtag should have been called once'
  );

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test('custom events should call gtag', function(assert) {

  assert.expect(4);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
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
    window.gtag.calledWith('event', 'custom event action',
      {
        event_category: 'Video',
        event_label: 'custom event',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called with the customevent event'
  );

  assert.ok(
    window.gtag.calledOnce,
    'gtag should have been called once'
  );

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test('fullscreenchange events should call gtag', function(assert) {
  assert.expect(4);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  // Tick the clock forward enough to trigger the player to be "ready".
  this.clock.tick(1);

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
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
    window.gtag.calledWith('event', 'fullscreen change',
      {
        event_category: 'Video',
        event_label: 'video fullscreen exit',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }
    ),
    'gtag should have been called with the fullscreen change event'
  );

  assert.ok(
    window.gtag.calledOnce,
    'gtag should have been called once'
  );

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test('resolutionchange should call gtag', function(assert) {
  assert.expect(4);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
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
    window.gtag.calledWith('event', 'resolution change',
      {
        event_category: 'Video',
        event_label: 'Default',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called with the resolutionchange event'
  );

  assert.ok(
    window.gtag.calledOnce,
    'gtag should have been called once'
  );

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test(`timeupdate should call gtag when
  player is more than quater way through`, function(assert) {
  assert.expect(4);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
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
    window.gtag.calledWith('event', 'time updated',
      {
        event_category: 'Video',
        event_label: 'Complete 25%',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called for 25% with the timeupdate event'
  );

  assert.ok(
    window.gtag.calledOnce,
    'gtag should have been called twice'
  );

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test(`timeupdate should call gtag when
  player is more than half way through`, function(assert) {
  assert.expect(5);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
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
    window.gtag.calledWith('event', 'time updated',
      {
        event_category: 'Video',
        event_label: 'Complete 25%',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called for 25% with the timeupdate event'
  );

  assert.ok(
    window.gtag.calledWith('event', 'time updated',
      {
        event_category: 'Video',
        event_label: 'Complete 50%',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called for 50% with the timeupdate event'
  );

  assert.ok(
    window.gtag.calledTwice,
    'gtag should have been called twice'
  );

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test('timeupdate should call gtag when player is complete', function(assert) {
  assert.expect(6);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
    customDimensions: {
      accessLevel: 'DEBUG',
      uuid: '12345'
    },
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
    window.gtag.calledWith('event', 'time updated',
      {
        event_category: 'Video',
        event_label: 'Complete 25%',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called for 25% with the timeupdate event'
  );

  assert.ok(
    window.gtag.calledWith('event', 'time updated',
      {
        event_category: 'Video',
        event_label: 'Complete 50%',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called for 50% with the timeupdate event'
  );

  assert.ok(
    window.gtag.calledWith('event', 'time updated',
      {
        event_category: 'Video',
        event_label: 'Complete 75%',
        customDimensions: {
          accessLevel: 'DEBUG',
          uuid: '12345'
        }
      }),
    'gtag should have been called for 75% with the timeupdate event'
  );

  assert.ok(
    window.gtag.calledThrice,
    'ga should have been called three times'
  );

  assert.ok(
    window.ga.notCalled
  );
});

QUnit.test('using no custom dimensions should call gtag', function(assert) {
  assert.expect(4);

  assert.strictEqual(
    Player.prototype.analytics,
    plugin,
    'videojs-analytics plugin was registered'
  );

  this.player.analytics({
    mode: 'GTAG',
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
    /* eslint camelcase: 0 */
    window.gtag.calledWith('event', 'pause',
      {
        event_category: 'Video',
        event_label: 'video pause',
        customDimensions: { }
      }),
    'gtag should have been called with the pause event'
  );

  assert.ok(
    window.gtag.calledOnce,
    'gtag should have been called once'
  );

  assert.ok(
    window.ga.notCalled
  );
});
