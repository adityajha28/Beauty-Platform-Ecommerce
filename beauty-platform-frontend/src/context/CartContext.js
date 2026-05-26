import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getOperationsStatus,
  DEFAULT_OPERATIONS,
  KEYS,
} from "../services/cmsStorage";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

function sumQty(items) {
  return items.reduce((s, item) => s + item.quantity, 0);
}

function sumPrice(items) {
  return items.reduce(
    (s, item) => s + Number(item.price) * Number(item.quantity),
    0
  );
}

function updateList(list, item) {
  const existing = list.find((p) => p.id === item.id);
  if (existing) {
    return list.map((p) =>
      p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
    );
  }
  return [...list, { ...item, quantity: item.quantity || 1 }];
}

export const CartProvider = ({ children }) => {
  const [productItems, setProductItems] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  /** Which cart tab is active in the panel / cart page */
  const [cartType, setCartType] = useState("product");
  const [operations, setOperations] = useState(() => getOperationsStatus());

  useEffect(() => {
    const handleLocal = (e) => setOperations(e.detail || getOperationsStatus());
    const handleStorage = (e) => {
      if (e.key === KEYS.operations) setOperations(getOperationsStatus());
    };
    window.addEventListener("oraya:operations", handleLocal);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("oraya:operations", handleLocal);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const isOperational = useCallback(
    (type) => {
      if (type === "service") return operations.servicesOpen !== false;
      return operations.productsOpen !== false;
    },
    [operations]
  );

  const blockedMessage = useCallback(
    (type) =>
      type === "service"
        ? operations.serviceMessage || DEFAULT_OPERATIONS.serviceMessage
        : operations.productMessage || DEFAULT_OPERATIONS.productMessage,
    [operations]
  );

  const getItemsByType = useCallback(
    (type) => (type === "service" ? serviceItems : productItems),
    [productItems, serviceItems]
  );

  const setItemsByType = useCallback((type, updater) => {
    if (type === "service") {
      setServiceItems(updater);
    } else {
      setProductItems(updater);
    }
  }, []);

  const addToCart = useCallback(
    (item, type = "product") => {
      if (!isOperational(type)) {
        toast.error(blockedMessage(type));
        return false;
      }

      setCartType(type);
      setItemsByType(type, (prev) => updateList(prev, item));
      setCartOpen(true);
      return true;
    },
    [isOperational, blockedMessage, setItemsByType]
  );

  const removeFromCart = useCallback(
    (id, type = cartType) => {
      setItemsByType(type, (prev) => prev.filter((item) => item.id !== id));
    },
    [cartType, setItemsByType]
  );

  const increaseQty = useCallback(
    (id, type = cartType) => {
      setItemsByType(type, (prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    },
    [cartType, setItemsByType]
  );

  const decreaseQty = useCallback(
    (id, type = cartType) => {
      setItemsByType(type, (prev) =>
        prev
          .map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    [cartType, setItemsByType]
  );

  const clearCart = useCallback(
    (type) => {
      if (type === "product") setProductItems([]);
      else if (type === "service") setServiceItems([]);
      else if (type === "all") {
        setProductItems([]);
        setServiceItems([]);
      } else {
        setItemsByType(cartType, () => []);
      }
    },
    [cartType, setItemsByType]
  );

  const productSubtotal = useMemo(() => sumPrice(productItems), [productItems]);
  const serviceSubtotal = useMemo(() => sumPrice(serviceItems), [serviceItems]);
  const productCount = useMemo(() => sumQty(productItems), [productItems]);
  const serviceCount = useMemo(() => sumQty(serviceItems), [serviceItems]);
  const cartCount = productCount + serviceCount;

  const cartItems = useMemo(
    () => (cartType === "service" ? serviceItems : productItems),
    [cartType, productItems, serviceItems]
  );

  const subtotal = useMemo(
    () => (cartType === "service" ? serviceSubtotal : productSubtotal),
    [cartType, productSubtotal, serviceSubtotal]
  );

  const value = {
    productItems,
    serviceItems,
    productCartItems: productItems,
    serviceCartItems: serviceItems,
    cartItems,
    cart: cartItems,
    cartType,
    setCartType,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    subtotal,
    productSubtotal,
    serviceSubtotal,
    cartCount,
    productCount,
    serviceCount,
    getItemsByType,
    operations,
    isOperational,
    blockedMessage,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
