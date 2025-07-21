const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');
const Review = require('./models/reviewModel');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! SHUTTING DOWN....');
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB).then(() => {
  console.log('mongodb is connected');
});

Review.syncIndexes(); // this forces index sync
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`server is running on port no : ${PORT} `);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION SHUTTING DOWN....');
  server.close(() => {
    process.exit(1);
  });
});
