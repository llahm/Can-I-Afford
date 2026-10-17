"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LOCATIONS = ["California", "Texas", "Washington", "Colorado", "North Carolina", "Ohio", "Florida", "New York", "Tennessee", "Oregon"];

export default function ComparePage() {
  const router = useRouter();
  const [locationA, setLocationA] = useState("California");
  const [locationB, setLocationB] = useState("Texas");
  const [salary, setSalary] = useState("92000");
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const salaryNum = Number(salary);
  const samePlace =
    locationA.trim().toLowerCase() !== "" &&
    locationA.trim().toLowerCase() === locationB.trim().toLowerCase();

  const errors = {
    locationA: locationA.trim().length < 2 ? "Enter a valid state, code (e.g. CA), or city." : null,
    locationB:
      locationB.trim().length < 2
        ? "Enter a valid target state, code, or city."
        : samePlace
        ? "Target location must be different from your current location."
        : null,
    salary:
      Number.isNaN(salaryNum) || salaryNum < 1000
        ? "Enter an annual income of at least $1,000."
        : null,
  };

  const isFormValid = !errors.locationA && !errors.locationB && !errors.salary;

  async function handleCompare(e) {
    e.preventDefault();
    setTouched({ locationA: true, locationB: true, salary: true });
    if (!isFormValid || loading) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        locationA: locationA.trim(),
        locationB: locationB.trim(),
        salary: String(salaryNum),
      });
      const res = await fetch("/api/cost-of-living?" + params.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to compare locations.");
      sessionStorage.setItem("last_comparison", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-cocoa-900 mb-2">Compare Two Places</h1>
      <p className="text-cocoa-700 mb-6">
        Enter a state name, state code (e.g., CA, NY), or major city to query live ApiVerve CPI metrics.
      </p>

      {error && (
        <div role="alert" className="p-4 mb-6 text-sm text-red-900 bg-red-100 border border-red-300 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleCompare} noValidate className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-sm space-y-6">
        <div>
          <label htmlFor="locationA" className="block text-sm font-semibold text-cocoa-800 mb-1.5">
            Where You Are Now (Current Location)
          </label>
          <input
            id="locationA"
            type="text"
            value={locationA}
            onBlur={() => setTouched((p) => ({ ...p, locationA: true }))}
            onChange={(e) => setLocationA(e.target.value)}
            className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-cocoa-900"
          />
          {touched.locationA && errors.locationA && (
            <p className="text-xs text-red-700 mt-1">{errors.locationA}</p>
          )}
        </div>

        <div>
          <label htmlFor="locationB" className="block text-sm font-semibold text-cocoa-800 mb-1.5">
            Where You Want to Settle (Target Location)
          </label>
          <input
            id="locationB"
            type="text"
            value={locationB}
            onBlur={() => setTouched((p) => ({ ...p, locationB: true }))}
            onChange={(e) => setLocationB(e.target.value)}
            className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-cocoa-900"
          />
          {touched.locationB && errors.locationB && (
            <p className="text-xs text-red-700 mt-1">{errors.locationB}</p>
          )}
        </div>
        <div>
          <label htmlFor="salary" className="block text-sm font-semibold text-cocoa-800 mb-1.5">
            Current Annual Income ($)
          </label>
          <input
            id="salary"
            type="number"
            min="1000"
            value={salary}
            onBlur={() => setTouched((p) => ({ ...p, salary: true }))}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full px-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-cocoa-900"
          />
          {touched.salary && errors.salary && (
            <p className="text-xs text-red-700 mt-1">{errors.salary}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full bg-cocoa-800 text-cream-50 font-medium py-3 rounded-xl hover:bg-cocoa-900 transition disabled:opacity-50"
        >
          {loading ? "Querying Live ApiVerve Endpoint..." : "See Affordability Breakdown"}
        </button>
      </form>
    </div>
  );
}