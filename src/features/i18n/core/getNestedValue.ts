export function getNestedValue(
  obj: Record<string, unknown>,
  keyPath: string,
): unknown {
  const keys = keyPath.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return keyPath;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current ?? keyPath;
}
