import { Navigate, useLocation } from "react-router-dom";
import { userStorage } from "../../utils/userStorage";

const SKIP_PATHS = ["/onboarding", "/auth"];

/**
 * Redirects new users without address to /onboarding
 */
export default function OnboardingGate({ children }) {
  const location = useLocation();
  const path = location.pathname;

  if (SKIP_PATHS.some((p) => path.startsWith(p))) return children;

  const flow = sessionStorage.getItem("oraya_auth_flow");
  const needsAddress =
    (userStorage.getIsNewUser() || flow === "signup") &&
    !userStorage.isOnboardingDone() &&
    userStorage.getAddresses().length === 0;

  if (needsAddress) {
    return (
      <Navigate
        to={`/onboarding?redirect=${encodeURIComponent(path + location.search)}`}
        replace
      />
    );
  }

  return children;
}
