/**
 * Created by liron on 9/2/15.
 */

var express = require('express');
var router = express.Router();

function testService(req, res){

    res.send({msg:'hello, you have reached to: ' + req.originalUrl});
}
router.get('/test', testService);

module.exports = router;