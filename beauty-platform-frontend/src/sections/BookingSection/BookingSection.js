import BookingForm from "../../components/forms/BookingForm"; // Assuming this exists
import "./BookingSection.css";

export default function BookingSection() {
  return (
    <section id="booking" className="lux-booking-sec">
      <div className="lux-booking-wrap">
        
        {/* Left: Editorial Information */}
        <div className="lux-booking-info">
          <span className="lux-booking-chip">Book Appointment</span>
          <h2 className="lux-booking-title">
            Beauty booking in a <em>mobile-first flow</em>
          </h2>
          <p className="lux-booking-text">
            Choose your date, time, and service in one clean, elegant experience built for quick booking.
          </p>

          <ul className="lux-booking-features">
            <li><span className="chk">✓</span> Easy appointment scheduling</li>
            <li><span className="chk">✓</span> Custom package requests</li>
            <li><span className="chk">✓</span> Secure, instant confirmation</li>
          </ul>
        </div>

        {/* Right: The Form */}
        <div className="lux-booking-form-wrapper">
          <BookingForm />
        </div>

      </div>
    </section>
  );
}