import { useEffect, useState } from "react";
import {
  getOperationsStatus,
  DEFAULT_OPERATIONS,
  KEYS,
} from "../services/cmsStorage";
import { getOperations } from "../services/cmsService";

/**
 * Reactive operations status — listens to admin updates in the same tab
 * (CustomEvent) and across tabs (storage event), and refreshes from the
 * API once on mount.
 *
 * Returns: { servicesOpen, productsOpen, serviceMessage, productMessage,
 *           globalBanner, updatedAt }
 */
export default function useOperationsStatus() {
  const [status, setStatus] = useState(() => getOperationsStatus());

  useEffect(() => {
    let cancelled = false;

    getOperations()
      .then((s) => {
        if (!cancelled && s) setStatus(s);
      })
      .catch(() => {});

    const handleLocal = (e) => {
      setStatus(e.detail || getOperationsStatus());
    };
    const handleStorage = (e) => {
      if (e.key === KEYS.operations) {
        setStatus(getOperationsStatus());
      }
    };

    window.addEventListener("oraya:operations", handleLocal);
    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      window.removeEventListener("oraya:operations", handleLocal);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return status || DEFAULT_OPERATIONS;
}
