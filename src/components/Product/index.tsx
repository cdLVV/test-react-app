import classNames from "classnames";
import { memo, useCallback, useMemo } from "react";
import { ProductItem } from "../../store/slices/productReducer";
import { formatPrice } from "../../utils";
import LazyImage from "../LazyImage";
import styles from "./index.module.less";

interface Props {
  className?: string;
  data: ProductItem;
  onAddToCart?: any;
}

function Products(props: Props) {
  const { className, data, onAddToCart } = props;
  const {
    title,
    price,
    installments,
    currencyFormat,
    isFreeShipping,
    img1,
    img2,
    availableSizes,
  } = data;
  const [num1, num2] = useMemo(() => formatPrice(price).split("."), [price]);

  const handleClick = useCallback(() => {
    onAddToCart && onAddToCart(data);
  }, [data, onAddToCart]);
  return (
    <div className={classNames(className, styles.index)}>
      {isFreeShipping && <div className={styles.free}>Free shipping</div>}
      <div
        className={classNames(styles.bg, styles.bg1, "h-[270px] sm:h-[320px]")}
      >
        <LazyImage src={img1} />
      </div>
      <div
        className={classNames(styles.bg, styles.bg2, "h-[270px] sm:h-[320px]")}
      >
        <LazyImage src={img2} />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.price}>
        {currencyFormat}
        <span className={styles.num1}>{num1}</span>
        <span className={styles.num2}>.{num2}</span>
      </div>
      <div className={styles.availableSizes}>
        {availableSizes.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      {!!installments && (
        <div className={styles.installments}>
          or {installments} x
          <span>
            {currencyFormat}
            {formatPrice(price / installments)}
          </span>
        </div>
      )}
      <div className={styles.grow} />
      <button className={styles.btn} onClick={handleClick}>
        Add to cart
      </button>
    </div>
  );
}

export default memo(Products);
