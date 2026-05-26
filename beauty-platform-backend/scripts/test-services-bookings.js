/**
 * Integration smoke test for services + bookings APIs.
 * Run: node scripts/test-services-bookings.js
 */
require('dotenv').config();

const BASE = process.env.API_BASE || 'http://localhost:5000/api';

let passed = 0;
let failed = 0;

function ok(name) {
  passed += 1;
  console.log(`  ✓ ${name}`);
}

function fail(name, detail) {
  failed += 1;
  console.log(`  ✗ ${name}: ${detail}`);
}

async function req(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, data };
}

async function main() {
  console.log('\n=== Services & Bookings API Test ===\n');
  console.log(`Base URL: ${BASE}\n`);

  /* Health */
  try {
    const h = await req('GET', '/health'.replace('/api', '') === '/health' ? '/health' : '/health');
  } catch (e) {
    fail('Server reachable', e.message);
    console.log('\nStart backend: npm run dev\n');
    process.exit(1);
  }

  const health = await fetch('http://localhost:5000/api/health');
  if (health.ok) ok('GET /api/health');
  else fail('GET /api/health', health.status);

  /* Public services */
  const cats = await req('GET', '/services/categories');
  if (cats.status === 200 && Array.isArray(cats.data?.items) && cats.data.items.length > 0) {
    ok(`GET /services/categories (${cats.data.items.length} categories)`);
  } else fail('GET /services/categories', JSON.stringify(cats.data));

  const makeup = await req('GET', '/services?category=Makeup');
  if (makeup.status === 200 && makeup.data?.items?.some((s) => s.name === 'Party Makeup')) {
    ok('GET /services?category=Makeup');
  } else fail('GET /services?category=Makeup', JSON.stringify(makeup.data?.items?.map((x) => x.name)));

  const cms = await req('GET', '/cms/services');
  if (cms.status === 200 && Array.isArray(cms.data?.items)) ok('GET /cms/services');
  else fail('GET /cms/services', cms.status);

  const ops = await req('GET', '/cms/operations');
  if (ops.status === 200 && ops.data?.operations?.servicesOpen !== undefined) ok('GET /cms/operations');
  else fail('GET /cms/operations', JSON.stringify(ops.data));

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().slice(0, 10);

  const slots = await req('GET', `/bookings/slots?date=${dateStr}`);
  if (slots.status === 200 && Array.isArray(slots.data?.slots) && slots.data.slots.length > 0) {
    ok(`GET /bookings/slots (${slots.data.slots.length} slots)`);
  } else fail('GET /bookings/slots', JSON.stringify(slots.data));

  const slot = slots.data?.slots?.[0] || '10:00 AM';

  /* Guest booking */
  const simple = await req('POST', '/bookings', {
    fullName: 'Test User',
    phone: '+919999999999',
    serviceName: 'Test Waxing',
    appointmentDate: dateStr,
    appointmentTime: slot,
    notes: 'API test',
  });
  if (simple.status === 201 && simple.data?.booking?.id) {
    ok('POST /bookings (guest)');
  } else fail('POST /bookings', `${simple.status} ${JSON.stringify(simple.data)}`);

  /* Slot should be taken now */
  const slots2 = await req('GET', `/bookings/slots?date=${dateStr}`);
  if (!slots2.data?.slots?.includes(slot)) {
    ok('Slot removed after booking');
  } else fail('Slot conflict check', `slot ${slot} still available`);

  /* Admin login */
  const login = await req('POST', '/auth/admin/login', {
    email: 'admin@oraya.com',
    password: process.env.ADMIN_TEST_PASSWORD || 'OrayaAdmin@2024',
  });
  const adminToken = login.data?.accessToken;
  if (login.status === 200 && adminToken) ok('POST /auth/admin/login');
  else {
    fail('POST /auth/admin/login', `${login.status} - set ADMIN_TEST_PASSWORD in .env if needed`);
    console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
    process.exit(1);
  }

  const adminBookings = await req('GET', '/admin/bookings', null, adminToken);
  if (adminBookings.status === 200 && Array.isArray(adminBookings.data?.bookings)) {
    ok(`GET /admin/bookings (${adminBookings.data.bookings.length} total)`);
  } else fail('GET /admin/bookings', adminBookings.status);

  const adminCats = await req('GET', '/admin/service-categories', null, adminToken);
  if (adminCats.status === 200) ok('GET /admin/service-categories');
  else fail('GET /admin/service-categories', adminCats.status);

  /* Pause bookings */
  const pause = await req('PUT', '/admin/operations', { servicesOpen: false }, adminToken);
  if (pause.status === 200 && pause.data?.operations?.servicesOpen === false) ok('PUT /admin/operations (pause)');
  else fail('PUT /admin/operations', JSON.stringify(pause.data));

  const blocked = await req('POST', '/bookings', {
    fullName: 'Blocked',
    phone: '+919888888888',
    appointmentDate: dateStr,
    appointmentTime: slots2.data?.slots?.[0] || '11:00 AM',
    serviceName: 'Should fail',
  });
  if (blocked.status === 403) ok('Bookings blocked when services paused');
  else fail('Bookings pause enforcement', blocked.status);

  await req('PUT', '/admin/operations', { servicesOpen: true }, adminToken);

  /* Customer flow would need OTP - skip full checkout but verify 401 */
  const checkoutNoAuth = await req('POST', '/bookings/checkout', {
    date: dateStr,
    slot: slots2.data?.slots?.[0],
    items: [{ id: 'svc_party_makeup', quantity: 1 }],
    address: { city: 'Nagpur' },
  });
  if (checkoutNoAuth.status === 401) ok('POST /bookings/checkout requires auth');
  else fail('POST /bookings/checkout auth', checkoutNoAuth.status);

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Test runner error:', err.message);
  process.exit(1);
});
