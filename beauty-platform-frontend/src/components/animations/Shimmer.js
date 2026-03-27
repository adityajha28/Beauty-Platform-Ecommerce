// src/components/animations/Shimmer.js
import "./Shimmer.css";

/**
 * Shimmer Component
 * Used as a placeholder while backend data is loading.
 * Props: 
 * - type: "card" | "text" | "circle"
 * - width/height: CSS values
 */
const Shimmer = ({ type = "card", width = "100%", height = "200px", className = "" }) => {
  return (
    <div 
      className={`shimmer-wrapper ${type} ${className}`} 
      style={{ width, height }}
    >
      <div className="shimmer-pulse" />
    </div>
  );
};

export default Shimmer;