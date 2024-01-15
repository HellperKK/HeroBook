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
import Settings from "./pages/Settings";

enableMapSet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
