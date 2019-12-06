const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './.env' });

const DB =
  process.env.USE_DB === 'remote'
    ? process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
    : process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() =>
    console.log(
      '\x1b[43m\x1b[31m\x1b[1m%s\x1b[0m',
      ' DB connection successful! '
    )
  );

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const toursWithGuide = tours.map(t => {
  return {
    ...t,
    guides: ['5dd72e6110569e1692a4d610']
  };
});

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data sucessfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteAndImportData = async () => {
  try {
    console.log('Deleting all tours...');
    await Tour.deleteMany();
    console.log('All tours deleted.');
    console.log('Uploading starter tours...');
    await Tour.create(toursWithGuide);
    console.log('Starter tours uploaded.');

    /*
    // If you wanna reset all users, uncomment this below.
    // For this to work you also need to comment out all the
    // userSchema.pre('save') hooks in order for passwords to 
    // not be encrypted, because they already are encrypted in json file
    console.log('Deleting all users...');
    await User.deleteMany();
    console.log('All users deleted.');
    console.log('Uploading starter users...');
    await User.create(users, { validateBeforeSave: false });
    console.log('Starter users uploaded.');
    */

    console.log('Deleting all reviews...');
    await Review.deleteMany();
    console.log('All reviews deleted.');
    console.log('Uploading starter reviews...');
    await Review.create(reviews);
    console.log('Starter reviews uploaded.');

    console.log('Data successfully deleted and imported!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

switch (process.argv[2]) {
  case '--import':
    return importData();
  case '--delete':
    return deleteData();
  case '--delete-and-import':
    return deleteAndImportData();
  default:
    break;
}
