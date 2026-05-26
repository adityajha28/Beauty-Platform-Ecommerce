import WhatsappButton from "../WhatsappButton/WhatsappButton";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import "./FloatingEdgeStack.css";

/**
 * Fixed right-side stack: scroll-to-top above WhatsApp.
 * Keeps edge actions separate from the centered cart pill.
 */
export default function FloatingEdgeStack() {
  return (
    <aside className="floating-edge-stack" aria-label="Quick actions">
      <ScrollToTop />
      <WhatsappButton stacked />
    </aside>
  );
}
