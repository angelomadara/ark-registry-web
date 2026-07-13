"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/lib/auth";
import { useAuth } from "@/app/context/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      // Auto-login after registration
      await login(username, password);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sky p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold text-forest mb-6 text-center">
        Create an Account
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-forest mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-forest mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-forest mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-forest mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
            placeholder="Repeat your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-white py-2.5 rounded-md font-medium hover:bg-forest-light transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-forest-light">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-leaf font-medium hover:text-leaf-light"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
