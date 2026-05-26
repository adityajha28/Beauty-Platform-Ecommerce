import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import { useUser } from "../../context/UserContext";
import { userStorage } from "../../utils/userStorage";
import { SERVICE_AREA_LABEL } from "../../constants/location";
import "./Account.css";

const MENU_SECTIONS = [
  {
    title: "Your orders",
    items: [
      { to: "/profile?tab=orders", label: "Your Orders", sub: "Track product deliveries", icon: "📦" },
      { to: "/profile?tab=bookings", label: "Your Bookings", sub: "Salon & at-home services", icon: "✨" },
      { to: "/profile?tab=refunds", label: "Returns & Refunds", sub: "Refund requests", icon: "↩️" },
    ],
  },
  {
    title: "Account settings",
    items: [
      { to: "/profile?tab=overview", label: "Profile & Contact", sub: "Name, phone, email", icon: "👤" },
      { to: "/profile?tab=addresses", label: "Your Addresses", sub: SERVICE_AREA_LABEL, icon: "📍" },
      { to: "/profile?tab=coupons", label: "Coupons & Offers", sub: "First-user rewards", icon: "🎁" },
    ],
  },
  {
    title: "Shop",
    items: [
      { to: "/wishlist", label: "Wishlist", sub: "Saved products", icon: "❤️" },
      { to: "/cart", label: "Cart", sub: "Items ready to checkout", icon: "🛒" },
    ],
  },
];

export default function AccountMenu() {
  const { userName, defaultAddress, orders, bookings } = useUser();
  const name = userName || userStorage.getDisplayName() || "Guest";
  const initial = name.trim().charAt(0).toUpperCase() || "O";

  return (
    <>
      <Navbar />
      <main className="account-page">
        <motion.div
          className="account-hero"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="account-av">{initial}</div>
          <div>
            <h1>Hello, {name.split(" ")[0]}</h1>
            <p>{defaultAddress ? `${defaultAddress.label} · ${defaultAddress.pincode}` : `Add address in ${SERVICE_AREA_LABEL}`}</p>
          </div>
        </motion.div>

        <div className="account-stats">
          <Link to="/profile?tab=orders" className="account-stat">
            <strong>{orders.length}</strong>
            <span>Orders</span>
          </Link>
          <Link to="/profile?tab=bookings" className="account-stat">
            <strong>{bookings.length}</strong>
            <span>Bookings</span>
          </Link>
          <Link to="/profile?tab=coupons" className="account-stat">
            <strong>🎁</strong>
            <span>Offers</span>
          </Link>
        </div>

        {MENU_SECTIONS.map((section, si) => (
          <section key={section.title} className="account-section">
            <h2>{section.title}</h2>
            <div className="account-list">
              {section.items.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: si * 0.05 + i * 0.04 }}
                >
                  <Link to={item.to} className="account-row">
                    <span className="account-row-ico">{item.icon}</span>
                    <span className="account-row-text">
                      <strong>{item.label}</strong>
                      <small>{item.sub}</small>
                    </span>
                    <span className="account-row-chev">›</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </main>
      <BottomNav />
    </>
  );
}
