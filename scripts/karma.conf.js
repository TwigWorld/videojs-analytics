const generate = require('videojs-generate-karma-config');

module.exports = function(config) {

  // see https://github.com/videojs/videojs-generate-karma-config
  // for options
  const options = {
    // Only run in ChromeHeadlessNoSandbox so Safari / Firefox aren't
    // auto-launched by karma-detect-browsers on developer machines, and
    // Chrome launches cleanly inside the CI container (which runs as root).
    browsers: () => ['ChromeHeadlessNoSandbox']
  };

  config = generate(config, options);

  config.set({
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    }
  });
};
