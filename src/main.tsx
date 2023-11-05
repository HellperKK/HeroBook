import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { enableMapSet } from 'immer'

import { store } from "./store/store";
import Editor from "./Editor";

enableMapSet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <Editor />
  </Provider>
);
