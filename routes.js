const express = require('express');
const router = express.Router();
const controller = require('./controller');


router.post('/fairplay', controller.fairplay);
router.post('/widevine/:id', controller.widevine);
router.post('/playready', controller.playready);
module.exports = router;