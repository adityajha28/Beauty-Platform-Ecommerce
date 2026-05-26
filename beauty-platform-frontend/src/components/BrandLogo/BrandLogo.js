import { Link } from "react-router-dom";
import {
  BRAND_NAME,
  orayaLogoMark,
  orayaLogoHorizontal,
} from "../../constants/brand";
import "./BrandLogo.css";

export default function BrandLogo({
  to = "/",
  className = "",
  size = "md",
  showText = true,
  variant = "mark",
  onClick,
}) {
  const src = variant === "horizontal" ? orayaLogoHorizontal : orayaLogoMark;
  const imgClass =
    variant === "horizontal"
      ? `brand-logo-img brand-logo-img--horizontal brand-logo-img--${size}`
      : `brand-logo-img brand-logo-img--${size}`;

  const content = (
    <>
      <img
        src={src}
        alt={showText && variant === "mark" ? "" : BRAND_NAME}
        className={imgClass}
        width={variant === "horizontal" ? 160 : undefined}
        height={variant === "horizontal" ? 36 : undefined}
        decoding="async"
      />
      {showText && variant === "mark" && (
        <span className="brand-logo-text">
          Oraya <em>Beauty</em>
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`brand-logo ${className}`} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`brand-logo ${className}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
    >
      {content}
    </div>
  );
}
