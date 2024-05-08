import express from 'express'
import morgan from 'morgan'
import paymentRoutes from './routes/payment.routes.js'
import dotenv from 'dotenv'

dotenv.config();



const app = express();

// app.use(morgan('dev'));

app.use(paymentRoutes);
app.listen(process.env.PORT || 3000)



console.log('Server on port', process.env.PORT || 3000)