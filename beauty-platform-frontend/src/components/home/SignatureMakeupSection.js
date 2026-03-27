// src/components/home/SignatureMakeupSection.js
import { Link } from "react-router-dom";
import ServiceCard from "../cards/ServiceCard";
import "./SignatureMakeupSection.css";

function SignatureMakeupSection({ allServices }) {
  const makeupServices = allServices?.filter(s => s.category?.toLowerCase().includes("makeup")).slice(0, 3) || [];

  if (!makeupServices.length) return null;

  return (
    <section className="sig-makeup-sec">
      <div className="sig-makeup-wrap">
        <div className="sig-editorial">
          <span className="sig-tag">The Signature Collection</span>
          <h2 className="sig-title">Flawless Artistry <br/><span>for Every Occasion.</span></h2>
          <p className="sig-desc">
            From subtle daytime elegance to breathtaking bridal transformations, our master makeup artists use premium cosmetics to highlight your natural beauty.
          </p>
          <Link to="/services?category=makeup" className="sig-explore-btn">
            View All Makeup Services
          </Link>
        </div>
        <div className="sig-grid">
          {makeupServices.map(service => (
            <div key={service.id} className="sig-card-wrapper">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SignatureMakeupSection;