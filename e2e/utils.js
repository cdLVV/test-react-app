const TARGET_URL = "http://localhost:3001/test-react-app/";
const WIDTH = 375;
const HEIGHT = 667;
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

const createWaitFor = (fn, page) => {
  const returnFn = async function (...args) {
    console.log(`${fn} is beginning`, args[0]);
    const res = await page[fn].apply(page, args);
    console.log(`${fn} is ended`);
    return res;
  };

  return returnFn;
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

/**
 * 获取购物车中的第n个的商品的增加按钮
 * @param {number} index
 * @returns string
 */
const getCartItemAddBtn = (index) =>
  `.cart_panel-cartList > .cart_panel-cartItem:nth-child(${index}) .cart_panel-cartItem-add-btn`;
/**
 * 获取购物车中的第n个的商品的输入框
 * @param {number} index
 * @returns string
 */
const getCartItemQuantityInput = (index) =>
  `.cart_panel-cartList > .cart_panel-cartItem:nth-child(${index}) .cart_panel-cartItem-quantity`;
/**
 * 获取购物车中的第n个的商品的增加按钮
 * @param {number} index
 * @returns string
 */
const getCartItemSubtractBtn = (index) =>
  `.cart_panel-cartList > .cart_panel-cartItem:nth-child(${index}) .cart_panel-cartItem-subtract-btn`;
/**
 * 获取购物车中的第n个的商品的增加按钮
 * @param {number} index
 * @returns string
 */
const getCartItemDelBtn = (index) =>
  `.cart_panel-cartList > .cart_panel-cartItem:nth-child(${index}) .cart_panel-cartItem-del-btn`;

module.exports = {
  TARGET_URL,
  WIDTH,
  HEIGHT,
  sleep,
  timeout,
  createWaitFor,

  getSizeFilterBtn,
  SORT_BTN,
  PRICE_UP_SORT,
  NORMAL_SORT,

  getPruductAddToCartBtn,
  getPruductSizeBtn,
  SHOW_CART_BTN,
  HIDDEN_CART_BTN,
  CART_LIST,
  CART_ITEM,
  CHECKOUT_BTN,

  getCartItem,
  getCartItemAddBtn,
  getCartItemQuantityInput,
  getCartItemSubtractBtn,
  getCartItemDelBtn,
};
