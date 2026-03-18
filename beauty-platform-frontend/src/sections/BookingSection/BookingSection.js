import { Container, Row, Col } from "react-bootstrap";
import BookingForm from "../../components/forms/BookingForm";
import "./BookingSection.css";

function BookingSection() {
  return (
    <section id="booking" className="booking-section">
      <Container fluid="lg">
        <Row className="g-4 align-items-start">
          <Col lg={5} className="d-none d-lg-block">
            <div className="booking-info-card">
              <span className="booking-chip">Book Appointment</span>
              <h2 className="booking-title">
                Beauty booking in a <em>mobile-first flow</em>
              </h2>
              <p className="booking-text">
                Choose date, time, service, and notes in one clean sheet-style
                experience built for quick mobile booking.
              </p>

              <ul className="booking-feature-list">
                <li>Easy appointment scheduling</li>
                <li>Supports custom package request</li>
                <li>Backend-ready payload structure</li>
                <li>Responsive from phone to desktop</li>
              </ul>
            </div>
          </Col>

          <Col lg={7}>
            <BookingForm />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default BookingSection;