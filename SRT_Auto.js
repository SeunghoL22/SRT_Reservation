const puppeteer = require('puppeteer');
const kakaoTalk = require("./kakaotalk.js");
const linebot = require("./linebot.js");
const checkEmpty = require("./CheckEmpty.js");
const ticketing = require("./Ticketing.js");



async function main() {
    const player = require('play-sound')(opts = {})

    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();

    await page.goto('https://etk.srail.kr/cmc/01/selectLoginForm.do?pageId=TK0701000000', { waitUntil: 'networkidle0' });

    // 전화번호로 로그인
    await page.waitForSelector('#srchDvCd3');
    await page.focus('#srchDvCd3');
    await page.keyboard.press('Space');

    // ID와 비밀번호 입력
    await page.waitForSelector('#srchDvNm03');
    await page.waitForSelector('#hmpgPwdCphd03');

    await page.focus('#srchDvNm03')
    await page.keyboard.type('');//전화번호(ID)
    await page.focus('#hmpgPwdCphd03')
    await page.keyboard.type('');//비밀번호
    console.log("로그인 중");
    // 로그인 버튼 클릭
    // 1초 대기
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 로그인 후의 모든 쿠키 가져오기
    const cookies = await page.cookies();

    // Tab 키 두 번 누르고 Enter 키 누르기
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    //3초후 예약 페이지로 이동
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    while (true) {

        let newInstances = await ticketing.Ticketing(browser, page, cookies);//조회하기까지
        browser = newInstances.browser;
        page = newInstances.page; //재할당

        await page.waitForSelector('tr:nth-of-type(1) td:nth-of-type(7) a'); //반드시 수정
        let cell = await page.$('tr:nth-of-type(1) td:nth-of-type(7)'); //반드시 수정
        let cell2 = await page.$('tr:nth-of-type(1) td:nth-of-type(7) a'); //반드시 수정
        let linkText = await page.evaluate(cell => cell.querySelector('span').innerText, cell);
        //console.log(linkText);


        let isEmpty = checkEmpty.Check(); //텍스트 조회함.
        if (isEmpty == true) {
            console.log("찾았다 예매할게 ~");
            kakaoTalk.sendMessage("SRT 찾았어요 10분 이내로 결제하세요");
            linebot.sendBot("SRT 찾았어요 10분 이내로 결제하세요");
            await cell2.click(); //예매 클릭
            player.play('file.mp3', (err) => {
                if (err) throw err
            }) //예매 성공시 소리 울림
            break;
        }
        console.log("한번 더");

        await page.evaluate(() => { //페이지 스크롤 끌어올려
            window.scrollTo(0, 0);
        });

    }

}


main();