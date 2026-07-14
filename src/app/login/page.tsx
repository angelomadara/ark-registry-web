"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // alert('asdflkjsdf');
    // return;

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      console.log(result)

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-sky p-8 w-full max-w-md">
      <h1 className="text-2xl font-bold text-forest mb-6 text-center">
        Sign In to Ark Registry
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
            placeholder="Enter your username"
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
            className="w-full px-4 py-2 border border-leaf-light rounded-md bg-cream text-forest placeholder:text-earth/50 focus:outline-none focus:ring-2 focus:ring-leaf"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-white py-2.5 rounded-md font-medium hover:bg-forest-light transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-forest-light">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-leaf font-medium hover:text-leaf-light"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}
