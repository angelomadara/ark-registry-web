import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

interface BackendLoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: {
      id: number;
      username: string;
      role: string;
    };
  };
}

interface BackendErrorResponse {
  success: boolean;
  message?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.arkregistry.org";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;
        if (typeof username !== "string" || typeof password !== "string") {
          return null;
        }

        const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        let message = "Invalid credentials";
        if (!res.ok) {
          try {
            const errJson = (await res.json()) as BackendErrorResponse;
            if (errJson.message) message = errJson.message;
          } catch {
            // Backend didn't return JSON; fall through with the default message
          }
          throw new Error(message);
        }

        const json = (await res.json()) as BackendLoginResponse;
        if (!json.success || !json.data) {
          throw new Error(json.message || "Invalid credentials");
        }

        const { token, user } = json.data;
        return {
          id: String(user.id),
          name: user.username,
          role: user.role,
          // Stash the backend JWT on the user object so it flows into the JWT callback below
          backendToken: token,
        } as never;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // On first sign-in, copy fields from the user object onto the JWT
      if (user) {
        const u = user as unknown as {
          id: string;
          name?: string | null;
          role: string;
          backendToken: string;
        };
        token.id = u.id;
        token.username = u.name ?? "";
        token.role = u.role;
        token.backendToken = u.backendToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose backend JWT and a flattened user on the session
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.username = (token.username as string) ?? "";
        session.user.role = (token.role as string) ?? "";
      }
      (session as unknown as { backendToken?: string }).backendToken =
        (token.backendToken as string | undefined) ?? undefined;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
