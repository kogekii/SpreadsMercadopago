const express = require('express');
const router = express.Router();
const { createAnual } = require('../controllers/createAnual');
const { createMensual } = require('../controllers/createMensual');
const { webhook } = require('../controllers/webhook');

router.get('/create-mensual/:email/:months', createMensual);
router.get('/create-anual', createAnual);
router.post('/webhook', webhook);

module.exports = router;
