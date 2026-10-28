import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "@/components/App/App";
import { store } from "@/redux";

const container = document.getElementById("root");

if (!container) {
    throw new Error("Root element not found");
}

createRoot(container).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
);
