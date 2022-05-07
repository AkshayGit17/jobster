require('express-async-errors');
require('dotenv').config();

const express = require('express');
const app = express();

const morgan = require('morgan');

//connect to DB
const connectDB = require('./db/connect');

const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');

app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.send('<h1>Jobster website</h1>');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
