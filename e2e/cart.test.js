/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require("puppeteer");

const {
  TARGET_URL,
  WIDTH,
  HEIGHT,
  sleep,
  timeout,
  createWaitFor,
  getPruductAddToCartBtn,
  getPruductSizeBtn,
  SHOW_CART_BTN,
  HIDDEN_CART_BTN,
  CART_ITEM,
  CHECKOUT_BTN,
} = require("./utils");

describe(
  "Test shopping page",
  () => {
    let page;
    let browser;
    let context;

    let myPage;

    const openCartPanel = async () => {
      await myPage.waitForSelector(SHOW_CART_BTN);
      const cartButton = await page.$(SHOW_CART_BTN);
      await cartButton.click();
      // await page.click(SHOW_CART_BTN);
      await myPage.waitForSelector(SHOW_CART_BTN, { hidden: true });
      await myPage.waitForSelector(HIDDEN_CART_BTN);
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
      await page.setViewport({ width: WIDTH, height: HEIGHT });
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

    // test("aaa", async () => {}, timeout);

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

        expect(cur).toBe(pre + 1);
        console.log("test add to cart end");
        await sleep(200);
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

    test(
      "test checkout",
      async () => {
        await openCartPanel();
        await myPage.waitForSelector(CHECKOUT_BTN);
        await page.click(CHECKOUT_BTN);

        const modalBtn =
          ".ant-modal-content > .ant-modal-body > .ant-modal-confirm-body-wrapper > .ant-modal-confirm-btns > .ant-btn-primary";
        await page.waitForSelector(modalBtn);
        await page.click(modalBtn);

        await sleep(200);
        const arr = await page.$$(CART_ITEM);
        expect(arr.length).toBe(0);
      },
      timeout
    );
  },
  timeout
);
