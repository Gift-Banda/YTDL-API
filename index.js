// Require stuff
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const { getInfo } = require('ytdl-getinfo');

// Cors
app.use(cors());

// Listen on port 8000
app.listen(8000, () => {
  console.log('Server running on port 3000');
});

app.get('/', (req, res) => {
  res.send('YTDL API.\n Hello World');
});

// Download video
app.get('/d', (req, res) => {
  let URL = req.query.url;
  let FORMAT = req.query.format;
  let QUALITY = req.query.quality;
  let VIDEO_NAME;

  getInfo(`${URL}`).then((info) => {
    // info.items[0] should contain the output of youtube-dl --dump-json
    VIDEO_NAME = info.items[0].title;
    res.header(
      'Content-Disposition',
      `attachment; filename="${VIDEO_NAME}.${FORMAT || 'mp4'}"`
    );

    try {
      if (QUALITY === 'highest') {
        console.log('Downloading highest format');
        ytdl(URL, {
          format: FORMAT.toLowerCase() || 'mp4',
        }).pipe(res);
      } else {
        console.log('Downloading custom format');
        ytdl(URL, {
          format: FORMAT.toLowerCase() || 'mp4',
          quality: QUALITY || 'highest',
        }).pipe(res);
      }
    } catch (err) {
      console.log('There was an error, attempting to download still.');
      ytdl(URL, {
        format: 'mp4',
      }).pipe(res);
    }
  });
});
