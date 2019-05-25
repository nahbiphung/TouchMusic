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

function getLyrics(link) {
  return new Promise((result, reject) => request(link, (lyrisError, lyricsResponse, lyricsHtml) => {
    if (!lyrisError && lyricsResponse.statusCode == 200) {
      if (lyricsHtml) {
        const $ = cheerio.load(lyricsHtml);
        const lyrics = $('.pd_lyric').text();
        // console.log(lyrics);
        result(lyrics);
        // return $('.pd_lyric').text();
      }
    }
  }));

}

const app = express();
app.use(cors(corsOptions));
const port = process.env.PORT || 3001;
app.use(express.static(__dirname + '/dist/TouchMusic'));

app.get('/*', (req, res) => {
  const song = new Array();
  request('https://www.nhaccuatui.com/bai-hat/bai-hat-moi-nhat.html',async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      if (html) {
        const $ = cheerio.load(html);
        const boxContentMusicList = $('.box-content-music-list').toArray();
        for (const grandFatherelement of boxContentMusicList) {
          const viewCount = $(grandFatherelement).children('span').text();
          // console.log($(grandFatherelement).index[2].text());
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
        // $('.box-content-music-list').each((i, grandFatherelement) => {
        //   const viewCount = $(grandFatherelement).children('span').text();
        //   // console.log($(grandFatherelement).index[2].text());
        //   const avatarSong = $(grandFatherelement).children('.info_song').children('.avatar_song').children('img').attr('src');
        //   const songHref = $(grandFatherelement).children('.info_song').children('.avatar_song').attr('href');
        //   let titleSong = $(grandFatherelement).children('.info_song').children('h2').children('.name_song').text();
        //   if (titleSong == '') {
        //     titleSong = $(grandFatherelement).children('.info_song').children('h3').children('.name_song').text();
        //   }
        //   const author = new Array();
        //   $(grandFatherelement).children('.info_song').children('.name_sing_under').children('.name_singer').each((j, e) => {
        //     const authorName = $(e).text();
        //     const authorHref = e.attribs.href;
        //     author.push({
        //       name: authorName,
        //       link: authorHref
        //     });
        //   });
        //   // const lyrics = await getLyrics(songHref);



        //   // console.log(lyrics);
        //   song.push({
        //     avatar: avatarSong,
        //     name: titleSong,
        //     link: songHref,
        //     performer: author,
        //     view: viewCount
        //   });
        // });
        res.json({
          NameSong: song
        });
      }
    }

  });


});
const server = http.createServer(app);

server.listen(port, () => console.log('running...'));