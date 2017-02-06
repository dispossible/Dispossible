var express = require('express');
var router = express.Router();

const siteName = "Dispossible";
const suffix = " - " + siteName;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: siteName,
        page: 'home',
        pageInfo: {}
    });
});

module.exports = router;
