import { Badge } from "antd";
import classNames from "classnames";
import { memo } from "react";
import styles from "./index.module.less";

interface Props {
  className?: string;
  count: number;
  onClick?: any;
}

function CartButton(props: Props) {
  const { count, onClick, className } = props;
  return (
    <div className={classNames(styles.cartBtn, className)} onClick={onClick}>
      <Badge
        showZero
        className={styles.badge}
        count={count}
        style={{ backgroundColor: "rgb(234, 191, 0)" }}
      />
    </div>
  );
}

export default memo(CartButton);
