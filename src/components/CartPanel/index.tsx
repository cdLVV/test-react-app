import { Modal } from "antd";
import classNames from "classnames";
import { memo, useCallback, useMemo } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  addProduct,
  ShopCartState,
  subtractProduct,
  subtractQuantity,
  deleteAll,
  changePruductNumber,
} from "@/store/slices/shopCartReducer";
import { formatPrice, getStyleName } from "@/utils";
import CartButton from "../CartButton";
import styles from "./index.module.less";
import NumericInput from "./NumericInput ";

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

const PREFIX = "cart_panel";

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
    dispatch(addProduct({ item, size: item.size }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangePruductNumber = useCallback(
    (item: any) => (quantity: number) =>
      dispatch(changePruductNumber({ item, quantity })),
    [dispatch]
  );
  const itemStyle = useMemo(() => getStyleName(PREFIX, "cartItem", styles), []);
  return (
    <>
      {isExpand && <div className={styles.mask} />}
      <div
        data-expand={isExpand}
        className={classNames(styles.cartBtn, `${PREFIX}`, {
          [styles.show]: isExpand,
        })}
      >
        <CartButton
          className={getStyleName(PREFIX, "cartButton", styles)}
          count={count}
          onClick={onExpand}
        />
        <button
          className={getStyleName(PREFIX, "closeBtn", styles)}
          onClick={onClose}
        >
          X
        </button>
        <header className={styles.header}>
          <CartButton
            className={getStyleName(PREFIX, "cartButton2", styles)}
            count={count}
          />
          <span>Cart</span>
        </header>
        <main className={getStyleName(PREFIX, "cartList", styles)}>
          {list.map((item) => (
            <div key={`${item.sku}-${item.size}`} className={itemStyle}>
              <img className={styles.img} src={item.img1} alt={item.title} />
              <div className={styles.desc}>
                <div>{item.title}</div>
                <div>
                  {`${item.size} | ${item.style}`} <br />
                  Quantity: {item.quantity}
                </div>
              </div>
              <div className={styles.btnWrap}>
                <div>{`${item.currencyFormat}  ${formatPrice(
                  item.price
                )}`}</div>
                <div>
                  <button
                    className={getStyleName(
                      PREFIX,
                      "cartItem-subtract-btn",
                      styles,
                      styles.btn
                    )}
                    disabled={item.quantity <= 1}
                    onClick={() => handleSubtractQuantity(item)}
                  >
                    -
                  </button>
                  <NumericInput
                    className={`${PREFIX}-cartItem-quantity`}
                    value={item.quantity}
                    onChange={handleChangePruductNumber(item)}
                  />
                  <button
                    className={getStyleName(
                      PREFIX,
                      "cartItem-add-btn",
                      styles,
                      styles.btn
                    )}
                    onClick={() => handleAddProduct(item)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className={getStyleName(
                  PREFIX,
                  "cartItem-del-btn",
                  styles,
                  styles.delBtn
                )}
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
            className={getStyleName(PREFIX, "checkBtn", styles)}
            disabled={!count}
            onClick={handleClearAll}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}

export default memo(CartPanel);
