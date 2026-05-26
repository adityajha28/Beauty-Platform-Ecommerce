/** Local user data — syncs with API when backend is ready */

const KEYS = {
  profile: "oraya_user_profile",
  addresses: "oraya_user_addresses",
  orders: "oraya_user_orders",
  bookings: "oraya_user_bookings",
  couponUsage: "oraya_coupon_usage",
  onboardingDone: "oraya_onboarding_done",
  userName: "bb_user_name",
  phone: "bb_user_phone",
  isNewUser: "oraya_is_new_user",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
}

export const userStorage = {
  getProfile: () => read(KEYS.profile, null),
  setProfile: (p) => write(KEYS.profile, p),

  getAddresses: () => read(KEYS.addresses, []),
  setAddresses: (a) => write(KEYS.addresses, a),

  getOrders: () => read(KEYS.orders, []),
  setOrders: (o) => write(KEYS.orders, o),
  addOrder: (order) => {
    const list = userStorage.getOrders();
    write(KEYS.orders, [order, ...list]);
  },

  getBookings: () => read(KEYS.bookings, []),
  setBookings: (b) => write(KEYS.bookings, b),
  addBooking: (booking) => {
    const list = userStorage.getBookings();
    write(KEYS.bookings, [booking, ...list]);
  },

  getCouponUsage: () => read(KEYS.couponUsage, { service: 0, product: 0 }),
  setCouponUsage: (u) => write(KEYS.couponUsage, u),
  incrementCouponUsage: (type) => {
    const u = userStorage.getCouponUsage();
    u[type] = (u[type] || 0) + 1;
    write(KEYS.couponUsage, u);
    return u;
  },

  isOnboardingDone: () => localStorage.getItem(KEYS.onboardingDone) === "true",
  setOnboardingDone: (v = true) => localStorage.setItem(KEYS.onboardingDone, v ? "true" : "false"),

  getUserName: () => localStorage.getItem(KEYS.userName) || "",
  setUserName: (n) => localStorage.setItem(KEYS.userName, n),

  getPhone: () => localStorage.getItem(KEYS.phone) || "",
  setPhone: (p) => localStorage.setItem(KEYS.phone, p),

  getIsNewUser: () => localStorage.getItem(KEYS.isNewUser) === "true",
  setIsNewUser: (v) => localStorage.setItem(KEYS.isNewUser, v ? "true" : "false"),

  clearUserData: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },

  /**
   * Start or switch a customer session (signup, OTP verify, or different phone login).
   * Clears stale local data when the phone changes or resetLocal is true (new signup).
   */
  beginCustomerSession({ phone, name, email, isNewUser = false, resetLocal = false } = {}) {
    const prevPhone = userStorage.getPhone();
    const phoneChanged = Boolean(phone && prevPhone && prevPhone !== phone);
    const shouldReset = resetLocal || phoneChanged || isNewUser;

    if (shouldReset) {
      userStorage.clearUserData();
    }

    const keptName = !shouldReset ? userStorage.getDisplayName() : "";
    const keptEmail = !shouldReset ? userStorage.getProfile()?.email || "" : "";
    const finalName = (name || keptName || "").trim();
    const finalEmail = email !== undefined && email !== null ? email : keptEmail;

    if (phone) userStorage.setPhone(phone);
    if (finalName) userStorage.setUserName(finalName);
    userStorage.setProfile({
      name: finalName,
      email: finalEmail,
      phone: phone || "",
      createdAt: new Date().toISOString(),
    });
    userStorage.setIsNewUser(isNewUser);
    if (isNewUser) userStorage.setOnboardingDone(false);
  },

  /** Prefer profile name, then dedicated userName key */
  getDisplayName: () => {
    const profile = userStorage.getProfile();
    return (profile?.name || userStorage.getUserName() || "").trim();
  },
};

export default userStorage;
