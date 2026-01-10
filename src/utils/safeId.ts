export function getSafeId(id: string): string {
  return id.replace(/=/g, "").replace(/\//g, "_").replace(/\+/g, "-");
}
