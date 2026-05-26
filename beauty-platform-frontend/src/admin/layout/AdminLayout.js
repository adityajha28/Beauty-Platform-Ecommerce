import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [sidebarOpen, closeSidebar]);

  return (
    <div className="admin-layout">
      <button
        type="button"
        className={`admin-sidebar-backdrop${sidebarOpen ? " visible" : ""}`}
        aria-label="Close menu"
        onClick={closeSidebar}
      />

      <AdminSidebar open={sidebarOpen} onNavigate={closeSidebar} />

      <div className="admin-main">
        <AdminTopbar onMenuToggle={toggleSidebar} menuOpen={sidebarOpen} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
