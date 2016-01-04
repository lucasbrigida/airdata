var express = require('express');
var router = express.Router();
var NAVAids = require('../services/navaids');

// Update NAVAIDS
var CronJob = require('cron').CronJob;
var job = new CronJob('* 7 * * *', function() {
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
    //Allow CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var ns = new NAVAids({
        url: 'http://ourairports.com/data/navaids.csv',
        path: 'public/navaids.csv'
      }),
      processingTime = new Date();

    var curNavaids = function(navaids) {
      console.log(' 📄  ' + navaids.length + ' navaids found');
      res.json({
        navaids: navaids
      });
      console.log(' ⌛  ' + 'The search for navaids spent ' + (new Date() - processingTime) + ' ms');
    };

    ns.get({
      area: req.query.area
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
