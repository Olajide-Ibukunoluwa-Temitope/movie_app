import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export async function handleSignUp(email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
}

export async function handleLogin(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
}

export async function handleLogout() {
  try {
    await signOut(auth);
    localStorage.removeItem("movie_app_user");
  } catch (error) {
    console.error("Logout error:", error);
  }
}
