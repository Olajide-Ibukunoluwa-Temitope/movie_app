"use client";

import Loader from "@/components/Loader";
import { handleLogin, handleSignUp } from "@/services/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleUserLogin = async () => {
    try {
      setLoading(true);
      const user = await handleLogin(email, password);
      if (user) {
        localStorage.setItem(
          "movie_app_user",
          JSON.stringify({
            email: user.email,
            uid: user.uid,
            accessToken: user.accessToken,
          })
        );
        toast.success("Login successful");
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      if (error.message.includes("auth/invalid-credential")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserSignUp = async () => {
    try {
      setLoading(true);
      const user = await handleSignUp(email, password);
      if (user) {
        localStorage.setItem(
          "movie_app_user",
          JSON.stringify({
            email: user.email,
            uid: user.uid,
            accessToken: user.accessToken,
          })
        );
        toast.success("Account created successfully");
        router.push("/");
      }
    } catch (error) {
      console.error("Sign up failed:", error.message);
      if (error.message.includes("auth/email-already-in-use")) {
        toast.error("Email already in use");
      } else {
        toast.error(`Sign up failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      handleUserLogin();
    } else {
      handleUserSignUp();
    }
  };

  return (
    <div className="min-h-[calc(100vh-144px)] bg-black text-white flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-8">
          <h1 className="text-2xl font-bold text-center mb-8">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <i
                    className={`ri-${
                      showPassword ? "eye-line" : "eye-off-line"
                    }`}
                  ></i>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded font-medium hover:bg-red-700 transition duration-300 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{isLogin ? "SIGN IN" : "CREATE ACCOUNT"}</span>
              {loading && <Loader size={4} />}
            </button>
          </form>

          {isLogin ? (
            <div className="mt-6 text-center">
              <span className="text-gray-400">Not a User?</span>{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="text-white cursor-pointer hover:underline"
              >
                Create account
              </span>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <span className="text-gray-400">Already a User?</span>{" "}
              <span
                onClick={() => setIsLogin(true)}
                className="text-white cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
