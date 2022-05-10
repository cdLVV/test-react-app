import ReactDOM from "react-dom/client";
import "./index.less";
import styles from "./index.module.less";
import { getA, setA } from "./utils";

console.log({ styles }, "foobar".includes("foo"));

async function test() {
  await Promise.resolve(1);
  console.log("2222");
}

test();
setA(11);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<div className={`${styles.aaa} bbb`}>123</div>);
