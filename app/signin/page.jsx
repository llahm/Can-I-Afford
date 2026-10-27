"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

function SignInForm() {
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

  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || "/dashboard";
  const safeNext = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const [username, setUsername] = useState("demo_user");
  const [password, setPassword] = useState("peace123");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Live validation rules
  const errors = {
    username: username.trim().length < 3 ? "Username must be at least 3 characters." : null,
    password: password.length < 6 ? "Password must be at least 6 characters." : null,
  };
  const isFormValid = !errors.username && !errors.password;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (!isFormValid || loading) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");
      router.push(safeNext);
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
    <div className="max-w-md mx-auto py-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-cocoa-900">Welcome Back</h1>
        <p className="text-sm text-cocoa-700 mt-1">
          Sign in to view your saved comparisons and today’s 24-hour affordable place match.
        </p>
      </div>

      {error && (
        <div role="alert" className="p-3 mb-4 text-sm text-red-900 bg-red-100 border border-red-300 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="bg-cream-50 p-6 sm:p-8 rounded-2xl border border-cream-300 shadow-sm space-y-4">
        <div>
          <label htmlFor="signin-user" className="block text-sm font-semibold text-cocoa-800 mb-1">
            Username
          </label>
          <input
            id="signin-user"
            type="text"
            value={username}
            onBlur={() => setTouched((p) => ({ ...p, username: true }))}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={Boolean(touched.username && errors.username)}
            className={`w-full px-3.5 py-2 bg-cream-100 border rounded-xl focus:outline-none focus:ring-2 ${
              touched.username && errors.username
                ? "border-red-500 focus:ring-red-500"
                : "border-cream-300 focus:ring-cocoa-600"
            }`}
          />
          {touched.username && errors.username && (
            <p className="text-xs text-red-700 mt-1">{errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="signin-pass" className="block text-sm font-semibold text-cocoa-800 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="signin-pass"
              type={showPassword ? "text" : "password"}
              value={password}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(touched.password && errors.password)}
              className={`w-full pl-3.5 pr-11 py-2 bg-cream-100 border rounded-xl focus:outline-none focus:ring-2 ${
                touched.password && errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-cream-300 focus:ring-cocoa-600"
              }`}
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
          {touched.password && errors.password && (
            <p className="text-xs text-red-700 mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full bg-cocoa-800 text-cream-50 font-medium py-2.5 rounded-xl hover:bg-cocoa-900 transition disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Enter Sanctuary"}
        </button>

        <div className="pt-3 border-t border-cream-200 text-center space-y-1">
          <p className="text-xs text-cocoa-700">
            New here? <Link href="/signup" className="font-semibold underline">Create a new account</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<p className="text-center py-12">Loading...</p>}>
      <SignInForm />
    </Suspense>
  );
}