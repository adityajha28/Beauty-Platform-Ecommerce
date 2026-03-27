import SwipeableProductCards from "../../components/cards/SwipeableProductCards";
import "./ProductsSection.css";

export default function ProductsSection({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="hm-products-sec">
      <div className="app-container">
        
        <div className="sec-header-flex">
          <div>
            <h2 className="sec-title">Featured <em>Products</em></h2>
            <p className="sec-subtitle">Curated premium cosmetics.</p>
          </div>
          <a href="/products" className="view-all-link">View All</a>
        </div>

        <SwipeableProductCards products={products} />

      </div>
    </section>
  );
}