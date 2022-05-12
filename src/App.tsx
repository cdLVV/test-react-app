import { useCallback, useEffect, useState } from "react";
import {
  ProductItem,
  requestProducts,
  setSizes,
  setSort,
} from "./store/slices/productReducer";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import Loader from "./components/Loader";
import SizeBar from "./components/SizeBar";
import { Size } from "@/api/shop";
import Products from "./components/Products";
import styles from "./App.module.less";
import { addProduct } from "./store/slices/shopCartReducer";
import CartPanel from "./components/CartPanel";
import { fixedBody, looseBody } from "./utils";
import { Drawer } from "antd";

export default function App() {
  const { shopCart, product } = useAppSelector((state) => state);
  const { loading, products, sizes, allSize, sort } = product;
  const { carts, count, totalPrice, totalCurrencyFormat, totalInstallments } =
    shopCart;
  const [isExpand, setIsExpand] = useState(false);
  const [curProduct, setCurProduct] = useState<ProductItem>();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestProducts({ sizes, sort }));
  }, [dispatch, sizes, sort]);

  const handleSizeChange = useCallback((size: Size) => {
    dispatch(setSizes(size));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleAddToCart = useCallback((item: ProductItem) => {
    // dispatch(addProduct(item));
    setCurProduct(item);
  }, []);
  const handleChooseSize = useCallback(
    (e: any) => {
      const { size } = e.target.dataset;

      if (size) {
        dispatch(addProduct({ item: curProduct, size }));
        setCurProduct(undefined);
      }
    },
    [curProduct, dispatch]
  );
  const handleClose = useCallback(() => {
    setIsExpand(false);
    looseBody();
  }, []);
  const handleExpand = useCallback(() => {
    setIsExpand(true);
    fixedBody();
  }, []);
  const handleSortChange = useCallback(
    (val: string) => {
      dispatch(setSort(val));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sizes]
  );

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
        onSortChange={handleSortChange}
        sort={sort}
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
      <Drawer
        title={
          <div className="text-center font-bold text-lg">请选择样式大小</div>
        }
        placement="bottom"
        closable={false}
        visible={!!curProduct}
        onClose={() => setCurProduct(undefined)}
      >
        <div className={styles.sizes} onClick={handleChooseSize}>
          {curProduct?.availableSizes.map((item) => (
            <div key={item} data-size={item}>
              {item}
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
