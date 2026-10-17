"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("last_comparison");
    if (raw) {
      try { setResult(JSON.parse(raw)); } catch { setResult(null); }
    }
  }, []);

  async function handleSave() {
    if (!result || saving || saved) return;
    setSaving(true);
    const res = await fetch("/api/calculations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    });
    setSaving(false);
    if (res.status === 401) { router.push("/signin?next=/results"); return; }
    if (res.ok) setSaved(true);
  }

  if (!result) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center bg-cream-50 border border-cream-300 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-cocoa-900 mb-3">No Active Comparison Yet</h1>
        <p className="text-cocoa-700 mb-6">Choose two locations first to calculate your personalized CPI and salary breakdown.</p>
        <Link href="/compare" className="inline-block bg-cocoa-800 text-cream-50 px-6 py-2.5 rounded-xl">Start a Comparison</Link>
      </div>
    );
  }

  const { locationA, locationB, salary, requiredSalary, percentageDiff, purchasingPowerGain } = result;
  const isMoreAffordable = percentageDiff <= 0;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-cocoa-600">CPI Period: {locationB.period || "2026-08"}</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-cocoa-900 mt-1">{locationA.searchedLocation} → {locationB.searchedLocation}</h1>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={handleSave} disabled={saving || saved} className="bg-cocoa-800 text-cream-50 text-sm font-medium px-5 py-2.5 rounded-xl disabled:opacity-50">
            {saved ? "Saved in Sanctuary" : saving ? "Saving..." : "Save to Sanctuary"}
          </button>
          <Link href="/compare" className="bg-cream-200 text-cocoa-800 border border-cream-300 text-sm font-medium px-4 py-2.5 rounded-xl">Compare Again</Link>
        </div>
      </div>
      <section className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-sm">
        <p className="text-sm uppercase tracking-wider text-cocoa-600 font-semibold">Equivalent Comfort Income</p>
        <div className="my-4 flex flex-wrap items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-bold text-cocoa-900">${Math.round(requiredSalary).toLocaleString()}</span>
          <span className="text-sm text-cocoa-600">per year in {locationB.searchedLocation} matches ${Number(salary).toLocaleString()} in {locationA.searchedLocation}</span>
        </div>
        <p className="text-cocoa-800 leading-relaxed">
          {isMoreAffordable
            ? `Good news: ${locationB.searchedLocation} is${Math.abs(percentageDiff)}% more affordable than ${locationA.searchedLocation}, giving you roughly$${Math.round(purchasingPowerGain).toLocaleString()} in extra annual breathing room.`
            : `Note: ${locationB.searchedLocation} has a cost index${Math.abs(percentageDiff)}% higher than ${locationA.searchedLocation}. You need about $${Math.round(requiredSalary - salary).toLocaleString()} more per year for the same standard of living.`}
        </p>
      </section>
      <section className="grid md:grid-cols-2 gap-6">
        {[{ label: "Current Place", item: locationA }, { label: "Target Place", item: locationB }].map(({ label, item }) => (
          <div key={label} className="bg-cream-50 p-6 rounded-2xl border border-cream-300 space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-cocoa-600">{label}</span>
              <span className="text-xs bg-cream-200 text-cocoa-800 px-2.5 py-1 rounded-full font-medium">Index: {item.costIndex}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-cocoa-900">{item.searchedLocation}</h2>
              {item.regionName && <p className="text-xs text-cocoa-600 mt-0.5">{item.regionName}</p>}
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm pt-2">
              <div className="bg-cream-100 p-3 rounded-xl border border-cream-200"><dt className="text-xs text-cocoa-600">Standing</dt><dd className="font-semibold text-cocoa-900">{item.description}</dd></div>
              <div className="bg-cream-100 p-3 rounded-xl border border-cream-200"><dt className="text-xs text-cocoa-600">Local CPI</dt><dd className="font-semibold text-cocoa-900">{item.cpi}</dd></div>
              <div className="bg-cream-100 p-3 rounded-xl border border-cream-200"><dt className="text-xs text-cocoa-600">US Avg CPI</dt><dd className="font-semibold text-cocoa-900">{item.usAverageCPI}</dd></div>
              <div className="bg-cream-100 p-3 rounded-xl border border-cream-200"><dt className="text-xs text-cocoa-600">Period</dt><dd className="font-semibold text-cocoa-900">{item.period}</dd></div>
            </dl>
            {item.note && <p className="text-xs text-cocoa-600 italic">{item.note}</p>}
          </div>
        ))}
      </section>
    </div>
  );
}