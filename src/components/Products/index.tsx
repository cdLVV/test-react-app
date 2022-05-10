import classNames from "classnames";
import { memo } from "react";
import { RootState } from "../../store";
import Product from "../Product";
import styles from "./index.module.less";

interface Props {
  className?: string;
  list: RootState["product"]["products"];
  onAddToCart?: any;
}
function Products(props: Props) {
  const { className, list, onAddToCart } = props;
  return (
    <div className={classNames(className, styles.index)}>
      <div className={styles.count}>{list.length} Product(s) found</div>
      {list.map((item) => (
        <Product key={item.sku} data={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

export default memo(Products);
