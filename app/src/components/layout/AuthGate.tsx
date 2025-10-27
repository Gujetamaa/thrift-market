import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "../../store/useAuth";
import { auth } from "../../lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "../../css/pages/auth.css";

export default function AuthGate({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setErr(null);
    setBusy(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e: any) {
      setErr(e?.message ?? "Google login failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleEmailAuth = async () => {
    setErr(null);
    setBusy(true);
    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (e: any) {
      setErr(e?.message ?? "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return <p>Loading…</p>;
  if (!user)
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2 className="auth-title">
            {mode === "login" ? "Login" : "Create an account"}
          </h2>

          <div className="auth-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-btn" disabled={busy} onClick={handleEmailAuth}>
              {busy ? "Please wait…" : mode === "login" ? "Login" : "Register"}
            </button>

            <button
              className="auth-btn"
              type="button"
              onClick={handleGoogleLogin}
              disabled={busy}
            >
              Continue with Google
            </button>

            {err && <p style={{ color: "#f87171", fontSize: 14 }}>{err}</p>}

            <p className="auth-toggle">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button type="button" onClick={() => setMode("register")}>
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => setMode("login")}>
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    );

  return <>{children}</>;
}
