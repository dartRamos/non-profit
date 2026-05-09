import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Analytics } from "@vercel/analytics/react";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "CAD",
      }}
    >
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </PayPalScriptProvider>
  </React.StrictMode>
);