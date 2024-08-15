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


const allowedOrigins = ['https://mahaveer-e-commerce.netlify.app','https://mahaveer-e-commerce.netlify.app/','https://mahaveer-e-commerce.netlify.app/*', 'http://localhost:5173/', 'https://localhost:3000/'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});


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
