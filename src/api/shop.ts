import request from "./request";

export type Size = "XS" | "S" | "M" | "ML" | "L" | "XL" | "XXL";

export interface Product {
  availableSizes: Size[];
  currencyFormat: string;
  currencyId: string;
  description: string;
  id: number;
  installments: number;
  isFreeShipping: boolean;
  price: number;
  sku: number;
  style: string;
  title: string;
}

export interface GetProductsRes {
  data: {
    products: Product[];
  };
}

const PUBLIC_URL = process.env.PUBLIC_URL;

export function getProducts() {
  return request
    .get<any, GetProductsRes>(`/shop-static/json/products.json`)
    .setConfig({
      baseURL: `${PUBLIC_URL}`,
      notCheckCode: true,
    });
}
