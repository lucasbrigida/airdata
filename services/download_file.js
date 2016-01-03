var DownloadNotification = require('./download_notification');

var DownloadFile = function(url, cb, opt) {
  if (!url) throw new Error('url is not defined');

  var options = opt || {};

  var request = require('request');
  var fs = require('fs');
  var progress = require('request-progress');

  var notifier = new DownloadNotification({
    from: url
  });
  var _csv = '';

  var get = function() {
    return _csv;
  };

  var save = function(chunck) {
    _csv += chunck;
  };

  var complete = function(state) {
    notifier.complete(state);
    if (cb) return cb(null, get());
  };

  var error = function(err) {
    notifier.error(err);
    if (cb) return cb(err, null);
  };

  var stream = progress(request({
      url: url,
      encoding: options.encoding || null
    }))
    .on('progress', notifier.progress)
    .on('error', error)
    .on('complete', complete)
    .on('data', save);

  return {
    get: get,
    stream: stream
  };
};

module.exports = DownloadFile;