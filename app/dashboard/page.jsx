"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [records, setRecords] = useState([]);
  const [dailyMatch, setDailyMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/calculations", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/daily-match", { cache: "no-store" }).then((r) => r.json())
    ]).then(([calcData, matchData]) => {
      setRecords(calcData.records || []);
      if (!matchData.error) setDailyMatch(matchData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    const res = await fetch("/api/calculations?id=" + encodeURIComponent(id), { method: "DELETE" });
    if (res.ok) setRecords((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-cocoa-900">Your Financial Sanctuary</h1>
          <p className="text-cocoa-700 mt-1">Review your saved comparisons and explore today’s 24-hour peaceful place recommendation.</p>
        </div>
        <Link href="/compare" className="self-start bg-cocoa-800 text-cream-50 text-sm font-medium px-5 py-2.5 rounded-xl">+ New Comparison</Link>
      </header>

      {dailyMatch && (
        <section aria-label="Daily 24-Hour Affordable Location Match" className="bg-cream-200/80 border border-cocoa-400/40 p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-cocoa-800 bg-cream-50 px-3 py-1 rounded-full border border-cream-300">
              ✦ Today’s 24-Hour Peaceful Match ({dailyMatch.refreshedDate})
            </span>
            <span className="text-xs text-cocoa-600">Refreshes every 24h • Next rotation in {dailyMatch.hoursUntilNextMatch}h</span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center pt-2">
            <div className="md:col-span-2 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-cocoa-900">{dailyMatch.location.searchedLocation}</h2>
              {dailyMatch.location.regionName && <p className="text-xs text-cocoa-600">{dailyMatch.location.regionName}</p>}
              <p className="text-sm text-cocoa-800 leading-relaxed pt-1">
                Based on your baseline income of <strong>${Number(dailyMatch.userBaselineSalary).toLocaleString()}</strong> in <strong>{dailyMatch.userCurrentLocation}</strong>, you only need <strong>${Math.round(dailyMatch.equivalentSalaryNeeded).toLocaleString()}</strong> in <strong>{dailyMatch.location.searchedLocation}</strong> ({dailyMatch.location.description}, CPI {dailyMatch.location.cpi}). That leaves <strong>${Math.round(dailyMatch.annualSavingsMargin).toLocaleString()}/yr</strong> in extra breathing room.
              </p>
            </div>
            <div className="bg-cream-50 p-4 rounded-xl border border-cream-300 text-center space-y-1">
              <p className="text-xs text-cocoa-600 uppercase">Cost Index</p>
              <p className="text-4xl font-bold text-cocoa-900">{dailyMatch.location.costIndex}</p>
              <p className="text-xs text-cocoa-700">{dailyMatch.location.description}</p>
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-cocoa-900">Saved Comparisons</h2>
        {loading ? (
          <p className="text-cocoa-600 py-8">Loading your saved places...</p>
        ) : records.length === 0 ? (
          <div className="p-10 text-center bg-cream-50 border border-dashed border-cream-300 rounded-2xl space-y-3">
            <p className="text-xl text-cocoa-800">Your sanctuary is quiet and empty right now.</p>
            <p className="text-sm text-cocoa-600 max-w-md mx-auto">Compare any two states or cities to see how far your income stretches, then save your favorites here.</p>
            <Link href="/compare" className="inline-block bg-cocoa-800 text-cream-50 text-sm font-medium px-5 py-2.5 rounded-xl">Compare Your First Location →</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {records.map((rec) => (
              <div key={rec.id} className="p-5 bg-cream-50 border border-cream-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-cocoa-900">{rec.locationA?.searchedLocation} → {rec.locationB?.searchedLocation}</p>
                  <p className="text-sm text-cocoa-700">Baseline: ${Number(rec.salary).toLocaleString()} • Needed: <strong>${Math.round(rec.requiredSalary).toLocaleString()}</strong> ({rec.locationB?.description})</p>
                </div>
                <button type="button" onClick={() => handleDelete(rec.id)} className="text-xs font-semibold text-red-800 border border-red-300 bg-red-50 px-3 py-1.5 rounded-lg">Remove</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}