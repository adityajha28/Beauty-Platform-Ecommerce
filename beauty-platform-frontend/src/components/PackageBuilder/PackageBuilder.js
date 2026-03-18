import { useMemo, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { createCustomPackageBooking } from "../../services/bookingService";
import "./PackageBuilder.css";

function PackageBuilder({ services }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [successText, setSuccessText] = useState("");

  const selectedServices = useMemo(
    () => services.filter((service) => selectedIds.includes(service.id)),
    [services, selectedIds]
  );

  const totalAmount = useMemo(
    () => selectedServices.reduce((sum, item) => sum + item.price, 0),
    [selectedServices]
  );

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, item) => sum + item.duration, 0),
    [selectedServices]
  );

  const toggleService = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedServices.length) {
      alert("Please select at least one service.");
      return;
    }

    const payload = {
      customerName,
      phone,
      bookingDate,
      bookingTime,
      notes,
      services: selectedServices.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        duration: item.duration,
      })),
      totalAmount,
      totalDuration,
    };

    try {
      setLoading(true);
      await createCustomPackageBooking(payload);
      setSuccessText("Custom package request submitted successfully.");
      setCustomerName("");
      setPhone("");
      setBookingDate("");
      setBookingTime("");
      setNotes("");
      setSelectedIds([]);
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Something went wrong while creating your package."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="package-builder-wrap">
      <div className="package-builder-header">
        <span className="package-chip">Custom Package</span>
        <h3 className="package-title">Build your own salon package</h3>
        <p className="package-subtitle">
          Select multiple services, see live total pricing, and request a
          combined appointment slot.
        </p>
      </div>

      <Row className="g-3 g-lg-4 align-items-start">
        <Col lg={7}>
          <div className="package-card">
            <div className="package-service-list">
              {services.map((service) => {
                const active = selectedIds.includes(service.id);

                return (
                  <button
                    type="button"
                    key={service.id}
                    className={`package-service-item ${active ? "active" : ""}`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="package-service-left">
                      <div className="package-check">{active ? "✓" : "+"}</div>
                      <div>
                        <h4>{service.name}</h4>
                        <p>
                          {service.category} • {service.duration} min
                        </p>
                      </div>
                    </div>

                    <div className="package-service-right">₹{service.price}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </Col>

        <Col lg={5}>
          <div className="package-summary-card sticky-summary">
            <h4 className="summary-title">Package summary</h4>

            <div className="summary-stat-grid">
              <div className="summary-stat">
                <span className="summary-stat-label">Services</span>
                <strong>{selectedServices.length}</strong>
              </div>

              <div className="summary-stat">
                <span className="summary-stat-label">Duration</span>
                <strong>{totalDuration} min</strong>
              </div>

              <div className="summary-stat highlight">
                <span className="summary-stat-label">Estimated Total</span>
                <strong>₹{totalAmount}</strong>
              </div>
            </div>

            <div className="selected-service-tags">
              {selectedServices.length ? (
                selectedServices.map((service) => (
                  <span key={service.id} className="selected-service-tag">
                    {service.name}
                  </span>
                ))
              ) : (
                <p className="empty-package-note">No services selected yet.</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="package-book-form">
              <input
                type="text"
                className="form-control package-input"
                placeholder="Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />

              <input
                type="tel"
                className="form-control package-input"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <Row className="g-2">
                <Col xs={6}>
                  <input
                    type="date"
                    className="form-control package-input"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </Col>
                <Col xs={6}>
                  <input
                    type="time"
                    className="form-control package-input"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                  />
                </Col>
              </Row>

              <textarea
                className="form-control package-input"
                rows="3"
                placeholder="Notes / special request"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <button
                type="submit"
                className="btn package-submit-btn w-100"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Request Custom Package"}
              </button>

              {successText && <p className="package-success-text">{successText}</p>}
            </form>
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default PackageBuilder;