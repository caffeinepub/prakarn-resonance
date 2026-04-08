import { Skeleton } from "@/components/ui/skeleton";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  /** If true, only admin/instructor users may access this route */
  requireAdmin?: boolean;
  /** Whether the current user has the admin/instructor role */
  isAdmin?: boolean;
  /** Whether role detection is still in progress */
  isRoleLoading?: boolean;
}

/**
 * Wraps a route and redirects unauthenticated users to `/`.
 * If `requireAdmin` is true, non-admin authenticated users are
 * redirected to `/library`.
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
  isAdmin = false,
  isRoleLoading = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Still detecting auth state
  if (isLoading || (isAuthenticated && isRoleLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-64" data-ocid="protected-route-loading">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-6 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  // Not authenticated → login page
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Authenticated but not admin → student library
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/library" />;
  }

  return <>{children}</>;
}
