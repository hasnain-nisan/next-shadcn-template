export function getNameFromEmail(email?: string | null): string | null {
  const name = email ? email.split("@")[0] : null;
  return name;
}
