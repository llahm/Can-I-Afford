export default function sitemap() {
  const b = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return [{ url: b + "/" }, { url: b + "/compare" }, { url: b + "/about" }, { url: b + "/signin" }, { url: b + "/signup" }];
}