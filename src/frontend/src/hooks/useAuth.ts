import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export type UserRole = "admin" | "user" | "guest";

/**
 * Central auth hook — wraps Internet Identity and provides
 * login / logout helpers plus a role derived from the actor.
 *
 * Role is determined by the backend's assignRole / getCallerUserProfile flow.
 * The first authenticated user automatically becomes admin.
 */
export function useAuth() {
  const { login, clear, isLoginSuccess, identity, loginStatus } =
    useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity && isLoginSuccess;
  const isLoading =
    loginStatus === "logging-in" || loginStatus === "initializing";

  const principalText = identity ? identity.getPrincipal().toString() : null;

  const handleLogin = useCallback(async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === "User is already authenticated") {
        await clear();
        setTimeout(() => login(), 300);
      } else {
        console.error("Login error:", err);
      }
    }
  }, [login, clear]);

  const handleLogout = useCallback(async () => {
    await clear();
    queryClient.clear();
  }, [clear, queryClient]);

  return {
    isAuthenticated,
    isLoading,
    principalText,
    identity,
    login: handleLogin,
    logout: handleLogout,
    isLoginSuccess,
    loginStatus,
  };
}
