import { useCallback, useEffect, useState } from "react";
import {
  ProductItem,
  requestProducts,
  setSizes,
} from "./store/slices/productReducer";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import Loader from "./components/Loader";
import SizeBar from "./components/SizeBar";
import { Size } from "@/api/shop";
import Products from "./components/Products";
import styles from "./App.module.less";
import { addProduct } from "./store/slices/shopCartReducer";
import CartPanel from "./components/CartPanel";

export default function App() {
  const { shopCart, product } = useAppSelector((state) => state);
  const { loading, products, sizes, allSize } = product;
  const { carts, count, totalPrice, totalCurrencyFormat, totalInstallments } =
    shopCart;
  const [isExpand, setIsExpand] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestProducts(sizes));
  }, [dispatch, sizes]);

  const handleSizeChange = useCallback((size: Size) => {
    dispatch(setSizes(size));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleAddToCart = useCallback((item: ProductItem) => {
    dispatch(addProduct(item));
    setIsExpand(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClose = useCallback(() => setIsExpand(false), []);
  const handleExpand = useCallback(() => setIsExpand(true), []);

  return (
    <div className={styles.app}>
      <Loader className={styles.loading} isLoading={loading} />
      <SizeBar
        sizes={allSize}
        checked={sizes}
        onSizeChange={handleSizeChange}
      />
      <Products
        className={styles.products}
        list={products}
        onAddToCart={handleAddToCart}
      />
      <CartPanel
        isExpand={isExpand}
        onClose={handleClose}
        onExpand={handleExpand}
        count={count}
        totalPrice={totalPrice}
        totalCurrencyFormat={totalCurrencyFormat}
        totalInstallments={totalInstallments}
        list={carts}
      />
    </div>
  );
}
