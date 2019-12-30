const express = require('express');

const controller = require('../controllers/signup.controller');
const validation = require('../validations/signup.validation');

const route = express.Router();

route.get('/', controller.get);

route.post('/', validation.postSignUp, controller.post);


module.exports = route;