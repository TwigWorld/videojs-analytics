const generate = require('videojs-generate-karma-config');

module.exports = function(config) {

  // see https://github.com/videojs/videojs-generate-karma-config
  // for options
  const options = {
    // Only run in ChromeHeadless so Safari / Firefox aren't auto-launched
    // by karma-detect-browsers on developer machines.
    browsers: () => ['ChromeHeadless']
  };

  config = generate(config, options);

  // any other custom stuff not supported by options here!
};
