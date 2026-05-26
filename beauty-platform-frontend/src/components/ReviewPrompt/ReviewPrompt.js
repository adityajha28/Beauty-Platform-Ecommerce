import { useState } from "react";
import { submitReview } from "../../services/cmsService";
import { userStorage } from "../../utils/userStorage";
import "./ReviewPrompt.css";

export default function ReviewPrompt({ type, targetName, referenceId, onDone }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await submitReview({
      name: userStorage.getUserName() || "Customer",
      rating,
      text: text.trim(),
      targetType: type,
      targetName,
      referenceId,
    });
    setSubmitted(true);
    setLoading(false);
    onDone?.();
  };

  if (submitted) {
    return (
      <p className="review-prompt-done">Thank you! Your review will appear after admin approval.</p>
    );
  }

  return (
    <form className="review-prompt" onSubmit={handleSubmit}>
      <h3>How was your experience?</h3>
      <p className="review-prompt-sub">Rate {targetName || (type === "booking" ? "your service" : "your order")}</p>
      <div className="review-prompt-stars" role="group" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={n <= rating ? "active" : ""}
            onClick={() => setRating(n)}
            aria-label={`${n} stars`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        placeholder="Share your feedback…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        rows={3}
      />
      <button type="submit" className="admin-btn admin-btn-primary" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
