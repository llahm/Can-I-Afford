"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          router.replace("/dashboard");
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => setCheckingAuth(false));
  }, [router]);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("California");
  const [baselineSalary, setBaselineSalary] = useState("85000");
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Live validation checks
  const salaryNum = Number(baselineSalary);
  const errors = {
    name: name.trim().length < 2 ? "Please enter your name (at least 2 characters)." : null,
    username: !/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())
      ? "Username must be 3–20 letters, numbers, or underscores."
      : null,
    password: password.length < 6 ? "Password must be at least 6 characters." : null,
    currentLocation: currentLocation.trim().length < 2 ? "Enter a valid state or city." : null,
    baselineSalary: Number.isNaN(salaryNum) || salaryNum < 1000 ? "Enter an annual income of at least $1,000." : null,
  };

  const isFormValid = Object.values(errors).every((e) => e === null);

  async function handleSignUp(e) {
    e.preventDefault();
    setTouched({ name: true, username: true, password: true, currentLocation: true, baselineSalary: true });
    if (!isFormValid || loading) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: username.trim(),
          password,
          currentLocation: currentLocation.trim(),
          baselineSalary: salaryNum,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create account.");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return <p className="text-center py-12 text-cocoa-700">Checking session...</p>;
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-cocoa-900">Create Your Sanctuary</h1>
        <p className="text-sm text-cocoa-700 mt-1">
          Register to save comparisons and receive a daily affordable place match every 24 hours.
        </p>
      </div>

      {error && (
        <div role="alert" className="p-3 mb-4 text-sm text-red-900 bg-red-100 border border-red-300 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSignUp} noValidate className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-sm space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-cocoa-800 mb-1">
            First Name or Nickname
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2 bg-cream-100 border border-cream-300 rounded-xl"
          />
          {touched.name && errors.name && <p className="text-xs text-red-700 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-semibold text-cocoa-800 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onBlur={() => setTouched((p) => ({ ...p, username: true }))}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3.5 py-2 bg-cream-100 border border-cream-300 rounded-xl"
          />
          {touched.username && errors.username && <p className="text-xs text-red-700 mt-1">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-cocoa-800 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-3.5 pr-11 py-2 bg-cream-100 border border-cream-300 rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa-600 hover:text-cocoa-900 p-1 rounded focus:outline-none focus:ring-2 focus:ring-cocoa-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {touched.password && errors.password && <p className="text-xs text-red-700 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="currentLocation" className="block text-sm font-semibold text-cocoa-800 mb-1">
            Current State or City
          </label>
          <input
            id="currentLocation"
            type="text"
            value={currentLocation}
            onBlur={() => setTouched((p) => ({ ...p, currentLocation: true }))}
            onChange={(e) => setCurrentLocation(e.target.value)}
            className="w-full px-3.5 py-2 bg-cream-100 border border-cream-300 rounded-xl"
          />
          {touched.currentLocation && errors.currentLocation && (
            <p className="text-xs text-red-700 mt-1">{errors.currentLocation}</p>
          )}
        </div>

        <div>
          <label htmlFor="baselineSalary" className="block text-sm font-semibold text-cocoa-800 mb-1">
            Annual Baseline Income ($)
          </label>
          <input
            id="baselineSalary"
            type="number"
            value={baselineSalary}
            onBlur={() => setTouched((p) => ({ ...p, baselineSalary: true }))}
            onChange={(e) => setBaselineSalary(e.target.value)}
            className="w-full px-3.5 py-2 bg-cream-100 border border-cream-300 rounded-xl"
          />
          {touched.baselineSalary && errors.baselineSalary && (
            <p className="text-xs text-red-700 mt-1">{errors.baselineSalary}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full bg-cocoa-800 text-cream-50 font-medium py-2.5 rounded-xl hover:bg-cocoa-900 transition disabled:opacity-50"
        >
          {loading ? "Setting Up..." : "Create Account"}
        </button>

        <p className="text-center text-xs text-cocoa-700 pt-2">
          Already registered? <Link href="/signin" className="font-semibold underline">Sign in here</Link>
        </p>
      </form>
    </div>
  );
}