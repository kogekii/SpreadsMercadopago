const express = require('express');
const router = express.Router();
const { createOrder, webhook } = require('../controllers/payment.controller');

router.get('/create-order', createOrder);

router.post('/webhook', webhook);

module.exports = router;
