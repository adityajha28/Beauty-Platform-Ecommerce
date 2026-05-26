import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/animations.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { UserProvider } from "./context/UserContext";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>

    <Provider store={store}>

      <QueryClientProvider client={queryClient}>

        <BrowserRouter>

          <AuthProvider>

            <CartProvider>

              <WishlistProvider>

                <UserProvider>

                  <App />

                </UserProvider>

              </WishlistProvider>

            </CartProvider>

          </AuthProvider>

        </BrowserRouter>

      </QueryClientProvider>

    </Provider>

  </React.StrictMode>
);