import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import ProductCard from "../../components/cards/ProductCard";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import BottomNav from "../../components/BottomNav/BottomNav";

import SkeletonCard from "../../components/loaders/SkeletonCard";
import SearchBar from "../../components/search/SearchBar";

import productService from "../../services/productService";

import "./Products.css";

function Products() {

  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {

      const res = await productService.getProducts();

      const data = res.data || [];

      setProducts(data);

      // first batch of products
      setVisibleProducts(data.slice(0, 8));

    } catch (error) {

      console.error("Error loading products:", error);

    } finally {

      setLoading(false);

    }
  };

  const loadMoreProducts = () => {

    const nextProducts = products.slice(
      visibleProducts.length,
      visibleProducts.length + 8
    );

    setVisibleProducts(prev => [...prev, ...nextProducts]);
  };

  // search filter
  const filteredProducts = visibleProducts.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <section className="products-page section">

        <div className="wrap">

          <h1 className="page-title">Beauty Products</h1>

          {/* Search Bar */}
          <SearchBar onSearch={setSearchQuery} />

          {loading ? (

            <div className="products-grid">

              {Array(6).fill().map((_, i) => (
                <SkeletonCard key={i} />
              ))}

            </div>

          ) : (

            <InfiniteScroll
              dataLength={visibleProducts.length}
              next={loadMoreProducts}
              hasMore={visibleProducts.length < products.length}
              loader={<h4 className="loading-text">Loading...</h4>}
            >

              <div className="products-grid">

                {filteredProducts.map(product => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                ))}

              </div>

            </InfiniteScroll>

          )}

        </div>

      </section>

      <Footer />

      <BottomNav />
    </>
  );
}

export default Products;