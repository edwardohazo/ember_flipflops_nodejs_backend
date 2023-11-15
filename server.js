/* eslint-disable no-unused-vars */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import path from 'path';
import config from './config.js';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouter.js';
// import uploadRouter from './routers/uploadRouter';


// With hardcoded data
// import data from './data.js';
import productRouter from './routers/productRouter.js';


// Conncet MONGO Data Base
mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    // Start using the database here
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Server
const app = express();
app.use(express.json());

// CORS Policy - Allowing Cross Origin Resourse Sharing 
app.use(cors());

// Routers
// app.use('/', (req, res) => {
//   res.send(`<h1>HOLA MUNDO!</h1>`);
// });
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/', (req, res) => {
  res.send(`<h1>HOLA MUNDO!</h1>`);
});
app.get('/api/paypal/clientId', (req, res) => {
  res.send({ clientId: config.PAYPAL_CLIENT_ID });
});

// // SIMULATION OF PRODUCTS DB CALLED data.js
// app.get('/api/products', (req, res)=> {
//     res.status(200).json(data.products);
// });
// app.get('/api/products/:id', (req, res)=> {
//     const product = data.products.find(x => x._id === req.params.id);
//     if (product){
//         res.status(200).json(product);
//     } else  {
//         res.status(404).json({message: "Product Not Found"});
//     }
// });

// Handling all possible errors with express instance in addition to express async handler
app.use(async (err, req, res, next) => {
    const status = await err.name && err.name === 'ValidationError' ? 400 : 500;
    res.status(status).send({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server is listening on port: ${PORT}!`);
});

