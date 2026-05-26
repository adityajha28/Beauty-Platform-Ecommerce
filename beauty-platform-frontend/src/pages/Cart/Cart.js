import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import Footer from "../../components/Footer/Footer";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

function CartItemsList({ items, type, increaseQty, decreaseQty, removeFromCart }) {
  if (!items.length) {
    return (
      <div className="cart-page-empty">
        <h3>No items in this cart</h3>
        <p>Your other cart is saved separately.</p>
        <Link to={type === "service" ? "/services" : "/products"} className="btn cart-shop-btn">
          Browse {type === "service" ? "services" : "products"}
        </Link>
      </div>
    );
  }

  return items.map((item) => (
    <div className="cart-page-item" key={item.id}>
      <img src={item.image} alt={item.name} className="cart-page-image" />
      <div className="cart-page-info">
        <h4>{item.name}</h4>
        <p>₹{item.price}</p>
        <div className="cart-page-qty">
          <button type="button" onClick={() => decreaseQty(item.id, type)}>−</button>
          <span>{item.quantity}</span>
          <button type="button" onClick={() => increaseQty(item.id, type)}>+</button>
        </div>
      </div>
      <button type="button" className="cart-page-remove" onClick={() => removeFromCart(item.id, type)}>
        Remove
      </button>
    </div>
  ));
}

export default function Cart() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const {
    cartType,
    setCartType,
    productItems,
    serviceItems,
    productSubtotal,
    serviceSubtotal,
    productCount,
    serviceCount,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const isService = cartType === "service";
  const activeItems = isService ? serviceItems : productItems;
  const activeSubtotal = isService ? serviceSubtotal : productSubtotal;

  useEffect(() => {
    if (tabParam === "services") setCartType("service");
    else if (tabParam === "products") setCartType("product");
  }, [tabParam, setCartType]);

  const switchTab = (type) => {
    setCartType(type);
    setSearchParams({ tab: type === "service" ? "services" : "products" }, { replace: true });
  };

  return (
    <>
      <Navbar />

      <main className="cart-page">
        <Container fluid="lg">
          <div className="page-head-wrap">
            <h1>Your carts</h1>
            <p>Products and services are checked out separately — like Amazon.</p>
          </div>

          <div className="cart-page-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={!isService}
              className={`cart-page-tab${!isService ? " active" : ""}`}
              onClick={() => switchTab("product")}
            >
              Products {productCount > 0 && `(${productCount})`}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isService}
              className={`cart-page-tab${isService ? " active" : ""}`}
              onClick={() => switchTab("service")}
            >
              Services {serviceCount > 0 && `(${serviceCount})`}
            </button>
          </div>

          <Row className="g-4">
            <Col lg={8}>
              <div className="cart-page-card">
                <CartItemsList
                  items={activeItems}
                  type={cartType}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  removeFromCart={removeFromCart}
                />
              </div>
            </Col>

            <Col lg={4}>
              <div className="cart-summary-box">
                <h3>{isService ? "Booking summary" : "Order summary"}</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>₹{activeSubtotal.toLocaleString()}</strong>
                </div>
                {productCount > 0 && serviceCount > 0 && (
                  <p className="cart-summary-hint">
                    {isService
                      ? `${productCount} product(s) saved in your product cart.`
                      : `${serviceCount} service(s) saved in your service cart.`}
                  </p>
                )}
                {activeItems.length > 0 && (
                  <Link
                    to={`/checkout?type=${isService ? "service" : "product"}`}
                    className="btn cart-checkout-btn w-100"
                  >
                    {isService ? "Proceed to book" : "Proceed to checkout"}
                  </Link>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}
