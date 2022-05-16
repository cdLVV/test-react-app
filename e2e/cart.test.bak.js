/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require("puppeteer");

const TARGET_URL = "http://localhost:3001";
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
 * 获取第n个商品的加入购物车按钮
 * @param {number} index
 * @returns string
 */
const getPruductAddToCartBtn = (index) =>
  `#root .products-list > .product_item-index:nth-child(${index}) > .product_item_add_to_cart-btn`;
/**
 * 获取当前商品的第n个size的元素
 * @param {number} index
 * @returns string
 */
const getPruductSizeBtn = (index) =>
  `.ant-drawer-content > .ant-drawer-wrapper-body > .ant-drawer-body .product_to_choose_size_item:nth-child(${index})`;
/**
 * 显示购物车列表的按钮
 */
const SHOW_CART_BTN = ".cart_panel-cartButton";
/**
 * 收起购物车列表按钮
 */
const HIDDEN_CART_BTN = ".cart_panel-closeBtn";

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
      "add to cart",
      async () => {
        let countEle = await page.$("#shopping-cart-count");
        const pre = await page.evaluate(
          (ele) => Number(ele.innerHTML),
          countEle
        );
        await myPage.waitForSelector(getPruductAddToCartBtn(1));
        await page.screenshot({ path: "e2e/screenshots/add-to-cart1.png" });
        await page.click(getPruductAddToCartBtn(1));
        await page.screenshot({ path: "e2e/screenshots/add-to-cart2.png" });
        await myPage.waitForSelector(getPruductSizeBtn(1));
        await page.click(getPruductSizeBtn(1));
        /**
         * 不暂停200毫秒，会导致下一个测试用例的购物车按钮点击没有效果
         */
        await sleep(200);
        /**
         * waitFor is deprecated and will be removed in a future release
         */
        // await myPage.waitFor(200);
        await page.screenshot({ path: "e2e/screenshots/add-to-cart3.png" });
        const cur = await page.evaluate(
          (ele) => Number(ele.innerHTML),
          countEle
        );
        // console.log({ pre, cur });

        expect(cur).toBe(pre + 1);
        await countEle.dispose();
        console.log("test add to cart end");
      },
      timeout
    );

    test(
      "epxand and close cart_panel",
      async () => {
        console.log("begin test epxand and close cart_panel");
        const testPanelStatus = async (expectStatus) => {
          const status = await page.$eval(
            ".cart_panel",
            (el) => el.dataset.expand
          );

          // console.log({ status, expectStatus });
          expect(status).toBe(expectStatus);
        };

        // await sleep(1000);
        await testPanelStatus("false");
        await myPage.waitForSelector(SHOW_CART_BTN);
        const cartButton = await page.$(SHOW_CART_BTN);
        await cartButton.click();
        // await page.click(SHOW_CART_BTN);
        await myPage.waitForSelector(SHOW_CART_BTN, { hidden: true });
        await myPage.waitForSelector(HIDDEN_CART_BTN);
        await sleep(1000);
        await page.screenshot({
          path: "e2e/screenshots/epxand-cart_panel.png",
        });

        // await myPage.waitForSelector(SHOW_CART_BTN, { hidden: true });
        // await myPage.waitForSelector(HIDDEN_CART_BTN);

        await testPanelStatus("true");
        await page.click(HIDDEN_CART_BTN);
        await sleep(1000);
        await page.screenshot({
          path: "e2e/screenshots/close-cart_panel.png",
        });
        await testPanelStatus("false");
      },
      timeout
    );

  },
  timeout
);
