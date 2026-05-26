import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import { tokenStorage } from "../auth/services/authService";
import { userStorage } from "../utils/userStorage";
import * as userService from "../services/userService";
import { fetchActiveCoupons } from "../services/couponService";
import { getUserOrders } from "../services/orderService";
import { getUserBookings } from "../services/bookingService";
import { getUserRefunds } from "../services/refundService";

const UserContext = createContext(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!tokenStorage.getAccess() && tokenStorage.getRole() === "customer";
  const needsOnboarding = isLoggedIn && !userStorage.isOnboardingDone() && addresses.length === 0;

  const hydrate = useCallback(async () => {
    if (!tokenStorage.getAccess() || tokenStorage.getRole() === "admin") return;

    setLoading(true);
    try {
      const localProfile = userStorage.getProfile();
      const [p, addr, ord, bkg, ref, cpn] = await Promise.all([
        userService.fetchProfile(),
        userService.fetchAddresses(),
        getUserOrders(),
        getUserBookings(),
        getUserRefunds(),
        fetchActiveCoupons(),
      ]);
      const merged = {
        ...(localProfile || {}),
        ...(p || {}),
        name: p?.name || localProfile?.name || userStorage.getDisplayName(),
        phone: p?.phone || localProfile?.phone || userStorage.getPhone(),
        email: p?.email ?? localProfile?.email ?? "",
      };
      setProfile(merged);
      userStorage.setProfile(merged);
      if (merged.name) userStorage.setUserName(merged.name);
      setAddresses(addr || userStorage.getAddresses());
      setOrders(ord || []);
      setBookings(bkg || []);
      setRefunds(ref || []);
      setCoupons(cpn || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) hydrate();
    else {
      setProfile(null);
      setAddresses([]);
      setOrders([]);
      setBookings([]);
      setRefunds([]);
    }
  }, [isLoggedIn, hydrate]);

  useEffect(() => {
    const onAuthChange = () => {
      if (!tokenStorage.getAccess() || tokenStorage.getRole() === "admin") {
        setProfile(null);
        setAddresses([]);
        setOrders([]);
        setBookings([]);
        setRefunds([]);
        return;
      }
      setProfile(userStorage.getProfile());
      hydrate();
    };
    window.addEventListener("oraya-auth-changed", onAuthChange);
    return () => window.removeEventListener("oraya-auth-changed", onAuthChange);
  }, [hydrate]);

  const saveAddress = useCallback(async (address) => {
    const saved = await userService.addAddress(address);
    const list = userStorage.getAddresses();
    setAddresses(list);
    if (address.isDefault || list.length === 1) userStorage.setOnboardingDone(true);
    return saved;
  }, []);

  const updateProfileLocal = useCallback(async (data) => {
    const updated = await userService.updateProfile(data);
    setProfile(updated);
    return updated;
  }, []);

  const refreshOrders = useCallback(async () => {
    const ord = await getUserOrders();
    setOrders(ord);
    return ord;
  }, []);

  const refreshBookings = useCallback(async () => {
    const bkg = await getUserBookings();
    setBookings(bkg);
    return bkg;
  }, []);

  const refreshRefunds = useCallback(async () => {
    const ref = await getUserRefunds();
    setRefunds(ref);
    return ref;
  }, []);

  const defaultAddress = useMemo(
    () => addresses.find((a) => a.isDefault) || addresses[0] || null,
    [addresses]
  );

  const value = useMemo(
    () => ({
      profile,
      addresses,
      defaultAddress,
      orders,
      bookings,
      refunds,
      coupons,
      loading,
      isLoggedIn,
      needsOnboarding,
      hydrate,
      saveAddress,
      updateProfile: updateProfileLocal,
      refreshOrders,
      refreshBookings,
      refreshRefunds,
      userName: profile?.name || userStorage.getDisplayName(),
      phone: profile?.phone || userStorage.getPhone(),
    }),
    [
      profile,
      addresses,
      defaultAddress,
      orders,
      bookings,
      refunds,
      coupons,
      loading,
      isLoggedIn,
      needsOnboarding,
      hydrate,
      saveAddress,
      updateProfileLocal,
      refreshOrders,
      refreshBookings,
      refreshRefunds,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;
