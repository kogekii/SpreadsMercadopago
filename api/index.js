
const paymentRoutes = require('./routes/payment.routes');
const dotenv = require('dotenv');
const express = require("express");

dotenv.config();

const app = express();

app.use(paymentRoutes);

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(process.env.PORT || 3001, () => console.log("Server ready on port 3000."));

module.exports = app;