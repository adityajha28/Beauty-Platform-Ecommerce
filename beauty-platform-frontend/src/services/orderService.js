import API from "./api";

export const getUserOrders = () =>
API.get("/orders/user");