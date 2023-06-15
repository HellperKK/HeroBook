import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { enableMapSet } from 'immer'

import App from "./App";

import { store } from "./store/store";

enableMapSet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
