import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';
import * as querystring from 'node:querystring'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chrome 執行檔路徑 (Windows / Mac)
const CHROME_PATH = process.platform === 'win32'
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  console.log('🚀 正在啟動 Chrome 瀏覽器...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  );
  const City = 8 // 台中
  const District = new Map([
    ["霧峰", 108],
    ["大里", 107]
  ])


  const section = District.values().toArray().join(',');
  const baseUrl = `https://sale.591.com.tw/?regionid=8&section=${ section }&price=400_1000&houseage=0_5,5_10,10_20&shType=list&pattern=2`;

  let firstRow = 0;
  let allHouses = [];
  let pageIndex = 1;
  let hasMoreData = true;

  try {
    while (hasMoreData) {
      const targetUrl = `${baseUrl}&firstRow=${firstRow}`;
      console.log(`\n🌐 [第 ${pageIndex} 頁] 正在前往: firstRow=${firstRow}`);

      await page.goto(targetUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      await delay(3000);

      // 🎯 判斷 1：檢查頁面是否出現 .not-find 查無資料畫面
      const isNotFound = await page.evaluate(() => {
        const notFindEl = document.querySelector('.not-find');
        if (notFindEl) return true;

        // 備用文字判斷：文字包含 "暫無相關內容"
        const textContent = document.body.innerText || '';
        return textContent.includes('暫無相關內容') || textContent.includes('抱歉');
      });

      if (isNotFound) {
        console.log('🏁 偵測到網頁出現「.not-find 暫無相關內容」標籤，無更多資料，停止爬取！');
        hasMoreData = false;
        break;
      }

      // 模擬平滑向下捲動，觸發圖片與 DOM 懶載入
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 300;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight / 2) {
              clearInterval(timer);
              resolve();
            }
          }, 150);
        });
      });

      await delay(2000);

      // 🎯 解析 .ware-item 物件
      const pageHouses = await page.evaluate(() => {
        const results = [];
        const listWrap = document.querySelector('.ware-list-wrap') || document.body;
        const items = listWrap.querySelectorAll('.ware-item');
        const skip = ["京站VISA", "興大臻鑽"];
        const skip2F = true;
        items.forEach((item) => {
          const dataId = item.getAttribute('data-id') || '';
          const titleLinkEl = item.querySelector('.ware-item__header a');
          const title = titleLinkEl ? titleLinkEl.getAttribute('title') || titleLinkEl.innerText.trim() : '';
          const url = titleLinkEl ? titleLinkEl.href : '';

          const attrNodes = item.querySelectorAll('.ware-item__attr');
          const attrs = Array.from(attrNodes).map(node => node.innerText.trim());

          const communityEl = item.querySelector('.ware-item__community-link');
          const sectionEl = item.querySelector('.ware-item__section');
          const addressEl = item.querySelector('.ware-item__address');
          const community = communityEl ? communityEl.innerText.trim() : '';
          const address = `${sectionEl ? sectionEl.innerText.trim() : ''}${addressEl ? addressEl.innerText.trim() : ''}`;

          const priceValEl = item.querySelector('.ware-item__price-value');
          const priceUnitEl = item.querySelector('.ware-item__price span');
          const price = priceValEl ? `${priceValEl.innerText.trim()}${priceUnitEl ? priceUnitEl.innerText.trim() : '萬'}` : '';

          const priceSection = item.querySelector('.ware-item__price-section');
          let unitPrice = '';
          if (priceSection) {
            const text = priceSection.innerText;
            const match = text.match(/[\d.]+\s*萬\/坪/);
            if (match) unitPrice = match[0];
          }

          const userNameEl = item.querySelector('.user-info__name');
          const userName = userNameEl ? userNameEl.innerText.trim() : '';

          const tagNodes = item.querySelectorAll('.tags-row__item');
          const tags = Array.from(tagNodes).map(node => node.innerText.trim());

          const has2F = skip2F && attrs.some(item => item.includes("2F/") || item.includes("1F/") || item.includes("套房"));

          if (title && price && !skip.includes(community) && !has2F) {
            results.push({
              id: dataId,
              title,
              price,
              unitPrice,
              attrs,
              community,
              address,
              agent: userName,
              tags,
              url
            });
          }
        });

        return results;
      });

      console.log(`✨ 本頁取得 ${pageHouses.length} 筆物件`);

      // 🎯 判斷 2：如果抓取到的陣列長度為 0，也停止爬取
      if (pageHouses.length === 0) {
        console.log('🏁 本頁無抓取到任何卡片，結束爬取。');
        hasMoreData = false;
      } else {
        allHouses.push(...pageHouses);
        firstRow += 30;
        pageIndex++;

        // 隨機延遲 2~4 秒以防封鎖
        const randomDelay = Math.floor(Math.random() * 2000) + 2000;
        console.log(`⏳ 隨機等待 ${(randomDelay / 1000).toFixed(1)} 秒後處理下一頁...`);
        await delay(randomDelay);
      }
    }

    // 💾 資料去重與儲存
    if (allHouses.length > 0) {
      // 根據 id 去重複（避免推薦區塊重複抓取相同的卡片）
      const uniqueHouses = Array.from(
        new Map(allHouses.map(item => [item.id || item.url, item])).values()
      );
      const now = new Date()
      const outputPath = path.join(__dirname, `591_houses_${now.getMonth() + 1}_${now.getDate()}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(uniqueHouses, null, 2), 'utf-8');

      console.log(`\n🎉 抓取任務完成！`);
      console.log(`📊 總共收集 ${uniqueHouses.length} 筆不重複的房屋資料`);
      console.log(`📁 JSON 檔案路徑: ${outputPath}`);
    } else {
      console.log('\n⚠️ 未抓取到資料，請檢查條件或確認頁面狀況。');
    }

  } catch (error) {
    console.error('❌ 執行過程發生錯誤:', error);
  } finally {
    console.log('🔒 關閉瀏覽器...');
    await browser.close();
  }
})();