const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');
const http = require('http');

var corsOptions = {
    origin: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

const app = express();
app.use(cors(corsOptions));
const port = process.env.PORT || 3002;
// app.use(express.static(__dirname + '/dist/TouchMusic'));

app.get('/zingSongsCount', async(req,res) => {
    (async () => {
        // headless puppeteer.launch(); default is true
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        const url = 'https://zingmp3.vn/zing-chart/index.html';
        await page.goto(url);
        // await page.screenshot({path: 'example.png'});
    
        console.log('Start #');
        await page.waitForSelector('li.bor-bottom');
    
        const listSongTop = await page.evaluate(() => 
            Array.from(document.querySelectorAll('li.bor-bottom'))
                .map(res => ({
                    title: res.querySelector('div.z-card div.card-info div.title a').textContent
                }))
        )
        
        await browser.close();
        res.json(listSongTop);
    })();
})

app.get('/zingTop100', async(req,res) => {
    console.log(req.query.song);
    (async () => {
        // headless puppeteer.launch(); default is true
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        const url ='https://zingmp3.vn/zing-chart/index.html';
        await page.goto(url);
        // await page.screenshot({path: 'example.png'});
    
        console.log('Start #');
        await page.waitForSelector('li.bor-bottom');
    
        const listSongTop = await page.evaluate(() => 
            Array.from(document.querySelectorAll('li.bor-bottom'))
                .map(res => ({
                    title: res.querySelector('div.z-card div.card-info div.title a').textContent,
                    song: res.querySelector('div.z-card div.extension') !== null ? 
                            res.querySelector('div.z-card div.extension ul.hover-view') !== null ?
                                res.querySelector('div.z-card div.extension ul.hover-view a.z-btn-item').href : 'null' : 'null',
                    imgsrc: res.querySelector('div.z-card a.thumb-40 img').src,
                    // video: res.querySelector('div.z-card div.extension') !== null ? 
                    //         res.querySelector('div.z-card div.extension ul.hover-view') !== null ?
                    //             res.querySelector('div.z-card div.extension ul.hover-view a').href : 'null' : 'null',
                    // author: Array.from(res.querySelectorAll('div.z-card div.artist'))
                    //             .map(auth => ({
                    //                     auth1: auth.querySelector('a') !== null ? auth.querySelector('a').href : 'null',
                    //                     auth2: auth.querySelector('a.mr-2') !== null ? auth.querySelector('a.mr-2').href : 'null'
                    //                  })),
                }))
        )
    
        // console.log(listSongTop);
        const arrData = [];
        switch (req.query.song) {
            case '1':
                console.log('case 1 running');
                for(let i = 1; i <= 5; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 1; i <= 5; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
                break;
            
            case '2':
                console.log('case 2 running');
                for(let i = 11; i <= 15; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 11; i <= 15; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
                break;

            case '3':
                console.log('case 3 running');
                for(let i = 21; i <= 25; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 21; i <= 25; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
                break;

            case '4':
                console.log('case 4 running');
                for(let i = 31; i <= 35; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 31; i <= 35; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
                break;

            case '5':
                console.log('case 5 running');
                for(let i = 41; i <= 45; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 41; i <= 45; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
                break;

            case '6':
                console.log('case 6 running');
                for(let i = 51; i <= 55; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 51; i <= 55; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
                break;

            case '7':
                console.log('case 7 running');
                for(let i = 61; i <= 65; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 61; i <= 65; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
            break;

            case '8':
                console.log('case 8 running');
                for(let i = 71; i <= 75; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 71; i <= 75; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
                break;

            case '9':
                console.log('case 9 running');
                for(let i = 81; i <= 85; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 81; i <= 85; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
                break;

            case '10':
                console.log('case 10 running');
                for(let i = 91; i <= 95; i++){
                    console.log(i);
                    await page.goto(listSongTop[i].song);
        
                    await page.waitForSelector('.artist-name');
                    
                    const artist = await page.evaluate(
                        () => document.querySelector('.artist-name').textContent
                    )
                    // console.log(artist);
                    listSongTop[i].artist = artist;
                    
                    try{
                        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 4000});

                        // click 'Xem Them'
                        const button = await page.$('div.lyrics-text a.view-full');
                        await page.waitFor(3000);
                        await button.click();
                        // if (button != null){
                        //     await button.click();
                        // }
                        

                        // await to get 'Xem Them' transfer
                        await page.waitForSelector('span p.lyrics-text');

                        const lyric = await page.evaluate(
                            () => document.querySelector('span p.lyrics-text').textContent
                        )

                        // console.log(lyric);
                        // console.log('\n\n');
                        // add lyric to array
                        listSongTop[i].lyric = lyric;
                    } catch (e) { // catch trường hợp không tìm thấy tag lyric => nghĩa là k có lyric.
                        // console.log('element probably not exists')
                        const lyric = 'null';
                        // console.log(lyric);
                        // console.log('\n\n');
                        listSongTop[i].lyric = lyric;
                    }
                }

                for(let i = 91; i <= 95; i++){
                    arrData.push(listSongTop[i]);
                }

                console.log(arrData);
                res.json(arrData);
                break;
            default:
                break;
        }
        
        
        
        // console.log(listSongTop);

        await browser.close();
    })();
})


const server = http.createServer(app);

server.listen(port, () => console.log('running...'));