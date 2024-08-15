import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import apiRoutes from './src/routes/routes.js'; 
import { mongoURI } from './src/utils/constant.js';
import { decryptRequest, encryptResponse } from './src/middleware/middleware.js';
import Stripe from 'stripe';

const stripe = new Stripe('your-stripe-secret-key');

const app = express();
app.use(express.json());
app.use(encryptResponse);
app.use(decryptRequest);


app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(cookieParser());

app.use('/', apiRoutes);

mongoose.connect(mongoURI)
  .then(() => {
    app.listen(5000, '0.0.0.0',() => {
      console.log('Server is running on port http://localhost:5000');
    });
  })
  .catch(error => {
    console.error('Database connection error:', error);
  });
