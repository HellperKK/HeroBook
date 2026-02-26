import ReactDOM from "react-dom/client";
import "./styles.css";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";
import "./mains.scss";
import "./translations/i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<Provider store={store}>
		<App />
	</Provider>,
);
