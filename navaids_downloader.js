var request = require('request');
var fs = require('fs');
var progress = require('request-progress');
var ProgressBar = require('progress');

(function() {
  var source = 'http://ourairports.com/data/';
  var filename = 'navaids.csv';

  var bar = null , totalReceived = 0;

  var downloadStatus = function(state) {
    if (bar === null) {
      bar = new ProgressBar('  downloading ' + filename + ' [:bar] :percent :etas', {
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
    console.err(err);
  };

  progress(request(source + filename))
    .on('progress', downloadStatus)
    .on('error', downloadError)
    .pipe(fs.createWriteStream('public/' + filename));
})();
