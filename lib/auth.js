import { db } from "./store";
export async function getCurrentUser(request) {
  const cookie = request.cookies.get("app_session")?.value;
  if (!cookie) return null;
  try {
    const parsed = JSON.parse(cookie);
    return db.users.find((u) => u.id === parsed.id) || parsed;
  } catch {
    return null;
  }
}