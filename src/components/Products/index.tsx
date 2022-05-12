import classNames from "classnames";
import { memo } from "react";
import { RootState } from "../../store";
import Product from "../Product";
import Sort from "../Sort";
import styles from "./index.module.less";

interface Props {
  className?: string;
  list: RootState["product"]["products"];
  onAddToCart?: any;
  onSortChange?: any;
  sort: string;
}
function Products(props: Props) {
  const { className, list, onAddToCart, onSortChange, sort } = props;
  return (
    <div className={classNames(className, styles.index)}>
      <div className={styles.count}>
        <div>{list.length} Product(s) found</div>
        <Sort onSortChange={onSortChange} checked={sort} />
      </div>
      {list.map((item) => (
        <Product key={item.sku} data={item} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}

export default memo(Products);
