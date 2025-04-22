"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle authentication logic
    console.log("Sign in attempt with:", { email, password });
  };

  return (
    <div className="min-h-[calc(100vh-144px)] bg-black text-white flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>

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
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded font-medium hover:bg-red-700 transition duration-300"
            >
              SIGN IN
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-400">Not a User?</span>{" "}
            <Link href="/register">
              <span className="text-white cursor-pointer hover:underline">
                Create account
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
