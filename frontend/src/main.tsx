import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import store from "./store/index.ts";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { GlobalLoader } from "./components/UI/GlobalLoader.tsx";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <GlobalLoader />
      <App />
    </Provider>
  </BrowserRouter>
);
