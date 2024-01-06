import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { enableMapSet } from 'immer'
import {
  Route,
  BrowserRouter,
  Routes
} from "react-router-dom";

import { store } from "./store/store";
import Editor from "./pages/Editor";
import Main from "./pages/Main";

enableMapSet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
