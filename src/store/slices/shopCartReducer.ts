import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { ProductItem } from "./productReducer";

export interface CartProduct extends ProductItem {
  quantity: number;
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
      const productAlreadyInCart = state.carts.find(
        (product: CartProduct) => payload.id === product.id
      );

      if (productAlreadyInCart) {
        productAlreadyInCart.quantity += 1;
      } else {
        state.carts.push({ ...payload, quantity: 1 });
        state.totalInstallments =
          state.totalInstallments > payload.installments
            ? state.totalInstallments
            : payload.installments;
        state.totalCurrencyFormat =
          state.totalCurrencyFormat || payload.currencyFormat;
      }
      state.totalPrice += payload.price;
      state.count += 1;
    },
    subtractProduct: (state, { payload }) => {
      let descPrice = 0;
      const list = state.carts.filter((item) => {
        const isDel = item.id === payload.id;

        if (isDel) {
          state.count -= item.quantity;
          descPrice += item.quantity * item.price;
          item.quantity = 0;
        }
        return !isDel;
      });
      state.carts = list;
      state.totalInstallments = getInstallments(list);
      state.totalPrice -= descPrice;
    },
    subtractQuantity: (state, { payload }) => {
      const productAlreadyInCart = state.carts.find(
        (product: CartProduct) => payload.id === product.id
      );
      if (productAlreadyInCart && productAlreadyInCart.quantity > 1) {
        productAlreadyInCart.quantity -= 1;
        state.totalPrice -= productAlreadyInCart.price;
        state.count -= 1;
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
export const { addProduct, subtractProduct, subtractQuantity, deleteAll } =
  shopCartSlice.actions;
