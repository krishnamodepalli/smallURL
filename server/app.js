
const express = require('express');
const cors = require('cors');

const urls = require('./models/urls');

const app = express();
app.use(express.json());
app.use(cors());

// loading some environmental variables
const port = process.env.PORT || 8080;


app.listen(port, () => {
  console.log(`Server is fired up 🔥 and running on port ${port}`);
  urls.connectDB();
});

app.post('/shorten', async (req, res) => {
  // we will get the information first and then shorten it
  try {
    await urls.shorten(req.body.longURL, req.body.shortCode);
    res.status(201).json({ msg: 'success' });
  }
  catch (e) {
    // send corrosponding response
    res.status(400).json({ error: 'shortCode already in use, please use another' });
  }
});

app.get('/redirect/:tinyurl', async (req, res) => {
  // save the data and then redirect
  const shortCode = req.params.tinyurl;
  const userAgent = req.headers['user-agent'];

  // getting the long URI from the database
  const url = await urls.redirect(shortCode, userAgent);
  res.status(201).json({ longURL: url.longURL });
});

app.get('/private/del', (req, res) => {
  urls.collection.drop((err) => {
    if (err)  console.error(err);
    else  console.log('successfully deleted all the documents');
  })
  res.send('successfully deleted all the documents');
});