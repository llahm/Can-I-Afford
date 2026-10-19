export default function robots() {
  const b = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return { rules: { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api/"] }, sitemap: b + "/sitemap.xml" };
}