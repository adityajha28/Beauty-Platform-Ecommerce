import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/** Syncs ?mode=login|signup from URL to auth tab */
export default function AuthTabSync() {
  const location = useLocation();
  const { setUserTab, setView, view } = useAuth();

  useEffect(() => {
    const mode = new URLSearchParams(location.search).get("mode");
    if (mode === "signup" || mode === "login") {
      setUserTab(mode);
      if (view !== "otp" && view !== "success") {
        setView("phone");
      }
    }
  }, [location.search, setUserTab, setView, view]);

  return null;
}
