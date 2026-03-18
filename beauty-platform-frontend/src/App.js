// src/App.js
import { Routes, Route } from "react-router-dom";

/* ── User pages ── */
import Home     from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Cart     from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Profile  from "./pages/Profile/Profile";
import Careers  from "./pages/Careers/Careers";

/* ── Auth ── */
import AuthPage from "./auth/pages/AuthPage";

/* ── Route guards ── */
import ProtectedRoute from "./auth/components/ProtectedRoute";
import AdminRoute     from "./auth/components/AdminRoute";

/* ── Admin pages ── */
import Dashboard     from "./admin/pages/Dashboard/Dashboard";
import AdminProducts from "./admin/pages/Products/Products";
import AdminServices from "./admin/pages/Services/Services";
import AdminBookings from "./admin/pages/Bookings/Bookings";
import AdminOrders   from "./admin/pages/Orders/Orders";
import AdminUsers    from "./admin/pages/Users/Users";

/* ── Shared UI ── */
import NotificationProvider from "./components/notifications/NotificationProvider";
import PageTransition       from "./components/animations/PageTransition";

/* ── 404 ── */
import NotFound from "./pages/NotFound/NotFound";

/* ════════════════════════════════════════════════════════════
   ROUTE MAP

   Public             — no auth needed
   Protected (user)   — wrapped in <ProtectedRoute>
                        redirects to /auth?redirect=<path>
                        if no valid customer token
   Admin              — wrapped in <AdminRoute>
                        redirects to /auth?redirect=<path>&mode=admin
                        if no valid admin token
   * (catch-all)      — 404 page
════════════════════════════════════════════════════════════ */
function App() {
  return (
    <>
      {/* Global notification toasts (app-wide, not auth-specific) */}
      <NotificationProvider />

      <Routes>

        {/* ════════════════════════
            PUBLIC ROUTES
            No authentication required
        ════════════════════════ */}

        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />

        <Route
          path="/products"
          element={
            <PageTransition>
              <Products />
            </PageTransition>
          }
        />

        <Route
          path="/careers"
          element={
            <PageTransition>
              <Careers />
            </PageTransition>
          }
        />

        {/* ════════════════════════
            AUTH PAGE
            Single route handles Customer login/signup
            AND Admin login — mode switched via UI or ?mode=admin
            Guards already-logged-in users and redirects them away.
        ════════════════════════ */}

        <Route path="/auth" element={<AuthPage />} />

        {/* ════════════════════════
            PROTECTED USER ROUTES
            Requires valid customer JWT.
            Unauthorized → /auth?redirect=<path>
        ════════════════════════ */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Cart />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Checkout />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        {/* ════════════════════════
            ADMIN ROUTES
            Requires valid admin JWT (role === 'admin').
            Unauthorized → /auth?redirect=<path>&mode=admin
            Customer token → redirected to /
        ════════════════════════ */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <AdminRoute>
              <AdminServices />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        {/* ════════════════════════
            404 CATCH-ALL
            Must always be last.
        ════════════════════════ */}

        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

export default App;