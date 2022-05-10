import { getProducts, Product, Size } from "@/api/shop";
import {
  createSlice,
  SliceCaseReducers,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

enableMapSet();

export type ProductItem = Omit<Product, "availableSizes"> & {
  availableSizes: Array<Size>;
  img1: string;
  img2: string;
};

export interface CartProduct extends Product {
  quantity: number;
}
// export type SizeMap = Record<Size, boolean>;
export type SizeMap = Record<string, boolean>[];

export interface ProductState {
  products: ProductItem[];
  sizes: Set<Size>;
  // sizeMap: SizeMap;
  allSize: Size[];
  allProducts: ProductItem[];
  loading: boolean;
}
const PUBLIC_URL = process.env.PUBLIC_URL;

export const requestProducts = createAsyncThunk(
  `product/requestProducts`,
  //发出一个请求，这里用的是axios
  // async (params) => await services.testApi(params),
  async (sizes: Set<Size>) => {
    const res = await getProducts();

    return new Promise<ProductItem[]>((resolve) => {
      setTimeout(() => {
        resolve(
          res.data.products
            .filter(
              (item) =>
                sizes.size === 0 || intersection(sizes, item.availableSizes)
            )
            .map(({ sku, availableSizes, ...rest }) => ({
              ...rest,
              img1: `${PUBLIC_URL}/shop-static/products/${sku}-1-product.webp`,
              img2: `${PUBLIC_URL}/shop-static/products/${sku}-2-product.webp`,
              sku,
              availableSizes: Array.from(new Set(availableSizes)),
            }))
        );
      }, 1000);
    });
  }
);

// function intersection(set1: Array<Size>, set2: Array<Size>): boolean {
//   return set1.length + set2.length === new Set([...set1, ...set2]).size;
// }
function intersection(set1: Set<Size>, set2: Array<Size>): boolean {
  return set2.some((item) => set1.has(item));
}
const allSize = ["XS", "S", "M", "ML", "L", "XL", "XXL"] as Array<Size>;

// const initSizeMap = allSize.reduce(
//   (pre, item) => [...pre, { [item]: true }],
//   [] as SizeMap
// );
export const productSlice = createSlice<
  ProductState,
  SliceCaseReducers<ProductState>
>({
  name: "product",
  initialState: {
    sizes: new Set([]),
    // sizeMap: initSizeMap,
    allSize: allSize,
    products: [],
    allProducts: [],
    loading: false,
  },
  reducers: {
    // setAllProducts: (state, { payload }) => {
    //   state.allProducts = payload;
    // },
    setSizes: (state, action) => {
      console.log({ action });
      const { payload } = action;
      if (state.sizes.has(payload)) {
        state.sizes.delete(payload);
      } else {
        state.sizes.add(payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestProducts.pending, (state, action) => {
      state.loading = true;
    });
    // 接口请求返回
    builder.addCase(requestProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.allProducts = action.payload;
      state.products = action.payload;
    });
    builder.addCase(requestProducts.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

// 导出actions
export const { setSizes } = productSlice.actions;
