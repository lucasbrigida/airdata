var express = require('express');
var router = express.Router();

var NAVAids = require('../services/navaids');
var ns = new NAVAids({
  url: 'http://ourairports.com/data/navaids.csv',
  path: 'public/navaids.csv'
});
ns.update('public/navaids.csv', function() {
  console.log(' ✈  ' + ' Navaids updated');
});

// Update NAVAIDS
var CronJob = require('cron').CronJob;
var job = new CronJob('* 7 * * *', function() {
  var NAVAids = require('../services/navaids');
  var ns = new NAVAids({
    url: 'http://ourairports.com/data/navaids.csv',
    path: 'public/navaids.csv'
  });
  ns.update('public/navaids.csv', function() {
    console.log(' ✈  ' + ' Navaids updated');
  });
}, null, true, 'America/Sao_Paulo');

/* GET NAVAIDS */
router.get('/', function(req, res, next) {
  (function() {
    var ns = new NAVAids({
      url: 'http://ourairports.com/data/navaids.csv',
      path: 'public/navaids.csv'
    });

    var curNavaids = function(navaids) {
      console.log(' 📄  ' + navaids.length + ' navaids found');
      res.json(navaids);
    };

    var area = [{
      latitude: -21.46418923528391, //nw
      longitude: -48.500632324218714
    }, {
      latitude: -21.46418923528391, //ne
      longitude: -41.079367675781214
    }, {
      latitude: -23.428852054291365, //se
      longitude: -41.079367675781214
    }, {
      latitude: -23.428852054291365, //sw
      longitude: -48.500632324218714
    }];

    ns.get({
      area: req.query.area || area
    }, curNavaids);

    //var csv = new CSV();
    /*csv.get('http://ourairports.com/data/navaids.csv', 'string', function(err, csvStr) {
      console.log(csvStr.length);
    })*/
    //csv.save('http://ourairports.com/data/navaids.csv', 'public/testt.csv', function() {});
    //csv.getFromFile('public/testt.csv', function(csvbObj) {});
  })();
});

module.exports = router;
