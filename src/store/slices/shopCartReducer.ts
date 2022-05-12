import { add, subtract } from "@/utils";
import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { ProductItem } from "./productReducer";

export interface CartProduct extends ProductItem {
  quantity: number;
  size: string;
}

export interface ShopCartState {
  carts: CartProduct[];
  count: number;
  totalPrice: number;
  totalInstallments: number;
  totalCurrencyFormat: string;
}

const getInstallments = (list: ShopCartState["carts"]) =>
  list.reduce((greater, product) => {
    greater = product.installments > greater ? product.installments : greater;
    return greater;
  }, 0);
export const shopCartSlice = createSlice<
  ShopCartState,
  SliceCaseReducers<ShopCartState>
>({
  name: "shopCart",
  initialState: {
    carts: [],
    count: 0,
    totalPrice: 0,
    totalInstallments: 0,
    totalCurrencyFormat: "",
  },
  reducers: {
    addProduct: (state, { payload }) => {
      const { item, size } = payload;
      const productAlreadyInCart = state.carts.find(
        (product: CartProduct) =>
          item.id === product.id && size === product.size
      );

      if (productAlreadyInCart) {
        productAlreadyInCart.quantity += 1;
      } else {
        state.carts.push({ ...item, quantity: 1, size });
        state.totalInstallments =
          state.totalInstallments > item.installments
            ? state.totalInstallments
            : item.installments;
        state.totalCurrencyFormat =
          state.totalCurrencyFormat || item.currencyFormat;
      }
      state.totalPrice = add(state.totalPrice, item.price);
      state.count += 1;
    },
    subtractProduct: (state, { payload }) => {
      let descPrice = 0;
      const list = state.carts.filter((item) => {
        const isDel = item.id === payload.id && item.size === payload.size;

        if (isDel) {
          state.count -= item.quantity;
          descPrice += item.quantity * item.price;
          item.quantity = 0;
        }
        return !isDel;
      });
      state.carts = list;
      state.totalInstallments = getInstallments(list);
      // state.totalPrice -= descPrice;
      state.totalPrice = subtract(state.totalPrice, descPrice);
    },
    subtractQuantity: (state, { payload }) => {
      const productAlreadyInCart = state.carts.find(
        (product: CartProduct) =>
          payload.id === product.id && product.size === payload.size
      );
      if (productAlreadyInCart && productAlreadyInCart.quantity > 1) {
        productAlreadyInCart.quantity -= 1;
        // state.totalPrice -= productAlreadyInCart.price;
        state.totalPrice = subtract(
          state.totalPrice,
          productAlreadyInCart.price
        );
        state.count -= 1;
      }
    },
    changePruductNumber: (state, { payload }) => {
      const { item, quantity } = payload;
      const productAlreadyInCart = state.carts.find(
        (product: CartProduct) =>
          item.id === product.id && product.size === item.size
      );
      if (productAlreadyInCart) {
        state.totalPrice = add(
          quantity * productAlreadyInCart.price,
          subtract(
            state.totalPrice,
            productAlreadyInCart.quantity * productAlreadyInCart.price
          )
        );
        state.count = state.count - productAlreadyInCart.quantity + quantity;
        productAlreadyInCart.quantity = quantity;
        state.totalInstallments = getInstallments(state.carts);
      }
    },
    deleteAll: (state) => {
      state.carts = [];
      state.count = 0;
      state.totalPrice = 0;
      state.totalInstallments = 0;
    },
  },
});

// 导出actions
export const {
  addProduct,
  subtractProduct,
  subtractQuantity,
  deleteAll,
  changePruductNumber,
} = shopCartSlice.actions;
