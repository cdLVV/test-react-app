import { Modal } from "antd";
import classNames from "classnames";
import { memo, useCallback } from "react";
import { useAppDispatch } from "../../store/hooks";
import {
  addProduct,
  ShopCartState,
  subtractProduct,
  subtractQuantity,
  deleteAll,
} from "../../store/slices/shopCartReducer";
import { formatPrice } from "../../utils";
import CartButton from "../CartButton";
import styles from "./index.module.less";

interface Props {
  list: ShopCartState["carts"];
  count: number;
  totalPrice: number;
  totalInstallments: number;
  totalCurrencyFormat: string;
  isExpand: boolean;
  onClose?: any;
  onExpand?: any;
}

function CartPanel(props: Props) {
  const {
    count,
    onClose,
    onExpand,
    isExpand,
    list,
    totalPrice,
    totalCurrencyFormat,
    totalInstallments,
  } = props;

  const dispatch = useAppDispatch();
  const handleClearAll = useCallback(() => {
    Modal.confirm({
      title: "确认购买当前购物车的商品?",

      content: `Checkout - Subtotal: $ ${formatPrice(totalPrice)}`,
      okText: "确认",
      onOk() {
        dispatch(deleteAll({}));
      },
      cancelText: "再想想",
      onCancel() {
        console.log("Cancel");
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice]);
  const handleSubtractProduct = useCallback((item: any) => {
    dispatch(subtractProduct(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleSubtractQuantity = useCallback((item: any) => {
    dispatch(subtractQuantity(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleAddProduct = useCallback((item: any) => {
    dispatch(addProduct(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={classNames(styles.cartBtn, {
        [styles.show]: isExpand,
      })}
    >
      <CartButton
        className={styles.cartButton}
        count={count}
        onClick={onExpand}
      />
      <button className={styles.closeBtn} onClick={onClose}>
        X
      </button>
      <main className={styles.content}>
        <div className={styles.cartButton2Wrap}>
          <CartButton
            className={styles.cartButton2}
            count={count}
            onClick={onExpand}
          />
          <span>Cart</span>
        </div>
        <div className={styles.cartList}>
          {list.map((item) => (
            <div key={item.sku} className={styles.cartItem}>
              <img className={styles.img} src={item.img1} alt={item.title} />
              <div className={styles.desc}>
                <div>{item.title}</div>
                <div>
                  {`${item.availableSizes[0]} | ${item.style}`} <br />
                  Quantity: {item.quantity}
                </div>
              </div>
              <div className={styles.btnWrap}>
                <div>{`${item.currencyFormat}  ${formatPrice(
                  item.price
                )}`}</div>
                <div>
                  <button
                    className={styles.btn}
                    disabled={item.quantity <= 1}
                    onClick={() => handleSubtractQuantity(item)}
                  >
                    -
                  </button>
                  <button
                    className={styles.btn}
                    onClick={() => handleAddProduct(item)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className={styles.delBtn}
                onClick={() => handleSubtractProduct(item)}
              />
            </div>
          ))}
          {list.length === 0 && (
            <div className={styles.empty}>
              Add some products in the cart <br />
              :)
            </div>
          )}
        </div>
      </main>
      <div className={styles.panelBottom}>
        <div className={styles.textWrap}>
          <div className={styles.text}>SUBTOTAL</div>
          <div className={styles.price}>
            <div className={styles.first}>{`$  ${formatPrice(
              totalPrice || 0
            )}`}</div>
            {!!totalInstallments && (
              <div className={styles.last}>
                {`OR UP TO ${totalInstallments} x ${totalCurrencyFormat} ${formatPrice(
                  totalPrice / totalInstallments
                )}`}
              </div>
            )}
          </div>
        </div>
        <button
          className={styles.checkBtn}
          disabled={!count}
          onClick={handleClearAll}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default memo(CartPanel);
