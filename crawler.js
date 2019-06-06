const puppeteer = require('puppeteer');
 
(async () => {
    // headless puppeteer.launch(); default is true
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const url ='https://zingmp3.vn/zing-chart/index.html';
    await page.goto(url);
    // await page.screenshot({path: 'example.png'});



    // await page.waitForSelector('.artist-name');

    // const artist = await page.evaluate(
    //     () => document.querySelector('.artist-name').textContent
    // )
    // console.log(artist);



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

    // // console.log(listSongTop);

    for (let i = 1; i < 20; i++) {
        console.log(listSongTop[i].title);
        console.log(listSongTop[i].song);
        await page.goto(listSongTop[i].song);
        
        await page.waitForSelector('.artist-name');

        const artist = await page.evaluate(
            () => document.querySelector('.artist-name').textContent
        )
        console.log(artist);

        await page.waitForSelector('div.lyrics-text a.view-full', {timeout: 2000});

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

        console.log(lyric);
        console.log('\n\n');
        // add lyric to array
        listSongTop[i].lyric = lyric;
    }
    
    await browser.close();
})();
