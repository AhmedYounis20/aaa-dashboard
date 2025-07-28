// Utility to map enum values to their string representation
export function getEnumString(enumObj: any, value: number | string): string {
  if (typeof value === 'number') {
    return enumObj[value];
  }
  // fallback for string or unknown
  return value;
}
