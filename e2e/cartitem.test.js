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
 * 购物车列表
 */
const CART_LIST = ".cart_panel-cartList";
const CART_ITEM = ".cart_panel-cartList > .cart_panel-cartItem";
const CHECKOUT_BTN = ".cart_panel-checkBtn";

/**
 * 获取当前购物车的第n个的商品元素
 * @param {number} index
 * @returns string
 */
const getCartItem = (index) =>
  `.cart_panel-cartList > .cart_panel-cartItem:nth-child(${index})`;

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

    const addSomePruductToCart = async ({ index, sizeInde }) => {
      const prudoct = getPruductAddToCartBtn(index);
      const size = getPruductSizeBtn(sizeInde);
      await myPage.waitForSelector(prudoct);
      await page.click(prudoct);
      await myPage.waitForSelector(size);
      await page.click(size);
      await sleep(200);
    };

    const delSomePruductToCart = async ({ index }) => {
      const prudoct = getPruductAddToCartBtn(index);
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

    const expectCart = async ({ index, children, total }) => {
      const arr = await page.$$(CART_ITEM);
      expect(arr.length).toBe(children);
      const countEle = await page.$("#shopping-cart-count");
      const pre = await page.evaluate((ele) => Number(ele.innerHTML), countEle);
      expect(pre).toBe(total);
    };

    test(
      "test cart",
      async () => {
        let total = 0;
        let children = 0;
        /**
         * 添加第一个商品的，第一个规格到购物车
         */
        total++;
        children++;
        await addSomePruductToCart({ index: 1, sizeInde: 1 });
        await expectCart({ children, total });
        /**
         * 添加第一个商品的，第一个规格到购物车
         */
        total++;
        await addSomePruductToCart({ index: 1, sizeInde: 1 });
        await expectCart({ children: 1, total });
        /**
         * 添加第一个商品的，第二个规格到购物车
         */
        total++;
        children++;
        await addSomePruductToCart({ index: 1, sizeInde: 2 });
        await expectCart({ children: 2, total });
        /**
         * 添加第二个商品的，第一个规格到购物车
         */
        await addSomePruductToCart({ index: 2, sizeInde: 1 });
        total++;
        children++;
        await expectCart({ children: 3, total });

        await openCartPanel();
        await page.screenshot({ path: "e2e/screenshots/cartitem-count1.png" });
      },
      timeout
    );
  },
  timeout
);
