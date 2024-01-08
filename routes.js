const express = require('express');
const router = express.Router();
const controller = require('./middlewares');


router.post('/fairplay', controller.fairplay);
router.post('/widevine/:id', controller.setTokenHeader, controller.widevine);
router.post('/playready', controller.playready);
module.exports = router;