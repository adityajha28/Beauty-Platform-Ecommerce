import API from "./api";
import { userStorage } from "../utils/userStorage";
import { DEFAULT_CITY, DEFAULT_STATE, DEFAULT_PINCODE } from "../constants/location";

/** GET /users/me */
export async function fetchProfile() {
  try {
    const { data } = await API.get("/users/me");
    if (data?.user) {
      userStorage.setProfile(data.user);
      if (data.user.name) userStorage.setUserName(data.user.name);
      if (data.user.phone) userStorage.setPhone(data.user.phone);
    }
    return data?.user ?? userStorage.getProfile();
  } catch {
    return userStorage.getProfile();
  }
}

/** PUT /users/me */
export async function updateProfile(payload) {
  try {
    const { data } = await API.put("/users/me", payload);
    const user = data?.user ?? { ...userStorage.getProfile(), ...payload };
    userStorage.setProfile(user);
    if (user.name) userStorage.setUserName(user.name);
    return user;
  } catch {
    const user = { ...userStorage.getProfile(), ...payload };
    userStorage.setProfile(user);
    if (payload.name) userStorage.setUserName(payload.name);
    return user;
  }
}

/** GET /users/addresses */
export async function fetchAddresses() {
  try {
    const { data } = await API.get("/users/addresses");
    const list = data?.addresses ?? [];
    userStorage.setAddresses(list);
    return list;
  } catch {
    return userStorage.getAddresses();
  }
}

/** POST /users/addresses */
export async function addAddress(address) {
  const enriched = {
    id: address.id || `addr_${Date.now()}`,
    label: address.label || "Home",
    line1: address.line1,
    line2: address.line2 || "",
    landmark: address.landmark || "",
    city: address.city || DEFAULT_CITY,
    state: address.state || DEFAULT_STATE,
    pincode: address.pincode || DEFAULT_PINCODE,
    isDefault: address.isDefault ?? false,
  };

  try {
    const { data } = await API.post("/users/addresses", enriched);
    const saved = data?.address ?? enriched;
    const list = userStorage.getAddresses();
    const next = address.isDefault
      ? [saved, ...list.map((a) => ({ ...a, isDefault: false }))]
      : [...list, saved];
    userStorage.setAddresses(next);
    return saved;
  } catch {
    const list = userStorage.getAddresses();
    const next = enriched.isDefault
      ? [enriched, ...list.map((a) => ({ ...a, isDefault: false }))]
      : [...list, enriched];
    userStorage.setAddresses(next);
    if (enriched.isDefault) userStorage.setOnboardingDone(true);
    return enriched;
  }
}

export function getDefaultAddress() {
  const list = userStorage.getAddresses();
  return list.find((a) => a.isDefault) || list[0] || null;
}
