export function toInputDateFormat(dateStr?: string) {
  if (!dateStr) return "";
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  }
  return dateStr;
}

export function toApiDateFormat(dateStr?: string) {
  if (!dateStr) return "";
  return dateStr.replace(/-/g, "");
}
