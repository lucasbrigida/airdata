var DownloadNotification = function(options) {
  var ProgressBar = require('progress');
  var colors = require('colors');

  var bar = null,
    totalReceived = 0;

  var downloadStatus = function(state) {
    if (bar === null) {
      bar = new ProgressBar(' 🌎  ' + 'Downloading '.cyan + options.from + ' [:bar] :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: state.total
      });
    }

    bar.tick(state.received - totalReceived);
    totalReceived = state.received;
  };

  var downloadError = function(err) {
    console.err(' ✘ Error'.red + err);
  };

  var downloadComplete = function() {
    console.log(' ✓ Completed'.green);
  };

  return {
    progress: downloadStatus,
    error: downloadError,
    complete: downloadComplete
  };
};

module.exports = DownloadNotification;