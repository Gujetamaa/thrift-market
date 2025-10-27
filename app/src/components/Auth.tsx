import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);

  // Google sign-in
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error(error);
      alert("Google login failed");
    }
  };

  // Email sign-up
  const handleSignUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCred.user);
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Email login
  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCred.user);
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
  };

  return (
    <div style={{ padding: 24, color: "#fff" }}>
      <h2>🧾 Login or Sign Up</h2>

      {!user ? (
        <>
          <div style={{ marginBottom: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button onClick={handleLogin}>Login with Email</button>
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleGoogleLogin}>Login with Google</button>
        </>
      ) : (
        <div>
          <h3>Welcome, {user.displayName || user.email}</h3>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
