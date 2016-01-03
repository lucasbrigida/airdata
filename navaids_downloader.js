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


var CSV = function() {
  var fs = require('fs');
  var colors = require('colors');
  var CSVConverter = require("csvtojson").Converter;

  var get = function(url, encoding, cb) {
    if (!(url && cb && encoding)) throw new Error('url or cb or encoding is not defined');

    if (encoding === 'raw') {
      return cb(new DownloadFile(url).stream);
    }

    if (encoding === 'json') {
      var converter = new CSVConverter();

      converter.on("end_parsed", function(jsonObj) {
        return cb(jsonObj);
      });
      new DownloadFile(url).stream.pipe(converter);
    }

    if (encoding === 'string') {
      new DownloadFile(url, cb, {
        encoding: 'utf8'
      });
    }
  };

  var save = function(url, path, cb) {
    if (!(url && path)) throw new Error('url and path is not defined');
    get(url, 'raw', function(stream) {
      var st = stream.pipe(fs.createWriteStream(path));
      st.on('finish', function() {
        st.end();
        setTimeout(function() {
          console.log(' 💾  ' + (path + ' saved!').blue);
        }, 300);
        if (cb) return cb(st);
      });
    });
  };

  var getFromFile = function(path, cb) {
    if (!(path && cb)) throw new Error('path and cb is not defined');
    var converter = new CSVConverter();
    var conversionTime = new Date();

    converter.on("end_parsed", function(jsonObj) {
      console.log(' 🕒  ' + 'Conversion time: ' + (new Date() - conversionTime) + ' ms');
      return cb(jsonObj);
    });

    console.log(' 🔨  Decoding ' + path + ' to JSON');
    fs.createReadStream(path).pipe(converter);
  };

  return {
    get: get,
    save: save,
    getFromFile: getFromFile
  };
};

//http://ourairports.com/data/navaids.csv
(function() {
  var csv = new CSV();
  /*csv.get('http://ourairports.com/data/navaids.csv', 'string', function(err, csvStr) {
    console.log(csvStr.length);
  })*/
  //csv.save('http://ourairports.com/data/navaids.csv', 'public/testt.csv', function() {});
  csv.getFromFile('public/testt.csv', function(csvbObj) {});
})();
