import useOperationsStatus from "../../hooks/useOperationsStatus";
import "./OperationsNotice.css";

/**
 * Shows a banner when the admin has paused services and/or products,
 * or set a global announcement.
 *
 * Props:
 *   scope: 'services' | 'products' | 'all'  (default 'all')
 *   compact: boolean — render a tighter inline pill instead of a full banner
 */
export default function OperationsNotice({ scope = "all", compact = false }) {
  const ops = useOperationsStatus();

  const showServices =
    (scope === "services" || scope === "all") && ops.servicesOpen === false;
  const showProducts =
    (scope === "products" || scope === "all") && ops.productsOpen === false;
  const showGlobal = scope === "all" && !!ops.globalBanner;

  if (!showServices && !showProducts && !showGlobal) return null;

  return (
    <div
      className={`ops-notice-stack${compact ? " compact" : ""}`}
      role="status"
      aria-live="polite"
    >
      {showGlobal && (
        <div className="ops-notice info">
          <span className="ops-notice-ico" aria-hidden="true">📢</span>
          <span>{ops.globalBanner}</span>
        </div>
      )}
      {showServices && (
        <div className="ops-notice warn">
          <span className="ops-notice-ico" aria-hidden="true">⏸️</span>
          <span>
            <strong>Service bookings are paused.</strong>{" "}
            {ops.serviceMessage}
          </span>
        </div>
      )}
      {showProducts && (
        <div className="ops-notice warn">
          <span className="ops-notice-ico" aria-hidden="true">⏸️</span>
          <span>
            <strong>Product orders are paused.</strong> {ops.productMessage}
          </span>
        </div>
      )}
    </div>
  );
}
