import numeral from "numeral";

export const formatPrice = (price: number) => {
  return numeral(price).format("0,0.00");
};
// window.numeral = numeral;
export const subtract = (a: number, b: number) =>
  numeral(a).subtract(b).value() as number;
export const add = (a: number, b: number) =>
  numeral(a).add(b).value() as number;

export function fixedBody() {
  const scrollTop =
    document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.cssText += "position:fixed;top:-" + scrollTop + "px;";
}

export function looseBody() {
  const body = document.body;
  body.style.position = "";
  const top = body.style.top;
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
  body.style.top = "";
}
