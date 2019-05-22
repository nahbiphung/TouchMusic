const express = require('express');
const http = require('http');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

const cors = require('cors')

var corsOptions = {
  origin: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

// crawling web
var nameSong = '';


const app = express();
app.use(cors(corsOptions));
const port = process.env.PORT || 3001;
app.use(express.static(__dirname + '/dist/TouchMusic'));
app.get('/*', (req, res) => {
    const song = new Array();
    request('https://www.nhaccuatui.com', (error, response, html) => {
      if (!error && response.statusCode == 200) {
        if (html) {
          const $ = cheerio.load(html);
          $('.name_song').each((i,element) => {
            const nameSong = $(element).text();
            const songHref = $(element).attr('href');
            song.push({
                name: nameSong,
                href: songHref
            });
          });
          res.json({NameSong: song});
        }
      }
    });
    
});
const server = http.createServer(app);

server.listen(port, () => console.log('running...'));