import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Calendar, Trophy, MapPin, LayoutDashboard, Ticket, LogOut, Wallet, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/ModeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const navLinks = [
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/categories", label: "Categories", icon: Trophy },
  { href: "/saved-events", label: "Saved", icon: Heart },
];

const Navbar = () => {
  const { user, signOut, isAdmin, isOrganizer } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl tracking-wider">ANTARESTAR</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-2 text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 relative pr-8">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {user.name?.substring(0, 1).toUpperCase() || "U"}
                    </div>
                    <span className="max-w-[100px] truncate">{user.name || "User"}</span>

                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isAdmin && (
                    <Link to="/admin">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {isOrganizer && (
                    <Link to="/organizer">
                      <DropdownMenuItem className="gap-2 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        Organizer Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <Link to="/my-bookings">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Ticket className="w-4 h-4" />
                      My Bookings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="btn-hero rounded-lg">
                    Register Now
                  </Button>
                </Link>
              </>
            )}
            <ModeToggle />
          </div>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        {user.name?.substring(0, 1).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold">{user.name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>

                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    {isOrganizer && (
                      <Link to="/organizer" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <LayoutDashboard className="w-4 h-4" />
                          Organizer Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link to="/my-bookings" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Ticket className="w-4 h-4" />
                        My Bookings
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <User className="w-4 h-4" />
                      Login / Register
                    </Button>
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between px-3 py-2 border-t border-border">
                <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                <ModeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
