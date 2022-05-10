import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store, persistedStore, PersistGate } from "./store";

import App from "./App";

import "./index.less";
import Loader from "./components/Loader";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate
      loading={
        <Loader
          className="fixed top-0 bottom-0 left-0 right-0 m-auto flex items-center justify-center"
          isLoading
        />
      }
      persistor={persistedStore}
    >
      <App />
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
