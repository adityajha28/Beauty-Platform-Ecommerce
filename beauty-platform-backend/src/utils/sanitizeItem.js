/**
 * DynamoDB rejects explicit `null` attribute values.
 * Strip nulls and undefined before Put/Update.
 */
function sanitizeItem(item) {
  if (item === null || item === undefined) return undefined;
  if (Array.isArray(item)) {
    return item.map(sanitizeItem).filter((v) => v !== undefined);
  }
  if (typeof item === 'object' && !(item instanceof Date)) {
    const out = {};
    for (const [key, value] of Object.entries(item)) {
      const cleaned = sanitizeItem(value);
      if (cleaned !== undefined && cleaned !== null) {
        out[key] = cleaned;
      }
    }
    return out;
  }
  return item;
}

module.exports = { sanitizeItem };
