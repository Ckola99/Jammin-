import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import store from "./app/store";
import "./index.css"

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<HelmetProvider>
			<Provider store={store}>
				<App />
			</Provider>
		</HelmetProvider>
	</StrictMode>
);
