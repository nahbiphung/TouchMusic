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

const app = express();
app.use(cors(corsOptions));
const port = process.env.PORT || 3001;
app.use(express.static(__dirname + '/dist/TouchMusic'));

// crawling web
// get lyrics on each of song page
function getLyrics(link) {
  return new Promise((result, reject) => request(link, (lyrisError, lyricsResponse, lyricsHtml) => {
    if (!lyrisError && lyricsResponse.statusCode == 200) {
      if (lyricsHtml) {
        const $ = cheerio.load(lyricsHtml);
        const lyrics = $('.pd_lyric').text();
        result(lyrics);
      }
    }
  }));
}

// get whole data of song
async function getSongDataNhaccuatui(req, res, link) {
  return await new Promise((result, reject) => request(link, async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      if (html) {
        const song = new Array();
        const $ = cheerio.load(html);
        const boxContentMusicList = $('.box-content-music-list').toArray();
        for (const grandFatherelement of boxContentMusicList) {
          const viewCount = $(grandFatherelement).children('span').text();
          const avatarSong = $(grandFatherelement).children('.info_song').children('.avatar_song').children('img').attr('src');
          const songHref = $(grandFatherelement).children('.info_song').children('.avatar_song').attr('href');
          let titleSong = $(grandFatherelement).children('.info_song').children('h2').children('.name_song').text();
          if (titleSong == '') {
            titleSong = $(grandFatherelement).children('.info_song').children('h3').children('.name_song').text();
          }
          const author = new Array();
          $(grandFatherelement).children('.info_song').children('.name_sing_under').children('.name_singer').each((j, e) => {
            const authorName = $(e).text();
            const authorHref = e.attribs.href;
            author.push({
              name: authorName,
              link: authorHref
            });
          });
          const lyrics = await getLyrics(songHref);
          song.push({
            avatar: avatarSong,
            name: titleSong,
            link: songHref,
            lyric: lyrics,
            performer: author,
            view: viewCount
          });
        }
        result(song);
      }
    }
  }));
}


app.get('/test', async (req, res) => {
  const song = await getSongDataNhaccuatui(req, res, 'https://www.nhaccuatui.com/bai-hat/bai-hat-moi-nhat.html');
  res.json({
    NameSong: song
  });
});

app.get('/newsongnhaccuatui',async (req, res) => {
  let listSong = new Array();
  let number = await new Promise((result, reject) => request('https://www.nhaccuatui.com/bai-hat/bai-hat-moi-nhat.html',async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      if (html) {
        const $ = cheerio.load(html);
        const boxContentPagelist = $('.box_pageview').children('.number').last().attr('href');
        result(boxContentPagelist.match(/\d+/g).map(Number));
      }
    } else {
      reject("any");
    }
  }));
  let i = 2;
  while (i <= number[0]) {
    let link = 'https://www.nhaccuatui.com/bai-hat/bai-hat-moi-nhat.' + i + '.html';
    const song = await getSongDataNhaccuatui(req, res, link);
    listSong = listSong.concat(song);
    i++;
  }
  res.json({
    NameSong: listSong
  });
});

const server = http.createServer(app);

server.listen(port, () => console.log('running...'));