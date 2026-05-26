import API from "./api";

/**
 * POST /payments/create
 * Mock success when API unavailable (dev / offline)
 */
export async function processPayment({ amount, method, referenceType, referenceId, metadata = {} }) {
  const payload = {
    amount,
    method,
    referenceType,
    referenceId,
    metadata,
    currency: "INR",
  };

  try {
    const { data } = await API.post("/payments/create", payload);
    return {
      success: true,
      paymentId: data.paymentId,
      status: data.status || "completed",
      ...data,
    };
  } catch {
    await new Promise((r) => setTimeout(r, 1200));
    return {
      success: true,
      paymentId: `mock_pay_${Date.now()}`,
      status: method === "COD" ? "pending_cod" : "completed",
      mock: true,
    };
  }
}
