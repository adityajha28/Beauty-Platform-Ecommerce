// src/App.js
import { Routes, Route, useLocation } from "react-router-dom";

/* ── User pages ── */
import Home     from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Services from "./pages/Services/Services"; // ✅ ADDED SERVICES IMPORT
import Cart     from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Profile  from "./pages/Profile/Profile";
import Careers  from "./pages/Careers/Careers";

/* ── Auth ── */
import AuthPage from "./auth/pages/AuthPage";
import AdminAuthPage from "./auth/pages/AdminAuthPage"; 

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
import WhatsappButton       from "./components/WhatsappButton/WhatsappButton";

/* ── 404 ── */
import NotFound from "./pages/NotFound/NotFound";

/* ════════════════════════════════════════════════════════════
   ROUTE MAP

   Public             — no auth needed
   Protected (user)   — wrapped in <ProtectedRoute>
                        redirects to /auth?redirect=<path>
                        if no valid customer token
   Admin              — wrapped in <AdminRoute>
                        redirects to /admin/login?redirect=<path>  
                        if no valid admin token
   * (catch-all)      — 404 page
════════════════════════════════════════════════════════════ */
function App() {
  const location = useLocation();

  // Logic to hide WhatsApp on Admin and 404 pages
  // ✅ ADDED "/services" TO VALID PATHS
  const validUserPaths = ["/", "/products", "/services", "/careers", "/auth", "/cart", "/checkout", "/profile"];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isNotFound = !validUserPaths.includes(location.pathname) && !isAdminRoute;
  const showWhatsapp = !isAdminRoute && !isNotFound;

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

        {/* ✅ ADDED SERVICES ROUTE */}
        <Route
          path="/services"
          element={
            <PageTransition>
              <Services />
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
            AUTH PAGES
            /auth         → Customer login/signup
            /admin/login  → Admin login (separate & secure)
        ════════════════════════ */}

        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminAuthPage />} /> 

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
            Unauthorized → /admin/login?redirect=<path>  
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

      {/* RENDER CONDITIONALLY */}
      {showWhatsapp && <WhatsappButton />}
    </>
  );
}

export default App;