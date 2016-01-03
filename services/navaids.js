var CSV = require('./csv');

var NAVAids = function(options) {
  if (!options) throw new Error('options is not defined');

  var geolib = require('geolib');
  var colors = require('colors');
  var csv = new CSV();

  var filter = function(csvObj, query) {
    console.log(' 🔍  ' + 'Filtering navaids');
    return csvObj.filter(function(navaid) {
      var point = {
        latitude: navaid.latitude_deg,
        longitude: navaid.longitude_deg
      };
      if (geolib.isPointInside(point, query.area)) return navaid;
    });
  };

  var get = function(query, cb) {
    if (!cb) throw new Error('cb is not defined');
    console.log(' 🚩  ' + 'Getting navaids');
    csv.getFromFile(options.path, function(csvObj) {
      if ((!query) || (query === null)) return cb(csvObj);
      return cb(filter(csvObj, query));
    });
  };

  var update = function(path, cb) {
    if (!(path || options.path)) throw new Error('path is not defined');
    csv.save(options.url, options.path, function() {
      if (cb) return cb();
    });
  };

  return {
    get: get,
    update: update
  };
};

module.exports = NAVAids;