var express = require('express');

var validate = require('../validations/signin.validation');
var controller = require('../controllers/signin.controller');


const route = express.Router();

route.get('/', controller.get);

route.post('/', validate.postSignIn ,controller.post);

route.get('/logout', controller.getlogout);

route.get('/confirm', validate.getCookieRole, controller.confirm);

route.get('/:id', validate.getCookieRole, controller.confirmId);

module.exports = route;