var express = require('express');

const route = express.Router();

route.get('/', function (req, res, next) {
    const doccument = {
        title: 'Liên hệ',
    };
    res.render('contact', doccument);
});

module.exports = route;