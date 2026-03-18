import { useState } from "react";
import { createBooking } from "../../services/bookingService";
import "./BookingForm.css";

function BookingForm({ prefilledService = null, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    serviceName: prefilledService?.name || "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await createBooking({
        ...formData,
        serviceId: prefilledService?.id || null,
        servicePrice: prefilledService?.price || null,
      });

      setSuccessMessage("Appointment request submitted successfully.");
      setFormData({
        fullName: "",
        phone: "",
        serviceName: prefilledService?.name || "",
        appointmentDate: "",
        appointmentTime: "",
        notes: "",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Unable to submit booking right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-form-card">
      <div className="booking-form-head">
        <div>
          <h3>{prefilledService ? "Book this service" : "Book your appointment"}</h3>
          <p>Fast salon booking flow with clean mobile-friendly UI.</p>
        </div>

        {onClose && (
          <button className="sheet-close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="booking-form-grid">
        <div className="form-field full">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-field full">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="form-field full">
          <label>Service</label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            placeholder="Selected service"
            required
            readOnly={!!prefilledService}
          />
        </div>

        <div className="form-field">
          <label>Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Time</label>
          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field full">
          <label>Notes</label>
          <textarea
            rows="4"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any preferences or special request"
          />
        </div>

        <div className="full">
          <button type="submit" className="booking-submit-btn w-100" disabled={submitting}>
            {submitting ? "Submitting..." : "Confirm Booking"}
          </button>
        </div>

        {successMessage && <p className="booking-success-message">{successMessage}</p>}
      </form>
    </div>
  );
}

export default BookingForm;