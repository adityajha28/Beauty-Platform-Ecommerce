import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminLayout from "../../layout/AdminLayout";
import { fetchBookingSlots, updateBookingSlots } from "../../services/adminApi";
import { DEFAULT_BOOKING_SLOTS, timeInputToSlot, sortSlotLabels } from "../../../constants/bookingSlots";
import "../../styles/admin-pages.css";
import "./TimeSlots.css";

export default function AdminTimeSlots() {
  const [slots, setSlots] = useState([...DEFAULT_BOOKING_SLOTS]);
  const [timeValue, setTimeValue] = useState("10:00");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await fetchBookingSlots();
      setSlots(data.slots || [...DEFAULT_BOOKING_SLOTS]);
      setUpdatedAt(data.updatedAt || null);
      setLoading(false);
    })();
  }, []);

  const addSlot = () => {
    const label = timeInputToSlot(timeValue);
    if (!label) {
      toast.error("Pick a valid time");
      return;
    }
    if (slots.includes(label)) {
      toast.error("This slot already exists");
      return;
    }
    setSlots((prev) => sortSlotLabels([...prev, label]));
    toast.success(`Added ${label}`);
  };

  const removeSlot = (slot) => {
    if (slots.length <= 1) {
      toast.error("Keep at least one time slot");
      return;
    }
    setSlots((prev) => prev.filter((s) => s !== slot));
  };

  const save = async () => {
    setSaving(true);
    try {
      const data = await updateBookingSlots(slots);
      setSlots(data.slots);
      setUpdatedAt(data.updatedAt);
      toast.success("Time slots saved — customers will see these at checkout");
    } catch {
      toast.error("Could not save slots");
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    setSlots([...DEFAULT_BOOKING_SLOTS]);
    toast("Reset to defaults — click Save to apply", { icon: "↺" });
  };

  return (
    <AdminLayout>
      <div className="admin-page admin-slots">
        <header className="admin-page-header">
          <div>
            <h1>Booking time slots</h1>
            <p>
              Manage when customers can book services. Slots already booked on a
              date are hidden automatically at checkout.
            </p>
          </div>
          {updatedAt && (
            <span className="admin-badge ok">
              Updated {new Date(updatedAt).toLocaleString()}
            </span>
          )}
        </header>

        <div className="admin-card slots-card">
          <div className="slots-add-row">
            <div className="admin-field slots-time-field">
              <label htmlFor="slot-time">Add a slot</label>
              <input
                id="slot-time"
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                step={900}
              />
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={addSlot}
              disabled={loading}
            >
              + Add slot
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={save}
              disabled={saving || loading}
            >
              {saving ? "Saving…" : "Save slots"}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={resetDefaults}
              disabled={loading}
            >
              Reset defaults
            </button>
          </div>

          {loading ? (
            <p className="admin-empty">Loading slots…</p>
          ) : (
            <ul className="slots-list" aria-label="Configured time slots">
              {slots.map((slot) => (
                <li key={slot} className="slots-chip">
                  <span>{slot}</span>
                  <button
                    type="button"
                    className="slots-remove"
                    onClick={() => removeSlot(slot)}
                    aria-label={`Remove ${slot}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="slots-hint">
            {slots.length} slot{slots.length !== 1 ? "s" : ""} available for booking.
            Format: 12-hour clock (e.g. 10:00 AM).
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
