import { readDb } from "./store";

export async function getCurrentUser(request) {
  const cookie = request.cookies.get("app_session")?.value;
  if (!cookie) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(cookie));
    const currentDb = readDb();
    return currentDb.users.find((u) => u.id === parsed.id) || parsed;
  } catch {
    try {
      const parsed = JSON.parse(cookie);
      return parsed;
    } catch {
      return null;
    }
  }
}