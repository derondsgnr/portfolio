"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../actions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/admin");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0A0A0A", color: "#fff" }}>
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-mono mb-6 tracking-wider" style={{ color: "#fff" }}>
          ADMIN
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              autoFocus
              className="w-full px-4 py-3 pr-12 border font-mono text-sm focus:outline-none focus:border-[#E2B93B]/50"
              style={{ backgroundColor: "#111", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-white/40 hover:text-white"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-400 font-mono">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#E2B93B] text-[#0A0A0A] font-mono text-xs tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
