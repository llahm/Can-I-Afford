import Link from "next/link";
import { cookies } from "next/headers";

export default function HomePage() {
  const cookieStore = cookies();
  const isLoggedIn = cookieStore.has("app_session");

  return (
    <div className="py-12 md:py-20">
      <section className="text-center max-w-3xl mx-auto">
        <span className="inline-block text-xs uppercase tracking-widest text-cocoa-600 bg-cream-200 border border-cream-300 px-3.5 py-1.5 rounded-full mb-6">
          Mindful Financial Planning
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-cocoa-900 tracking-tight leading-tight">
          Find a place where your life and budget <span className="italic font-normal text-cocoa-600">settle in peace.</span>
        </h1>
        <p className="mt-6 text-lg text-cocoa-700 leading-relaxed max-w-2xl mx-auto">
          Compare real Consumer Price Index (CPI) benchmarks and regional living costs so you can choose your next home with quiet confidence.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/compare" className="bg-cocoa-800 text-cream-50 font-medium px-7 py-3.5 rounded-xl hover:bg-cocoa-900 transition shadow-sm">
            Compare Locations
          </Link>
          {isLoggedIn ? (
            <Link href="/dashboard" className="bg-cream-200 text-cocoa-800 border border-cream-300 font-medium px-7 py-3.5 rounded-xl hover:bg-cream-300 transition">
              Enter Your Sanctuary
            </Link>
          ) : (
            <Link href="/signup" className="bg-cream-200 text-cocoa-800 border border-cream-300 font-medium px-7 py-3.5 rounded-xl hover:bg-cream-300 transition">
              Create Your Sanctuary
            </Link>
          )}
        </div>
      </section>
      <section className="mt-20 grid md:grid-cols-3 gap-6">
        <div className="bg-cream-50 border border-cream-300 p-6 rounded-2xl shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-cocoa-900 mb-2">Real CPI Benchmarks</h2>
          <p className="text-sm text-cocoa-700">Grounded in official regional Consumer Price Index figures relative to the US national average of 100.</p>
        </div>
        <div className="bg-cream-50 border border-cream-300 p-6 rounded-2xl shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-cocoa-900 mb-2">Daily Peaceful Match</h2>
          <p className="text-sm text-cocoa-700">Every 24 hours, your personal sanctuary suggests a new region where your current income stretches further.</p>
        </div>
        <div className="bg-cream-50 border border-cream-300 p-6 rounded-2xl shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-cocoa-900 mb-2">Server-Protected Keys</h2>
          <p className="text-sm text-cocoa-700">All ApiVerve queries execute across the Next.js server boundary—keeping API keys private and responses fast.</p>
        </div>
      </section>
    </div>
  );
}