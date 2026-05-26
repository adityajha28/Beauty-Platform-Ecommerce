import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./OffersStripeSection.css";

function isServiceOffer(offer) {
  const link = (offer.link || "/services").toLowerCase();
  return !link.includes("/products") && !link.includes("/cart");
}

function normalizeOffer(o) {
  return {
    id: o.id,
    badge: o.badge || "OFFER",
    title: o.title || "Special deal",
    description: o.description || "",
    code: o.code || "",
    discountPercent: o.discountPercent,
    image: o.image,
    link: o.link || "/services",
  };
}

export default function OffersStripeSection({ offers = [] }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const items = offers.filter((o) => o.isActive !== false && isServiceOffer(o)).map(normalizeOffer);

  const scrollToIndex = useCallback((index) => {
    const row = scrollRef.current;
    if (!row?.children.length) return;
    const card = row.children[index];
    const left = card.offsetLeft - (row.clientWidth - card.clientWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    setActive(index);
  }, []);

  useEffect(() => {
    const row = scrollRef.current;
    if (!row) return undefined;
    const onScroll = () => {
      const center = row.scrollLeft + row.clientWidth / 2;
      let closest = 0;
      let min = Infinity;
      [...row.children].forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
        if (d < min) {
          min = d;
          closest = i;
        }
      });
      setActive(closest);
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => row.removeEventListener("scroll", onScroll);
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2 || paused) return undefined;
    const t = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % items.length;
        scrollToIndex(next);
        return next;
      });
    }, 4500);
    return () => clearInterval(t);
  }, [items.length, paused, scrollToIndex]);

  if (!items.length) return null;

  return (
    <section className="ofs-sec" aria-labelledby="ofs-heading">
      <motion.div className="app-container">
        <div className="ofs-header">
          <div>
            <h2 id="ofs-heading" className="ofs-title">
              Service <em>Offers</em>
            </h2>
            <p className="ofs-sub">Limited-time deals on salon &amp; at-home services</p>
          </div>
          {items.length > 1 && (
            <div className="ofs-dots" aria-hidden="true">
              {items.map((o, i) => (
                <button
                  key={o.id}
                  type="button"
                  className={`ofs-dot${active === i ? " active" : ""}`}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Offer ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div
          className="ofs-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div ref={scrollRef} className="ofs-track" role="list">
            {items.map((offer, i) => (
              <motion.button
                key={offer.id}
                type="button"
                role="listitem"
                className={`ofs-stripe${active === i ? " ofs-stripe--active" : ""}`}
                onClick={() => navigate(offer.link)}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileTap={{ scale: 0.98 }}
              >
                {offer.image && (
                  <span className="ofs-stripe-img">
                    <img src={offer.image} alt="" loading="lazy" />
                  </span>
                )}
                <span className="ofs-stripe-body">
                  <span className="ofs-badge">{offer.badge}</span>
                  <span className="ofs-stripe-title">{offer.title}</span>
                  {offer.description && (
                    <span className="ofs-stripe-desc">{offer.description}</span>
                  )}
                </span>
                <span className="ofs-stripe-end">
                  {offer.discountPercent != null && (
                    <span className="ofs-discount">{offer.discountPercent}% OFF</span>
                  )}
                  {offer.code && <span className="ofs-code">Use {offer.code}</span>}
                  <span className="ofs-cta">Book →</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
