import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { enableMapSet } from 'immer'
import {
  Route,
  HashRouter,
  Routes,
} from "react-router-dom";

import { store } from "./store/store";
import Editor from "./pages/Editor";
import Main from "./pages/Main";
import Settings from "./pages/Settings";
import Player from "./pages/Player";
import PlayerMenu from "./pages/PlayerMenu";
import PlayerLoad from "./pages/PlayerLoad";
import AssetsManager from "./pages/AssetsManager";

import "./main.css";

enableMapSet();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/editor/:id" element={<Editor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/player/menu" element={<PlayerMenu />} />
        <Route path="/player/load" element={<PlayerLoad />} />
        <Route path="/player/:id" element={<Player loaded={false}/>} />
        <Route path="/playerLoad/:id" element={<Player loaded={true}/>} />
        <Route path="/assets" element={<AssetsManager />} />
      </Routes>
    </HashRouter>
  </Provider>
);
