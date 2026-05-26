const { v4: uuidv4 } = require('uuid');
const bookingsRepo = require('./bookings.repository');
const servicesService = require('../services/services.service');
const { DEFAULT_SLOTS } = require('../../constants/bookingSlots');
const { normalizeSlot, sanitizeSlotList } = require('../../utils/bookingSlotUtils');
const AppError = require('../../utils/appError');

const CANCELLED = new Set(['cancelled', 'refund_pending', 'refunded']);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function assertFutureDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new AppError('Invalid date format. Use YYYY-MM-DD', 400);
  }
  if (dateStr < todayISO()) {
    throw new AppError('Booking date cannot be in the past', 400);
  }
}

async function assertBookingsOpen() {
  const ops = await servicesService.getOperations();
  if (ops.servicesOpen === false) {
    throw new AppError(
      ops.serviceMessage || 'Service bookings are temporarily paused.',
      403
    );
  }
}

async function getConfiguredSlots() {
  const stored = await bookingsRepo.getBookingSlotSettings();
  return sanitizeSlotList(stored?.slots);
}

async function assertSlotAvailable(date, slot) {
  if (!slot) throw new AppError('Time slot is required', 400);
  const normalized = normalizeSlot(slot);
  const allowed = await getConfiguredSlots();
  if (!normalized || !allowed.includes(normalized)) {
    throw new AppError('Invalid time slot selected', 400);
  }

  const existing = await bookingsRepo.listByDate(date);
  const taken = existing
    .filter((b) => !CANCELLED.has(b.status))
    .map((b) => normalizeSlot(b.slot) || b.slot);

  const slotKey = normalized || slot;
  if (taken.includes(slotKey)) {
    throw new AppError('This slot is no longer available. Please choose another.', 409);
  }
}

function buildBookingRecord(payload, userId = null) {
  const id = payload.id || `bkg_${uuidv4()}`;
  const now = new Date().toISOString();

  const record = {
    id,
    ...(userId || payload.userId ? { userId: userId || payload.userId } : {}),
    type: payload.type || 'service',
    serviceName: payload.serviceName || '',
    items: payload.items || [],
    subtotal: Number(payload.subtotal) || 0,
    discount: Number(payload.discount) || 0,
    total: Number(payload.total ?? payload.amount) || 0,
    amount: Number(payload.amount ?? payload.total) || 0,
    ...(payload.couponCode ? { couponCode: payload.couponCode } : {}),
    paymentMethod: payload.paymentMethod || 'ONLINE',
    ...(payload.paymentId ? { paymentId: payload.paymentId } : {}),
    paymentStatus: payload.paymentStatus || 'pending',
    date: payload.date || payload.appointmentDate,
    bookingDate: payload.date || payload.appointmentDate,
    slot: payload.slot || payload.appointmentTime,
    ...(payload.address ? { address: payload.address } : {}),
    customer: payload.customer || {
      name: payload.fullName,
      phone: payload.phone,
    },
    status: payload.status || 'pending',
    notes: payload.notes || '',
    ...(payload.selectedServices ? { selectedServices: payload.selectedServices } : {}),
    createdAt: now,
    updatedAt: now,
  };

  return record;
}

exports.getConfiguredSlots = getConfiguredSlots;

exports.getAvailableSlots = async (date) => {
  assertFutureDate(date);
  const master = await getConfiguredSlots();
  const bookings = await bookingsRepo.listByDate(date);
  const taken = new Set(
    bookings.filter((b) => !CANCELLED.has(b.status)).map((b) => b.slot)
  );
  return master.filter((s) => !taken.has(s));
};

exports.adminGetBookingSlots = async () => {
  const slots = await getConfiguredSlots();
  const stored = await bookingsRepo.getBookingSlotSettings();
  return { slots, updatedAt: stored?.updatedAt || null };
};

exports.adminSetBookingSlots = async (body) => {
  if (!body || !Array.isArray(body.slots)) {
    throw new AppError('slots array is required', 400);
  }
  const cleaned = sanitizeSlotList(body.slots);
  if (!cleaned.length) {
    throw new AppError('At least one time slot is required', 400);
  }
  const value = await bookingsRepo.setBookingSlotSettings(cleaned);
  return { slots: value.slots, updatedAt: value.updatedAt };
};

exports.createSimpleBooking = async (body) => {
  await assertBookingsOpen();

  if (!body.fullName?.trim() || !body.phone?.trim()) {
    throw new AppError('Name and phone are required', 400);
  }
  if (!body.appointmentDate || !body.appointmentTime) {
    throw new AppError('Appointment date and time are required', 400);
  }

  assertFutureDate(body.appointmentDate);
  await assertSlotAvailable(body.appointmentDate, body.appointmentTime);

  const booking = buildBookingRecord({
    ...body,
    date: body.appointmentDate,
    slot: body.appointmentTime,
    serviceName: body.serviceName || 'Service enquiry',
    status: 'pending',
    customer: { name: body.fullName.trim(), phone: body.phone.trim() },
  });

  await bookingsRepo.create(booking);
  await bookingsRepo.createNotification({
    id: `ntf_${uuidv4()}`,
    type: 'booking',
    title: 'New booking request',
    message: `${booking.serviceName} · ${booking.date} ${booking.slot}`,
    payload: { id: booking.id },
    read: false,
    createdAt: booking.createdAt,
  });

  return booking;
};

exports.createCustomPackageBooking = async (body, userId = null) => {
  await assertBookingsOpen();

  const selected = body.selectedServices || [];
  if (selected.length < 4) {
    throw new AppError('Select at least 4 services for the package', 400);
  }

  const booking = buildBookingRecord(
    {
      ...body,
      type: 'package',
      serviceName: body.serviceName || `Custom Package (${selected.length} services)`,
      status: 'pending',
      isPackage: true,
    },
    userId
  );

  await bookingsRepo.create(booking);
  return booking;
};

exports.checkoutBooking = async (body, userId) => {
  await assertBookingsOpen();

  if (!userId) throw new AppError('Authentication required', 401);
  if (!body.date || !body.slot) {
    throw new AppError('Date and time slot are required', 400);
  }
  if (!body.address) {
    throw new AppError('Service address is required', 400);
  }
  if (!Array.isArray(body.items) || !body.items.length) {
    throw new AppError('No services in booking', 400);
  }

  assertFutureDate(body.date);
  await assertSlotAvailable(body.date, body.slot);

  const { resolved, subtotal: serverSubtotal } =
    await servicesService.resolveServicesFromCartItems(body.items);

  const discount = Math.min(Number(body.discount) || 0, serverSubtotal);
  const total = Math.max(0, serverSubtotal - discount);

  if (body.paymentMethod !== 'COD' && body.paymentStatus !== 'completed' && !body.paymentId) {
    throw new AppError('Payment verification required', 400);
  }

  const booking = buildBookingRecord(
    {
      ...body,
      items: resolved,
      subtotal: serverSubtotal,
      discount,
      total,
      amount: total,
      status:
        body.status ||
        (body.paymentMethod === 'COD' ? 'pending' : 'confirmed'),
      paymentStatus: body.paymentStatus || (body.paymentMethod === 'COD' ? 'pending_cod' : 'completed'),
    },
    userId
  );

  await bookingsRepo.create(booking);
  await bookingsRepo.createNotification({
    id: `ntf_${uuidv4()}`,
    type: 'booking',
    title: 'New service booking',
    message: `${booking.serviceName} · ${booking.date} ${booking.slot}`,
    payload: { id: booking.id },
    read: false,
    createdAt: booking.createdAt,
  });

  return booking;
};

exports.getUserBookings = (userId) => bookingsRepo.listByUserId(userId);

exports.getAllBookings = () => bookingsRepo.listAll();

exports.updateBookingStatus = async (id, status) => {
  const allowed = new Set(['pending', 'confirmed', 'completed', 'cancelled', 'refund_pending']);
  if (!allowed.has(status)) throw new AppError('Invalid status', 400);

  const existing = await bookingsRepo.getById(id);
  if (!existing) throw new AppError('Booking not found', 404);

  return bookingsRepo.updateStatus(id, status);
};
