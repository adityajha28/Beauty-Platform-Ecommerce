import { useEffect } from "react";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import useOperationsStatus from "../../hooks/useOperationsStatus";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import ProductCheckout from "./ProductCheckout";
import ServiceCheckout from "./ServiceCheckout";

/** Routes /checkout to product or service flow based on ?type= */
export default function CheckoutRouter() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const { cartType, setCartType, productItems, serviceItems } = useCart();
  const ops = useOperationsStatus();

  const checkoutType =
    typeParam === "service" || typeParam === "product" ? typeParam : cartType;
  const isService = checkoutType === "service";
  const items = isService ? serviceItems : productItems;

  useEffect(() => {
    if (typeParam === "service" || typeParam === "product") {
      setCartType(typeParam);
    }
  }, [typeParam, setCartType]);

  if (!items.length) {
    return (
      <Navigate
        to={`/cart?tab=${isService ? "services" : "products"}`}
        replace
      />
    );
  }

  const blocked =
    (isService && ops.servicesOpen === false) ||
    (!isService && ops.productsOpen === false);

  if (blocked) {
    const message = isService
      ? ops.serviceMessage || "Service bookings are temporarily paused."
      : ops.productMessage || "Product orders are temporarily paused.";
    return (
      <>
        <Navbar />
        <main
          className="checkout-app"
          style={{
            display: "grid",
            placeItems: "center",
            padding: "2rem 1rem",
            minHeight: "60dvh",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "2rem 1.5rem",
              maxWidth: 420,
              textAlign: "center",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fef2f2",
                color: "#b91c1c",
                display: "grid",
                placeItems: "center",
                fontSize: "1.75rem",
                margin: "0 auto 1rem",
              }}
            >
              ⏸️
            </div>
            <h1 style={{ fontFamily: "var(--serif)", margin: "0 0 0.5rem" }}>
              {isService ? "Bookings paused" : "Orders paused"}
            </h1>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.9rem",
                margin: "0 0 1.25rem",
              }}
            >
              {message}
            </p>
            <Link
              to="/"
              className="uc-btn-primary"
              style={{
                display: "block",
                textDecoration: "none",
                textAlign: "center",
                padding: "0.75rem",
                borderRadius: 10,
                background: "var(--r)",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              Back to home
            </Link>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return isService ? <ServiceCheckout /> : <ProductCheckout />;
}
