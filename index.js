require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let urlDatabase = {}
let urlCounter = 1

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url
  if(!validUrl.isWebUri(originalUrl)) {
    return res.json({ error:'Invalid URL' })
  }

  const shortUrl = urlCounter++
  urlDatabase[shortUrl] = originalUrl

  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  })
})

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl
  const originalUrl = urlDatabase[shortUrl]

  if (originalUrl) {
    res.redirect(originalUrl)
  } else {
    res.json({error: "No short URL found for the given input"})
  }
})


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
