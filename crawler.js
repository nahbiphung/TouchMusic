const puppeteer = require('puppeteer');
 
(async () => {
    // headless puppeteer.launch(); default is true
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url ='https://zingmp3.vn/zing-chart/bai-hat.html';
    await page.goto(url);
    // await page.screenshot({path: 'example.png'});
 
    // const content = await page.evaluate(
    //     () => document.querySelector('a.z-logo').textContent
    //     )
    
    // console.log(content);

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
                author: Array.from(res.querySelectorAll('div.z-card div.artist'))
                            .map(auth => ({
                                    auth1: auth.querySelector('a').href,
                                    auth2: auth.querySelector('a.mr-2') !== null ? auth.querySelector('a.mr-2').href : 'null'
                                 })),
            }))
    )

    console.log(listSongTop);
    await browser.close();
})();
