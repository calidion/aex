// Useless only to avoid lint warning when assigning
export function copyByKey(from: any, to: any) {
  for (const key of Object.keys(from)) {
    to[key] = from[key];
  }
}
