// Useless only to avoid lint warning when assigning
export function copyByKey(from: any, to: any) {
  for (const key in from) {
    if (typeof key === "string") {
      to[key] = from[key];
    }
  }
}
