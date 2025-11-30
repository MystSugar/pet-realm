import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

/**
 * useAuth Hook
 *
 * Manages authentication state and actions using NextAuth
 */

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  image?: string | null;
}

interface ExtendedUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  role?: string;
  image?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const { data: session, status } = useSession();

  // Extract user data from session with type assertion for custom properties
  const sessionUser = session?.user as ExtendedUser;
  const user = sessionUser
    ? ({
        id: sessionUser.id || "",
        email: sessionUser.email || "",
        name: sessionUser.name || "",
        role: sessionUser.role || "USER",
        image: sessionUser.image,
      } as AuthUser)
    : null;

  const isLoading = status === "loading";
  const isAuthenticated = !!session && !!user;

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut({ redirect: false });
  }, []);

  const handleSignInWithEmail = useCallback(async (email: string) => {
    const result = await signIn("email", {
      email,
      redirect: false,
    });

    if (result?.error) {
      throw new Error(result.error);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn: handleSignIn,
    signOut: handleSignOut,
    signInWithEmail: handleSignInWithEmail,
  };
}

/**
 * Example usage:
 *
 * const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
 *
 * if (isLoading) return <div>Loading...</div>;
 *
 * if (isAuthenticated) {
 *   return <div>Welcome {user?.name}!</div>;
 * }
 *
 * return <button onClick={() => signIn(email, password)}>Sign In</button>;
 */
