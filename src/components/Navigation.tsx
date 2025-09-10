import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpen, User, LogOut, Library } from "lucide-react";

interface NavigationProps {
  isLoggedIn?: boolean;
  username?: string;
  onLogout?: () => void;
}

const Navigation = ({ isLoggedIn = false, username = "John Doe", onLogout }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: Library },
    { path: "/borrowed", label: "My Books", icon: BookOpen, requiresAuth: true },
  ];

  const NavContent = () => (
    <>
      <div className="flex items-center gap-8">
        {navLinks.map(({ path, label, icon: Icon, requiresAuth }) => {
          if (requiresAuth && !isLoggedIn) return null;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                isActive(path) ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{username}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-primary-foreground">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Library className="h-6 w-6 text-primary" />
          <span className="gradient-primary bg-clip-text text-transparent">
            Library 📚
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between flex-1 ml-8">
          <NavContent />
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-6 mt-6">
              <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                <Library className="h-6 w-6 text-primary" />
                <span>Library 📚</span>
              </Link>
              
              <nav className="flex flex-col gap-4">
                {navLinks.map(({ path, label, icon: Icon, requiresAuth }) => {
                  if (requiresAuth && !isLoggedIn) return null;
                  
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`flex items-center gap-3 text-lg font-medium p-2 rounded-md transition-colors ${
                        isActive(path) 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:text-primary hover:bg-muted"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t pt-4 flex flex-col gap-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 p-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{username}</span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onLogout?.();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 justify-start"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full gradient-primary text-primary-foreground justify-start">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navigation;