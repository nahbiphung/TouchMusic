const puppeteer = require('puppeteer');
 
(async () => {
    // headless puppeteer.launch(); default is true
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const url ='https://zingmp3.vn/zing-chart/index.html';
    await page.goto(url);
    // await page.screenshot({path: 'example.png'});



    // await page.waitForSelector('div.lyrics-text a.view-full');

    // const button = await page.$('div.lyrics-text a.view-full');
    // await page.waitFor(2000);
    // await button.click();

    // await page.waitForSelector('span p.lyrics-text');

    // const lyric = await page.evaluate(
    //     () => document.querySelector('span p.lyrics-text').innerHTML
    // )
    // console.log(lyric);

    // await page.waitForSelector('div.z-float-header div.z-box-title');
    // await page.waitForSelector('div.lyrics-text span p.lyrics-text');
    

    // const name = await page.evaluate(
    //     () => document.querySelector('div.lyrics-text span p.lyrics-text').textContent
    // )
    // console.log(name);


    await page.waitForSelector('li.bor-bottom');

    const listSongTop = await page.evaluate(() => 
        Array.from(document.querySelectorAll('li.bor-bottom'))
            .map(res => ({
                title: res.querySelector('div.z-card div.card-info div.title a').textContent,
                song: res.querySelector('div.z-card div.extension') !== null ? 
                        res.querySelector('div.z-card div.extension ul.hover-view') !== null ?
                            res.querySelector('div.z-card div.extension ul.hover-view a.z-btn-item').href : 'null' : 'null',
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

    console.log(listSongTop);

    // for (let i = 1; i < 2; i++) {
    //     console.log(listSongTop[i].title);
    //     await page.goto(listSongTop[i].song);
        
    //     await page.waitForSelector('div.lyrics-text a.view-full');

    //     // click 'Xem Them'
    //     const button = await page.$('div.lyrics-text a.view-full');
    //     await page.waitFor(3000);
    //     await button.click();

    //     // await to get 'Xem Them' transfer
    //     await page.waitForSelector('span p.lyrics-text');

    //     const lyric = await page.evaluate(
    //         () => document.querySelector('span p.lyrics-text').textContent
    //     )

    //     console.log(lyric);
    //     console.log('\n\n');
    //     // add lyric to array
    //     listSongTop[i].lyric = lyric;
    // }
    
    await browser.close();
})();
