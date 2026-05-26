export default function AdminModal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="admin-modal-overlay" onClick={onClose} role="presentation">
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
