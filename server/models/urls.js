
const mongoose = require('mongoose');

// the redirect schema, this will store each redirect information
// like the browser, ip, location, and time
const redirectSchema = new mongoose.Schema({
  redirectTime: Date,
  userAgent: String
});

const RedirectModel = mongoose.model('redirects', redirectSchema);

// creating a new schema
const urlSchema = new mongoose.Schema({
  longURL: {
    type: String,
    required: true
  }, shortCode: {
    type: String,
    required: true,
    unique: true
  }, redirects: [redirectSchema]
});

urlSchema.statics.connectDB = async () => {
  const URI = process.env.DB_URI;

  try {
    mongoose.connect(URI);
    console.log('Database connection established successfully');
  } catch (e) {
    console.error('Unable to establish connection with the database');
  }

  process.on('SIGINT', () => {
    console.log('Closing the database connection...');
    mongoose.connection.close();
    process.exit(0);
  })
}

urlSchema.statics.shorten = async function (longURL) {
  // saving the new document
  // TODO: create a new short code and assign

  // generating unique code
  const genShortCode = (length) => {
    // this will generate a unique random string as the shortCode
    const lowerAlpha = 'abcdefghijklmnopqrstuvwxyz';
    const upperAlpha = lowerAlpha.toUpperCase();
    const nums = '0123456789';

    const total = lowerAlpha + upperAlpha + nums;

    // RULE 1: the first char should not be a number
    let code = lowerAlpha.at(Math.floor(Math.random() * 100) % 52);

    for (let i = 0; i < length - 1; i++)
      code += total.at(Math.floor(Math.random() * 100) % total.length);

    return code;
  }

  // FIXME: check if the shortCode is taken or free to use
  if (await this.findOne({ shortCode: { $eq: shortCode } }))
    // there exists something with this shortCode then reply with error
    throw Error('shortCode already taken');

  await this.create({ longURL: longURL, shortCode: genShortCode() });
}

urlSchema.statics.shorten = async function (longURL, shortCode) {
  // FIXME: check if the shortCode is taken or free to use
  if (await this.findOne({ shortCode: { $eq: shortCode } }))
    // there exists something with this shortCode then reply with error
    throw Error('shortCode already taken');

  this.create({ longURL, shortCode, count: 0 });
}

urlSchema.statics.redirect = async function (shortCode, userAgent) {

  // first check if the url exists or not
  const urlDoc = await this.findOne({
    shortCode: { $eq: shortCode }
  });
  if (urlDoc) {
    const redirect = await RedirectModel.create({ redirectTime: Date.now(), userAgent });
    urlDoc.redirects.push(redirect);
    urlDoc.save();
    return urlDoc;
  }
  // else
  throw new Error('No such shortCode found');
}


// ERROR: developer use only!!!
urlSchema.statics.cleanDocs = async function () {
}


module.exports = mongoose.model('URL', urlSchema);
