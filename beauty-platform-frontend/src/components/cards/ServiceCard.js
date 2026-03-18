import { useState } from "react";
import { Modal } from "react-bootstrap";
import BookingForm from "../forms/BookingForm";
import "./ServiceCard.css";

function ServiceCard({ service }) {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <div className="service-card h-100">
        <div className="service-image-wrap">
          <img src={service.image} alt={service.name} className="service-image" />
          <span className="service-badge">{service.category}</span>
        </div>

        <div className="service-card-body">
          <h3 className="service-name">{service.name}</h3>
          <p className="service-description">{service.description}</p>

          <div className="service-meta">
            <span className="service-price">₹{service.price}</span>
            <span className="service-duration">{service.duration} min</span>
          </div>

          <button className="btn service-book-btn w-100" onClick={() => setShowBooking(true)}>
            Book Service
          </button>
        </div>
      </div>

      <Modal
        show={showBooking}
        onHide={() => setShowBooking(false)}
        centered
        contentClassName="mobile-sheet-modal"
      >
        <Modal.Body className="p-0">
          <BookingForm
            prefilledService={service}
            onSuccess={() => setShowBooking(false)}
            onClose={() => setShowBooking(false)}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ServiceCard;