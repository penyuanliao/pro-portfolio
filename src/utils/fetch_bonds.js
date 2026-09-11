import puppeteer from 'puppeteer-core'
import fs from 'fs'
import fsPromises from 'node:fs/promises'
import chalk from 'chalk'

// 輔助函式：計算距離到期日剩餘年數 (Year Fraction)
function calculateYearsToMaturity(maturityDateStr) {
  if (!maturityDateStr) return null;
  const maturityDate = new Date(maturityDateStr.replace(/\//g, '-'));
  const today = new Date();
  const diffTime = maturityDate.getTime() - today.getTime();
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return diffYears > 0 ? diffYears : 0;
}

// 輔助函式：計算殖利率
function calculateYields(couponRateStr, buyQuoteStr, maturityDateStr) {
  const couponRate = parseFloat(couponRateStr.replace('%', ''));
  const buyQuote = parseFloat(buyQuoteStr);

  if (isNaN(couponRate) || isNaN(buyQuote) || buyQuote <= 0) {
    return { current_yield: null, approximate_ytm: null };
  }

  // 1. 當期殖利率 (Current Yield)
  const currentYield = (couponRate / buyQuote) * 100;

  // 2. 簡易到期殖利率 (Approximate YTM)
  const years = calculateYearsToMaturity(maturityDateStr);
  let approximateYtm = null;

  if (years && years > 0) {
    const annualCoupon = couponRate; // 假設面額為 100
    const priceGainLossPerYear = (100 - buyQuote) / years;
    const averagePrice = (100 + buyQuote) / 2;
    approximateYtm = ((annualCoupon + priceGainLossPerYear) / averagePrice) * 100;
  }

  return {
    current_yield: Number(currentYield.toFixed(4)),
    approximate_ytm: approximateYtm !== null ? Number(approximateYtm.toFixed(4)) : null,
    years,
  }
}
async function getFiles(folderPath = './') {
  try {
    const entries = await fsPromises.readdir(folderPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.includes(".json"))
      .map(entry => entry.name)
  } catch (error) {
    console.error('Error reading folder:', error);
  }
}
// 讀取上一次
function loadJSON(path) {
  const data = fs.readFileSync(path, 'utf8');

  return JSON.parse(data)
}
// 分析
function dataMapping(json) {
  const data = new Map();
  json.forEach((item) => {
    data.set(item.product_code, item);
  })
  return data;
}
async function fetchEsunBonds() {
  console.log('正在啟動本機 Chrome 瀏覽器...');
  // 啟動瀏覽器：指定使用電腦現有的 Chrome
  const browser = await puppeteer.launch({
    headless: true,
    // macOS 預設的 Google Chrome 安裝路徑
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    console.log('正在前往玉山銀行海外債券頁面...');
    await page.goto('https://wealth.esunbank.com/zh-tw/offshore-bond/price', {
      waitUntil: 'networkidle2'
    });

    // 1. 等待並自動點擊「確定」按鈕
    console.log('尋找「確定」按鈕並點擊...');
    // const confirmButtonSelector = '::-p-xpath(//button[contains(text(), "確定")] | //a[contains(text(), "確定")])';
    const confirmButtonSelector = '.btn.calBtn.bg-primary.m-2';

    try {
      await page.waitForSelector(confirmButtonSelector, { timeout: 5000 });
      const confirmBtn = await page.$(confirmButtonSelector);

      if (confirmBtn) {
        await confirmBtn.click();
        console.log('已成功點擊「確定」按鈕！');
      } else {
        console.log('未找到彈窗按鈕，繼續執行...');
      }
    } catch (e) {
      console.log('未找到彈窗按鈕，繼續執行...');
    }

    // 2. 等待表格資料載入完成
    console.log('等待表格內容載入...');
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    // 3. 解析 DOM 資料
    const bonds = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));

      return rows.map(row => {
        const cols = row.querySelectorAll('td');
        if (cols.length < 12) return null;

        return {
          open_for_subscription: cols[0].textContent.trim() === '是',
          product_name: cols[1].textContent.trim(),
          product_code: cols[2].textContent.trim(),
          isin_code: cols[3].textContent.trim(),
          coupon_rate: cols[4].textContent.trim(),
          maturity_date: cols[5].textContent.trim(),
          currency: cols[6].textContent.trim(),
          buy_quote: cols[7].textContent.trim().split('\n')[0],
          sell_quote: cols[8].textContent.trim().split('\n')[0],
          payment_frequency: cols[9].textContent.trim(),
          risk_level: cols[10].textContent.trim(),
          eligibility: cols[11].textContent.trim(),
        }
      }).filter(item => item !== null && item.product_name.includes("美國公債"));
    });

    // 處理並附加殖利率數據
    const bondsWithYields = bonds.map(bond => {
      const yields = calculateYields(bond.coupon_rate, bond.buy_quote, bond.maturity_date);
      const { product_name, product_code, buy_quote, coupon_rate } = bond;
      const bQuote = parseFloat(buy_quote);
      // if (bQuote <= 100 && yields.years < 20 && yields.years > 1) console.log(`${product_name}(${product_code}) : ${buy_quote}(${coupon_rate}) - ${yields.years.toFixed(2)}`)
      return {
        ...bond,
        metrics: {
          current_yield_percent: `${yields.current_yield.toFixed(3)}%`, // 當期殖利率 (%)
          approximate_ytm_percent: `${yields.approximate_ytm.toFixed(3)}%`, // 估算到期殖利率 (%)
          years: yields.years.toFixed(2),
        },
      }
    });
    const specifyFile = process.argv[2] || '';
    const prevFilePath = (specifyFile.includes(".json")) ? specifyFile : `./esun_bonds.json`;
    const prevData = dataMapping(loadJSON(prevFilePath));

    // 顯示分析
    JSON.parse(JSON.stringify(bondsWithYields)).sort((a, b) => {
      return parseFloat(a.metrics.years) < parseFloat(b.metrics.years) ? -1 : 1;
    }).map(({ product_name, product_code, buy_quote, coupon_rate, metrics }) => {

      const bQuote = parseFloat(buy_quote);
      const couponRate = parseFloat(coupon_rate);
      const bondYield = parseFloat(metrics.approximate_ytm_percent); // 殖利率
      let buyStr = buy_quote;
      let couponRateStr = coupon_rate;
      if (bQuote > 100) {
        buyStr = chalk.gray(buy_quote)
      }
      if (couponRate > 3.5) {
        couponRateStr = chalk.cyan(coupon_rate);
      }
      if (prevData.get(product_code)) {
        const item = prevData.get(product_code);
        const diff = Math.abs(parseFloat(item.buy_quote) - bQuote).toFixed(2);
        if (bQuote > parseFloat(item.buy_quote)) {
          buyStr += chalk.redBright(` ▲ ${diff} `);
        }
        if (bQuote < parseFloat(item.buy_quote)) {
          buyStr += chalk.greenBright(` ▼ ${diff} `);
        }
      }

      console.log(`${product_name}(${product_code}) : ${buyStr}(${couponRateStr}) - ${metrics.years}\t[${chalk.hex(bondYield < 2 ? "#7a737a" : "#00b0ba")(bondYield.toString() + "%")}]`)
    })

    console.log(`成功擷取到 ${bondsWithYields.length} 筆債券資料！`);

    const today = new Date();
    // 4. 寫入 esun_bonds.json
    const outputFile = `esun_bonds_${today.getMonth() + 1}_${today.getDate()}.json`;
    fs.writeFileSync(outputFile, JSON.stringify(bondsWithYields, null, 2), 'utf-8');

    fs.writeFileSync('esun_bonds.json', JSON.stringify(bondsWithYields, null, 2), 'utf-8');

    console.log(`檔案已成功儲存至 ${outputFile}`);

  } catch (error) {
    console.error('抓取資料時發生錯誤：', error);
  } finally {
    await browser.close();
    console.log('瀏覽器已關閉。');
  }
}

fetchEsunBonds().then(_ => {
  console.log('完成')
  process.exit(0);
});


