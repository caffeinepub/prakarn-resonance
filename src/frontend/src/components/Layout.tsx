import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
  userName?: string | null;
}

export function Layout({ children, isAdmin = false, userName }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const displayName = userName ?? "Student";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navLinks = isAdmin
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/library", label: "Library", icon: BookOpen },
      ]
    : [{ to: "/library", label: "Library", icon: BookOpen }];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to={isAuthenticated ? (isAdmin ? "/dashboard" : "/library") : "/"}
              className="flex items-center gap-2.5 group"
              data-ocid="nav-logo"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm transition-smooth group-hover:bg-primary/90">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight hidden sm:block">
                Prakarn Resonance
              </span>
              <span className="font-display font-bold text-base text-foreground tracking-tight sm:hidden">
                PR
              </span>
            </Link>

            {/* Desktop nav */}
            {isAuthenticated && (
              <nav
                className="hidden md:flex items-center gap-1"
                data-ocid="nav-links"
              >
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground hover:bg-muted/60"
                    activeProps={{ className: "text-foreground bg-muted/80" }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Role badge */}
                  {isAdmin ? (
                    <Badge
                      variant="default"
                      className="hidden sm:flex bg-primary/10 text-primary border-primary/20 font-medium"
                      data-ocid="role-badge"
                    >
                      Instructor
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="hidden sm:flex font-medium"
                      data-ocid="role-badge"
                    >
                      Student
                    </Badge>
                  )}

                  {/* User menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 h-9 px-2"
                        data-ocid="nav-user-menu"
                      >
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="text-xs bg-primary/15 text-primary font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                          {displayName}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                        Signed in as
                      </DropdownMenuLabel>
                      <DropdownMenuLabel className="font-semibold -mt-1">
                        {displayName}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {navLinks.map(({ to, label, icon: Icon }) => (
                        <DropdownMenuItem
                          key={to}
                          onClick={() => router.navigate({ to })}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="text-destructive focus:text-destructive"
                        data-ocid="nav-logout"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Mobile hamburger */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    data-ocid="nav-mobile-menu"
                  >
                    {mobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </Button>
                </>
              ) : (
                <Link to="/">
                  <Button size="sm" data-ocid="nav-login-cta">
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile nav drawer */}
          {isAuthenticated && mobileMenuOpen && (
            <div className="md:hidden border-t border-border py-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-md text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground hover:bg-muted/60"
                  activeProps={{ className: "text-foreground bg-muted/80" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-2 py-2.5 rounded-md text-sm font-medium text-destructive transition-smooth hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary/15 flex items-center justify-center">
              <GraduationCap className="w-3 h-3 text-primary" />
            </div>
            <span className="font-display font-semibold text-foreground/70">
              Prakarn Resonance
            </span>
          </div>
          <p>
            &copy; {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          {isAuthenticated && (
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{displayName}</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
