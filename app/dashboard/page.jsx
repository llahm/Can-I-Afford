"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [records, setRecords] = useState([]);
  const [dailyMatch, setDailyMatch] = useState(null);
  const [filterMode, setFilterMode] = useState("all"); // "all" | "affordable" | "higher"
  const [loading, setLoading] = useState(true);

  const loadSanctuaryData = useCallback(async () => {
    setLoading(true);
    try {
      const ts = Date.now();
      const [calcRes, matchRes] = await Promise.all([
        fetch(`/api/calculations?t=${ts}`, { cache: "no-store" }),
        fetch(`/api/daily-match?t=${ts}`, { cache: "no-store" }),
      ]);
      const calcData = await calcRes.json();
      const matchData = await matchRes.json();

      setRecords(calcData.records || []);
      if (!matchData.error) setDailyMatch(matchData);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSanctuaryData();
  }, [loadSanctuaryData]);

  async function handleDelete(id) {
    const res = await fetch("/api/calculations?id=" + encodeURIComponent(id), {
      method: "DELETE",
    });
    if (res.ok) {
      setRecords((prev) => prev.filter((item) => item.id !== id));
    }
  }

  const filteredRecords = records.filter((rec) => {
    if (filterMode === "affordable") return (rec.percentageDiff ?? 0) <= 0;
    if (filterMode === "higher") return (rec.percentageDiff ?? 0) > 0;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-cocoa-900">Your Financial Sanctuary</h1>
          <p className="text-cocoa-700 mt-1">
            Review all {records.length} of your saved comparisons and explore today’s 24-hour peaceful place match.
          </p>
        </div>
        <Link
          href="/compare"
          className="self-start bg-cocoa-800 text-cream-50 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-cocoa-900 transition"
        >
          + New Comparison
        </Link>
      </header>

      {dailyMatch && (
        <section
          aria-label="Daily 24-Hour Affordable Location Match"
          className="bg-cream-200/80 border border-cocoa-400/40 p-6 sm:p-8 rounded-2xl shadow-sm space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-cocoa-800 bg-cream-50 px-3 py-1 rounded-full border border-cream-300">
              ✦ Today’s 24-Hour Peaceful Match ({dailyMatch.refreshedDate})
            </span>
            <span className="text-xs text-cocoa-600">
              Refreshes every 24h • Next rotation in {dailyMatch.hoursUntilNextMatch}h
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center pt-2">
            <div className="md:col-span-2 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-cocoa-900">
                {dailyMatch.location.searchedLocation}
              </h2>
              {dailyMatch.location.regionName && (
                <p className="text-xs text-cocoa-600">{dailyMatch.location.regionName}</p>
              )}
              <p className="text-sm text-cocoa-800 leading-relaxed pt-1">
                Based on your baseline income of{" "}
                <strong>${Number(dailyMatch.userBaselineSalary).toLocaleString()}</strong> in{" "}
                <strong>{dailyMatch.userCurrentLocation}</strong>, you only need{" "}
                <strong>${Math.round(dailyMatch.equivalentSalaryNeeded).toLocaleString()}</strong> in{" "}
                <strong>{dailyMatch.location.searchedLocation}</strong> ({dailyMatch.location.description}, CPI{" "}
                {dailyMatch.location.cpi}). That leaves{" "}
                <strong>${Math.round(dailyMatch.annualSavingsMargin).toLocaleString()}/yr</strong> in extra breathing room.
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-cocoa-900">
            Saved Comparisons ({records.length})
          </h2>

          {records.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  filterMode === "all"
                    ? "bg-cocoa-800 text-cream-50 border-cocoa-800"
                    : "bg-cream-50 text-cocoa-800 border-cream-300 hover:bg-cream-200"
                }`}
              >
                Show All ({records.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("affordable")}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  filterMode === "affordable"
                    ? "bg-cocoa-800 text-cream-50 border-cocoa-800"
                    : "bg-cream-50 text-cocoa-800 border-cream-300 hover:bg-cream-200"
                }`}
              >
                More Affordable ({records.filter((r) => (r.percentageDiff ?? 0) <= 0).length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("higher")}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  filterMode === "higher"
                    ? "bg-cocoa-800 text-cream-50 border-cocoa-800"
                    : "bg-cream-50 text-cocoa-800 border-cream-300 hover:bg-cream-200"
                }`}
              >
                Higher Cost ({records.filter((r) => (r.percentageDiff ?? 0) > 0).length})
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-cocoa-600 py-8">Loading your saved places...</p>
        ) : filteredRecords.length === 0 ? (
          <div className="p-10 text-center bg-cream-50 border border-dashed border-cream-300 rounded-2xl space-y-3">
            <p className="text-xl font-medium text-cocoa-800">
              {records.length === 0
                ? "Your sanctuary is quiet and empty right now."
                : "No saved comparisons match this filter."}
            </p>
            <p className="text-sm text-cocoa-600 max-w-md mx-auto">
              Compare any two states or cities to see how far your income stretches, then save your favorites here.
            </p>
            <Link
              href="/compare"
              className="inline-block bg-cocoa-800 text-cream-50 text-sm font-medium px-5 py-2.5 rounded-xl"
            >
              Compare a Location →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRecords.map((rec, index) => (
              <div
                key={rec.id}
                className="p-5 bg-cream-50 border border-cream-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-cocoa-600 bg-cream-200 px-2 py-0.5 rounded">
                      #{index + 1}
                    </span>
                    <p className="text-lg font-bold text-cocoa-900">
                      {rec.locationA?.searchedLocation} → {rec.locationB?.searchedLocation}
                    </p>
                    <span className="text-xs bg-cream-200 text-cocoa-800 px-2.5 py-0.5 rounded-full">
                      Index {rec.locationA?.costIndex} vs {rec.locationB?.costIndex}
                    </span>
                  </div>
                  <p className="text-sm text-cocoa-700">
                    Baseline: ${Number(rec.salary).toLocaleString()} • Equivalent Needed:{" "}
                    <strong>${Math.round(rec.requiredSalary).toLocaleString()}</strong> (
                    {rec.locationB?.description})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(rec.id)}
                  className="self-start sm:self-center text-xs font-semibold text-red-800 border border-red-300 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}