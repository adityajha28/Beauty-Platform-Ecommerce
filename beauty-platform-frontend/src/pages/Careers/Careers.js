import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Navbar/Navbar";
import BottomNav from "../../components/BottomNav/BottomNav";
import Footer from "../../components/Footer/Footer";
import { GOOGLE_CAREER_FORM_URL } from "../../utils/constants";
import "./Careers.css";

function Careers() {
  const jobs = [
    {
      id: 1,
      title: "Beauty Therapist",
      type: "Full Time",
      location: "Nagpur",
      description:
        "Handle salon services, customer care, and premium beauty treatments.",
    },
    {
      id: 2,
      title: "Makeup Artist",
      type: "Full Time",
      location: "Nagpur",
      description:
        "Work on bridal, event, and luxury makeover assignments.",
    },
    {
      id: 3,
      title: "Customer Support Executive",
      type: "Full Time",
      location: "Remote / Nagpur",
      description:
        "Assist customers with bookings, order issues, and service queries.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="careers-page">
        <Container fluid="lg">
          <div className="careers-hero">
            <span className="career-chip">Join Our Team</span>
            <h1>
              Build your future with <em>Oraya Beauty</em>
            </h1>
            <p>
              We’re building a premium beauty and commerce experience. If you
              love beauty, customer experience, and modern service operations,
              we’d love to hear from you.
            </p>
          </div>

          <Row className="g-3 g-md-4">
            {jobs.map((job) => (
              <Col md={6} lg={4} key={job.id}>
                <div className="career-card">
                  <span className="career-job-type">{job.type}</span>
                  <h3>{job.title}</h3>
                  <p className="career-location">{job.location}</p>
                  <p className="career-description">{job.description}</p>

                  <a
                    href={GOOGLE_CAREER_FORM_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="btn career-apply-btn"
                  >
                    Apply Now
                  </a>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </main>

      <Footer />
      <BottomNav />
    </>
  );
}

export default Careers;