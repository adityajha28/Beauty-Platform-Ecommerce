import API from "./api";
import { userStorage } from "../utils/userStorage";
import { pushAdminNotification } from "./cmsStorage";

export const getUserOrders = async () => {
  try {
    const { data } = await API.get("/orders/user");
    const orders = data?.orders ?? data ?? [];
    if (Array.isArray(orders) && orders.length) userStorage.setOrders(orders);
    return orders.length ? orders : userStorage.getOrders();
  } catch {
    return userStorage.getOrders();
  }
};

/**
 * POST /orders — sends order to admin dashboard after payment
 */
export const createOrder = async (orderPayload) => {
  const order = {
    id: `ord_${Date.now()}`,
    ...orderPayload,
    status: orderPayload.status || "confirmed",
    createdAt: new Date().toISOString(),
  };

  try {
    const { data } = await API.post("/orders", orderPayload);
    const saved = data?.order ?? { ...order, ...data };
    userStorage.addOrder(saved);
    pushAdminNotification({
      type: "order",
      title: "New product order",
      message: `${saved.customer?.name || "Customer"} · ₹${saved.total}`,
      payload: saved,
    });
    return saved;
  } catch {
    userStorage.addOrder(order);
    pushAdminNotification({
      type: "order",
      title: "New product order",
      message: `₹${order.total}`,
      payload: order,
    });
    return order;
  }
};

export const getOrderById = (id) => {
  return userStorage.getOrders().find((o) => o.id === id);
};
