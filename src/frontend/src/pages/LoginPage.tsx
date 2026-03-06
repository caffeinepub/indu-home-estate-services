import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";

interface LoginPageProps {
  onLogin: (role: "admin" | "technician" | "customer") => void;
}

const CREDENTIALS: Record<
  string,
  { password: string; role: "admin" | "technician" | "customer" }
> = {
  "admin@123": { password: "hakidre", role: "admin" },
  "staff@123": { password: "hakidre", role: "technician" },
  "technician@123": { password: "hakidre", role: "technician" },
  "client@123": { password: "hakidre", role: "customer" },
  "customer@123": { password: "hakidre", role: "customer" },
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const entry = CREDENTIALS[email as keyof typeof CREDENTIALS];
      if (entry && entry.password === password) {
        onLogin(entry.role);
      } else {
        setError("Invalid email or password. Please try again.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#0f172a" }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(37,99,235,0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{ background: "#1e293b", border: "1px solid #334155" }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "#2563eb" }}
            >
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1
              className="text-xl font-bold text-center"
              style={{ color: "#f1f5f9" }}
            >
              Indu Homes & Estates Services
            </h1>
            <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
              Admin Dashboard Login
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#94a3b8" }}
              >
                Email / Username
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#64748b" }}
                />
                <Input
                  id="login-email"
                  data-ocid="login.email.input"
                  type="text"
                  placeholder="admin@123"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 text-sm"
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#f1f5f9",
                  }}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-medium mb-1.5"
                style={{ color: "#94a3b8" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#64748b" }}
                />
                <Input
                  id="login-password"
                  data-ocid="login.password.input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 text-sm"
                  style={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#f1f5f9",
                  }}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" style={{ color: "#64748b" }} />
                  ) : (
                    <Eye className="w-4 h-4" style={{ color: "#64748b" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                data-ocid="login.error_state"
                className="rounded-lg px-3 py-2.5 text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#fca5a5",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              data-ocid="login.submit_button"
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-semibold mt-2"
              style={{ background: "#2563eb", color: "#fff" }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    style={{ display: "inline-block" }}
                  />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Credentials hint */}
          <div className="mt-6 pt-5" style={{ borderTop: "1px solid #334155" }}>
            <p
              className="text-xs font-medium mb-2"
              style={{ color: "#64748b" }}
            >
              Login Credentials
            </p>
            <div className="space-y-1.5 text-xs" style={{ color: "#475569" }}>
              <div className="flex justify-between">
                <span style={{ color: "#94a3b8" }}>Admin:</span>
                <span>admin@123 / hakidre</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#94a3b8" }}>Staff / Technician:</span>
                <span>staff@123 / hakidre</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#94a3b8" }}>Client / Customer:</span>
                <span>client@123 / hakidre</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-4" style={{ color: "#475569" }}>
          © {new Date().getFullYear()} Indu Homes & Estates Services
        </p>
      </div>
    </div>
  );
}
