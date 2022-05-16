/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require("puppeteer");

const TARGET_URL = "http://localhost:3001/test-react-app/";
const width = 375;
const height = 667;
const isDebug = true;
const timeout = isDebug ? 200000 : 20000;

if (isDebug) {
  jest.setTimeout(timeout);
}
const sleep = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

/**
 * 获取大小尺码过滤按钮
 * @param {number} index
 * @returns string
 */
const getSizeFilterBtn = (index) => `#root .size-bar-item:nth-child(${index})`;

const SORT_BTN = "#root .sort-filter-btn";
const PRICE_UP_SORT =
  ".ant-popover-content > .ant-popover-inner > .ant-popover-inner-content .sort-filter-item-priceUp";
const NORMAL_SORT =
  ".ant-popover-content > .ant-popover-inner > .ant-popover-inner-content .sort-filter-item-normal";

const createWaitFor = (fn, page) => {
  const returnFn = async function (...args) {
    console.log(`${fn} is beginning`, args[0]);
    const res = await page[fn].apply(page, args);
    console.log(`${fn} is ended`);
    return res;
  };

  return returnFn;
};
describe(
  "Test shopping page",
  () => {
    let page;
    let browser;
    let context;

    let myPage;

    const expectRequestProducts = async ({ value, isExpect }) => {
      // const requestProducts = await myPage.waitForResponse(
      //   (response) =>
      //     response.url().includes("/shop-static/json/products.json") &&
      //     response.status() === 200
      // );

      let requestProducts = await myPage.waitForRequest(
        (request) =>
          request.url().includes("/shop-static/json/products.json") &&
          request.method() === "GET"
      );
      let curUrl = requestProducts.url();
      console.log({ curUrl, value });
      if (isExpect) {
        expect(curUrl).toEqual(expect.stringMatching(value));
      } else {
        expect(curUrl).toEqual(expect.not.stringMatching(value));
      }

      await sleep(1000);
    };

    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
        devtools: true,
        slowMo: 100,
      });
      context = await browser.createIncognitoBrowserContext();
      page = await context.newPage();
      await page.goto(TARGET_URL, {
        waitUntil: "networkidle0", // networkidle2
      });
      await page.setViewport({ width, height });
      // page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

      myPage = [
        "waitForRequest",
        "waitForSelector",
        "waitForResponse",
        "waitFor",
        "click",
      ].reduce((pre, item) => {
        pre[item] = createWaitFor(item, page);
        return pre;
      }, {});

      console.log("page is ready");
    });
    afterAll(async () => {
      await browser.close();
    });

    test(
      "test filter",
      async () => {
        const sizeQ = getSizeFilterBtn(1);
        await myPage.waitForSelector(sizeQ);
        const size = await page.$eval(sizeQ, (el) => el.dataset.size);
        myPage.click(sizeQ);
        await expectRequestProducts({ value: size, isExpect: true });
        await page.screenshot({ path: "e2e/screenshots/test-size-filter.png" });
        myPage.click(sizeQ);
        await expectRequestProducts({ value: size, isExpect: false });

        await sleep(1000);
      },
      timeout
    );

    test(
      "test sort",
      async () => {
        await myPage.waitForSelector(SORT_BTN);
        await myPage.click(SORT_BTN);

        await myPage.waitForSelector(PRICE_UP_SORT);
        const sort = await page.$eval(PRICE_UP_SORT, (el) => el.dataset.sort);
        await myPage.waitForSelector(PRICE_UP_SORT);
        myPage.click(PRICE_UP_SORT);

        await sleep(200);
        await page.screenshot({ path: "e2e/screenshots/test-sort.png" });
        await expectRequestProducts({ value: sort, isExpect: true });
        await sleep(200);

        await myPage.waitForSelector(NORMAL_SORT);
        myPage.click(NORMAL_SORT);
        await expectRequestProducts({ value: sort, isExpect: false });
      },
      timeout
    );
  },
  timeout
);
