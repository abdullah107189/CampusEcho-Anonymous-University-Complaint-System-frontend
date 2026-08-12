import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../lib/store/store";
import { Megaphone, Menu, Sun, Moon, UserCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { useState } from "react";

export default function PublicLayout() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const user = useSelector((state: RootState) => state.auth.user);

  const navLinks = [
    { name: "Submit", href: "/submit" },
    { name: "Track", href: "/track" },
  ];

  // Get first letter for avatar
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Megaphone className="h-6 w-6 text-primary" />

            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
              CampusEcho
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href}>
                <Button
                  variant={
                    location.pathname === link.href ? "secondary" : "ghost"
                  }
                >
                  {link.name}
                </Button>
              </Link>
            ))}

            {/* Authentication */}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors"
              >
                {/* Avatar */}
                <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {userInitial}
                </div>

                {/* User info */}
                <div className="text-left">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-muted-foreground capitalize mt-1">
                    {user?.role || "User"}
                  </p>
                </div>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline">Admin Login</Button>
              </Link>
            )}

            {/* Theme */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </nav>

          {/* Mobile Nav */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Theme */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="p-2 rounded-md hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[250px] sm:w-[300px] flex flex-col"
              >
                <div className="mt-8 flex flex-col space-y-4">
                  {/* Navigation */}
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={
                          location.pathname === link.href
                            ? "secondary"
                            : "ghost"
                        }
                        className="w-full justify-start"
                      >
                        {link.name}
                      </Button>
                    </Link>
                  ))}

                  {/* Authentication */}
                  {isAuthenticated ? (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-md p-3 hover:bg-muted transition-colors"
                    >
                      {/* Avatar */}
                      <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {userInitial}
                      </div>

                      {/* User info */}
                      <div>
                        <p className="text-sm font-medium">
                          {user?.name || "User"}
                        </p>

                        <p className="text-xs text-muted-foreground capitalize">
                          {user?.role || "User"}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Admin Login
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t py-8 mt-auto bg-muted/20">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CampusEcho. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
