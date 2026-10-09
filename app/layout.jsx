import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import NavbarClient from "@/components/NavbarClient";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Can I Afford | Find Your Next Place with Peace of Mind",
  description: "A calm, grounded cost of living and CPI comparison tool to help you settle down comfortably.",
  openGraph: {
    title: "Can I Afford | Mindful Relocation & Cost of Living",
    description: "Compare regional CPI and cost indices across the United States.",
    url: "/",
    siteName: "Can I Afford",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Can I Afford preview" }],
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jakarta.className}flex flex-col min-h-screen antialiased bg-cream-100 text-cocoa-900}`}>
        <NavbarClient />
        <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
          {children}
        </main>
        <footer className="bg-cream-200/70 border-t border-cream-300 py-8 text-center text-sm text-cocoa-600">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="italic text-cocoa-700">"Find where your income breathes easy."</p>
            <p>© {new Date().getFullYear()} Can I Afford. Powered by ApiVerve CPI Metrics.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}