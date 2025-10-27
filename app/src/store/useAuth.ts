import { create } from "zustand";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../lib/firebase";

type AuthState = { user: User|null; ready: boolean; };
export const useAuth = create<AuthState>(() => ({ user:null, ready:false }));

onAuthStateChanged(auth, (u) => {
  useAuth.setState({ user: u, ready: true });
});
