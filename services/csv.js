var DownloadFile = require('./download_file');

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

module.exports = CSV;