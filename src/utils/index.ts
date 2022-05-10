import numeral from "numeral";

export const formatPrice = (price: number) => {
  return numeral(price).format("0,0.00");
};
