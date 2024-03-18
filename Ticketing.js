const puppeteer = require('puppeteer');

async function Ticketing(browser, page, cookies) //티케팅 정보 입력하고 -> 조회하기
{
        page.close(); //일단 브라우저 객체 전부 닫고
        browser.close();


        browser = await puppeteer.launch({ headless: true }); //재기동
        page = await browser.newPage();

        await page.setCookie(...cookies); //쿠키 설정으로 로그인 확보
        await page.goto('https://etk.srail.kr/hpg/hra/01/selectScheduleList.do?pageId=TK0101010000', { waitUntil: 'networkidle0' });

        //도착지 타이핑 수서->송정
        await new Promise(resolve => setTimeout(resolve, 3000)); //일단 페이지 열리기까지 기다림

        await page.waitForSelector('#dptRsStnCdNm');
        await page.waitForSelector('#arvRsStnCdNm');

        await page.focus('#dptRsStnCdNm')
        await page.keyboard.press('Delete');
        await page.keyboard.press('Delete'); //수서 지우기
        await page.keyboard.type('수서');

        await page.focus('#arvRsStnCdNm')
        await page.keyboard.press('Delete');
        await page.keyboard.press('Delete'); //부산 지우기
        await page.keyboard.type('광주송정');

        let selectedOptions = await page.select('#dptDt', '20240319');
        console.log(selectedOptions); // 출력: [ '20231023' ]

        let selected = await page.select('#dptTm', '100000');
        console.log(selected); // 출력: [ '140000' ]

        await page.waitForSelector('input[type="submit"][value="조회하기"]');
        await page.click('input[type="submit"][value="조회하기"]');

        await new Promise(resolve => setTimeout(resolve, 2000)); //2초 쉬고

        return {browser, page}
    }

    module.exports = {
        Ticketing : Ticketing
    }