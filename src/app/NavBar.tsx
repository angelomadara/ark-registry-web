"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === path || pathname.startsWith(path + "/")
        ? "bg-leaf text-white"
        : "text-forest hover:bg-sky"
    }`;

  return (
    <nav className="bg-white border-b border-sky shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="text-xl font-bold text-forest mr-6"
            >
              Ark Registry
            </Link>
            <Link href="/" className={linkClass("/")}>
              Dashboard
            </Link>
            <Link href="/species" className={linkClass("/species")}>
              Species
            </Link>
            {isAuthenticated && (
              <Link href="/sightings" className={linkClass("/sightings")}>
                Sightings
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-forest-light mr-2">
                  {user?.username}
                </span>
                {pathname === "/sightings/create" ? null : (
                  <Link
                    href="/sightings/create"
                    className="bg-leaf text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-leaf-light transition-colors"
                  >
                    + Report Sighting
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-sm text-earth hover:text-forest px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-forest text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-forest-light transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
