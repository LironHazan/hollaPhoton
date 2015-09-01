/**
 * Created by liron on 9/2/15.
 */

var express = require('express');
var router = express.Router();

router.get('/led', function(req, res, next) {
    res.status(200).send({msg:'hello'});
});

module.exports = router;