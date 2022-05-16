import { SortOptins } from "@/constants";
import { getStyleName } from "@/utils";
import { Popover } from "antd";
import classNames from "classnames";
import { memo, useCallback, useMemo, useState } from "react";
import styles from "./index.module.less";

interface Props {
  onSortChange: any;
  checked: string;
}

function Sort(props: Props) {
  const { onSortChange, checked } = props;
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = useCallback((v: boolean) => {
    setVisible(v);
  }, []);

  const handleSortChange = useCallback(
    (e: any) => {
      const { sort } = e.target.dataset;

      if (typeof sort === "string") {
        onSortChange(sort);
      }
    },
    [onSortChange]
  );

  const content = (
    <div className={styles.sorts} onClick={handleSortChange}>
      {SortOptins.map((item) => (
        <div
          key={item.value}
          data-sort={item.value}
          className={getStyleName(
            "sort-filter-item",
            item.value || "normal",
            styles,
            classNames(
              styles.sort,
              checked === item.value ? styles.checked : styles.notChecked
            )
          )}
        >
          {item.label}
        </div>
      ))}
    </div>
  );

  const checkedLabel = useMemo(
    () =>
      (checked && SortOptins.find((item) => item.value === checked)?.label) ||
      "Sort",
    [checked]
  );

  return (
    <div className={styles.index}>
      <Popover
        content={content}
        trigger="click"
        placement="bottomRight"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <button className={getStyleName("sort-filter", "btn", styles)}>
          {checkedLabel}
          <i className="fa fa-angle-down fa-x" />
        </button>
      </Popover>
    </div>
  );
}

export default memo(Sort);
