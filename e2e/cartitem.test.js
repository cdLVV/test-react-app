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
  getCartItemAddBtn,
  getCartItemQuantityInput,
  getCartItemSubtractBtn,
  getCartItemDelBtn,
} = require("./utils");

describe(
  "Test shopping page",
  () => {
    let page;
    let browser;
    let context;

    let myPage;

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

    /**
     * 数据统计
     */
    let total = 0;
    const counts = [0];
    const map = [0];

    const addSomePruductToCart = async ({ index, sizeInde }) => {
      const prudoct = getPruductAddToCartBtn(index);
      const size = getPruductSizeBtn(sizeInde);
      await myPage.waitForSelector(prudoct);
      await page.click(prudoct);
      await myPage.waitForSelector(size);
      await page.click(size);

      total++;
      const key = `${index}-${sizeInde}`;
      let curIndex = map.indexOf(key);
      if (curIndex === -1) {
        map.push(key);
        counts[map.length - 1] = 1;
        children++;
      } else {
        counts[curIndex]++;
      }

      await sleep(200);
    };

    const addCartItem = async ({ index }) => {
      const btn = getCartItemAddBtn(index);
      await myPage.waitForSelector(btn);
      await page.click(btn);

      total++;
      counts[index]++;

      await sleep(200);
    };

    const editCartItem = async ({ index, input }) => {
      const inputSelector = getCartItemQuantityInput(index);
      const inputEle = await page.$(inputSelector);
      // await page.evaluate((ele) => (ele.value = ""), inputEle);
      // await page.$eval(inputSelector, el => el.value = '')
      /**
       * 上面的方法可以清除，但无法触发事件，导致有某些问题，比如input是10，原来的值为1，会变成空字符串然后，再变为110
       */
      await inputEle.click({ clickCount: 3 });
      await sleep(100);
      await page.type(inputSelector, `${input}`);
      await page.evaluate((ele) => ele.blur(), inputEle);

      total = total - counts[index] + input;
      counts[index] = input;

      await sleep(200);
    };

    const subtractCartItem = async ({ index }) => {
      const btn = getCartItemSubtractBtn(index);
      await myPage.waitForSelector(btn);
      await page.click(btn);

      total--;
      counts[index]--;

      await sleep(200);
    };

    const delSomePruductToCart = async ({ index }) => {
      const btn = getCartItemDelBtn(index);
      await myPage.waitForSelector(btn);
      await page.click(btn);

      const desc = counts[index];
      counts.splice(index + 1, 1);
      map.splice(index + 1, 1);
      total -= desc;

      await sleep(200);
    };

    const openCartPanel = async () => {
      await myPage.waitForSelector(SHOW_CART_BTN);
      const cartButton = await page.$(SHOW_CART_BTN);
      await cartButton.click();
      // await page.click(SHOW_CART_BTN);
      await myPage.waitForSelector(SHOW_CART_BTN, { hidden: true });
      await myPage.waitForSelector(HIDDEN_CART_BTN);
      await sleep(200);
    };

    const expectCart = async ({ index }) => {
      const arr = await page.$$(CART_ITEM);
      expect(arr.length).toBe(map.length - 1);
      const countEle = await page.$("#shopping-cart-count");
      const cur = await page.evaluate((ele) => Number(ele.innerHTML), countEle);
      expect(cur).toBe(total);

      if (typeof index === "number") {
        const input = getCartItemQuantityInput(index);
        const inputEle = await page.$(input);
        const cur = await page.evaluate((ele) => Number(ele.value), inputEle);
        const indexTotal = counts[index];
        expect(cur).toBe(indexTotal);
      }
    };

    test(
      "test cart",
      async () => {
        /**
         * 添加第一个商品的，第一个规格到购物车
         * total: 1
         * counts: [0, 1]
         */
        await addSomePruductToCart({ index: 1, sizeInde: 1 });
        await expectCart({});
        /**
         * 添加第一个商品的，第一个规格到购物车
         * total: 2
         * counts: [0, 2]
         */
        await addSomePruductToCart({ index: 1, sizeInde: 1 });
        await expectCart({});
        /**
         * 添加第一个商品的，第二个规格到购物车
         * total: 3
         * counts: [0, 2, 1]
         */
        await addSomePruductToCart({ index: 1, sizeInde: 2 });
        await expectCart({});
        /**
         * 添加第二个商品的，第一个规格到购物车
         * total: 4
         * counts: [0, 2, 1, 1]
         */
        await addSomePruductToCart({ index: 2, sizeInde: 1 });
        await expectCart({});

        await openCartPanel();
        await page.screenshot({ path: "e2e/screenshots/cartitem-count1.png" });

        /**
         * 增加第一行商品的数量
         * total: 5
         * counts: [0, 3, 1, 1]
         */
        await addCartItem({ index: 1 });
        await expectCart({ index: 1 });

        /**
         * 第一行商品的数量加1
         * total: 6
         * counts: [0, 4, 1, 1]
         */
        await addCartItem({ index: 1 });
        await expectCart({ index: 1 });

        /**
         * 编辑第二行商品的数量
         * total: 15
         * counts: [0, 4, 10, 1]
         */
        await editCartItem({ index: 2, input: 10 });
        await expectCart({ index: 2 });

        /**
         * 第二行商品的数量减1
         * total: 15
         * counts: [0, 4, 9, 1]
         */
        await subtractCartItem({ index: 2 });
        await expectCart({ index: 2 });

        await sleep(200);

        /**
         * 删除第一行数据
         * total: 10
         * counts: [0, 9, 1]
         */
        await delSomePruductToCart({ index: 1 });
        await expectCart({ total });
      },
      timeout
    );
  },
  timeout
);
