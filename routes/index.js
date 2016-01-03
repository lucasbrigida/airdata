var express = require('express');
var router = express.Router();
var NAVAids = require('../services/navaids');

/* GET home page. */
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

    ns.get({
      area: [{
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
      }]
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
