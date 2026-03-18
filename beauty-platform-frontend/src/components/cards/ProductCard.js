import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useDispatch } from "react-redux";
import { addWishlist } from "../../store/wishlistSlice";
import toast from "react-hot-toast";
import ProductRating from "../ratings/ProductRating";

import "./ProductCard.css";

function ProductCard({ product }) {

  const { addToCart } = useCart();
  const dispatch = useDispatch();

  const handleAddToCart = () => {

    addToCart(product);

    toast.success(`${product.name} added to cart`);

  };

  const handleWishlist = () => {

    dispatch(addWishlist(product));

    toast("Added to wishlist ❤️");

  };

  return (

    <motion.div
      className="product-card h-100"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >

      <div className="product-img">

        <img src={product.image} alt={product.name} />

        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}

        <button
          className="wishlist-btn"
          onClick={handleWishlist}
        >
          ❤️
        </button>

      </div>

      <div className="product-body">

        <p className="product-category">
          {product.category || "Beauty"}
        </p>

        <h3>{product.name}</h3>

        <ProductRating rating={product.rating || 4} />

        <p className="price">
          ₹{product.price}
        </p>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="btn btn-r w-100"
          onClick={handleAddToCart}
        >

          Add To Cart

        </motion.button>

      </div>

    </motion.div>
  );
}

export default ProductCard;