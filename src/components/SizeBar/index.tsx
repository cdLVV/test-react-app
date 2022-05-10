import { Size } from "@/api/shop";
import classNames from "classnames";
import { memo, useCallback } from "react";
import styles from "./index.module.less";

interface Props {
  sizes: Size[];
  checked: Set<Size>;
  onSizeChange: (size: Size) => any;
}

function SizeBar(props: Props) {
  const { sizes, checked, onSizeChange } = props;

  const handleSizeChange = useCallback(
    (e: any) => {
      const { size } = e.target.dataset;

      console.log({ size });

      if (size) {
        onSizeChange(size);
      }
    },
    [onSizeChange]
  );

  return (
    <nav className={styles.index}>
      <h3 className={styles.title}>Sizes:</h3>
      <div className={styles.sizes} onClick={handleSizeChange}>
        {sizes.map((item) => (
          <div
            key={item}
            data-size={item}
            className={classNames(
              styles.size,
              checked.has(item) ? styles.checked : styles.notChecked
            )}
          >
            {item}
          </div>
        ))}
      </div>
    </nav>
  );
}

export default memo(SizeBar);
