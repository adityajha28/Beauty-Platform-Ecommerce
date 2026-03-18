import { useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ServiceCard from "../../components/cards/ServiceCard";
import PackageBuilder from "../../components/PackageBuilder/PackageBuilder";
import { SAMPLE_SERVICES, SERVICE_CATEGORIES } from "../../utils/constants";
import "./ServicesSection.css";

function ServicesSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredServices = useMemo(() => {
    if (activeCategory === "All") return SAMPLE_SERVICES;
    return SAMPLE_SERVICES.filter(
      (service) => service.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <section id="services" className="services-section">
      <Container fluid="lg">
        <div className="section-head text-center text-md-start">
          <span className="section-chip">Salon Services</span>
          <h2 className="section-title">
            Choose a service or build <em>your own package</em>
          </h2>
          <p className="section-subtitle">
            Mobile-first salon booking experience with individual services,
            bundled beauty care, and custom package selection.
          </p>
        </div>

        <div className="service-tabs-wrap">
          <div className="service-tabs-scroll">
            <button
              className={`service-tab ${activeCategory === "All" ? "active" : ""}`}
              onClick={() => setActiveCategory("All")}
            >
              All
            </button>

            {SERVICE_CATEGORIES.map((category) => (
              <button
                key={category}
                className={`service-tab ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <Row className="g-3 g-md-4 service-grid-row">
          {filteredServices.map((service) => (
            <Col xs={6} md={4} lg={3} key={service.id}>
              <ServiceCard service={service} />
            </Col>
          ))}
        </Row>

        <PackageBuilder services={SAMPLE_SERVICES} />
      </Container>
    </section>
  );
}

export default ServicesSection;