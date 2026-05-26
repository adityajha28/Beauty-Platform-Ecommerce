// src/App.js
import { Routes, Route, useLocation } from "react-router-dom";

/* ── User pages ── */
import Home     from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Services from "./pages/Services/Services"; // ✅ ADDED SERVICES IMPORT
import Cart     from "./pages/Cart/Cart";
import CheckoutRouter from "./pages/Checkout/CheckoutRouter";
import CheckoutSuccess from "./pages/Checkout/CheckoutSuccess";
import Profile  from "./pages/Profile/Profile";
import Onboarding from "./pages/Onboarding/Onboarding";
import AccountMenu from "./pages/Account/AccountMenu";
import Careers  from "./pages/Careers/Careers";
import Wishlist from "./pages/Wishlist/Wishlist";

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
import AdminOffers   from "./admin/pages/Offers/Offers";
import AdminReviews  from "./admin/pages/Reviews/Reviews";
import AdminContent  from "./admin/pages/Content/Content";
import AdminOperations from "./admin/pages/Operations/Operations";
import AdminTimeSlots from "./admin/pages/TimeSlots/TimeSlots";

/* ── Shared UI ── */
import NotificationProvider from "./components/notifications/NotificationProvider";
import PageTransition       from "./components/animations/PageTransition";
import FloatingEdgeStack    from "./components/FloatingEdgeStack/FloatingEdgeStack";

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
  const validUserPaths = ["/", "/products", "/services", "/careers", "/wishlist", "/auth", "/cart", "/checkout", "/checkout/success", "/profile", "/account", "/onboarding"];
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

        <Route
          path="/wishlist"
          element={
            <PageTransition>
              <Wishlist />
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
          path="/onboarding"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Onboarding />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <PageTransition>
                <AccountMenu />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PageTransition>
                <CheckoutRouter />
              </PageTransition>
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout/success"
          element={
            <ProtectedRoute>
              <PageTransition>
                <CheckoutSuccess />
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

        <Route
          path="/admin/offers"
          element={
            <AdminRoute>
              <AdminOffers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/reviews"
          element={
            <AdminRoute>
              <AdminReviews />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/content"
          element={
            <AdminRoute>
              <AdminContent />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/operations"
          element={
            <AdminRoute>
              <AdminOperations />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/time-slots"
          element={
            <AdminRoute>
              <AdminTimeSlots />
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
      {showWhatsapp && <FloatingEdgeStack />}
    </>
  );
}

export default App;