import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, Calendar, Trophy, LayoutDashboard, Ticket, LogOut, Heart, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/events", label: "CARI EVENT", icon: Calendar },
  { href: "/categories", label: "KATEGORI", icon: Trophy },
  { href: "/gallery", label: "GALLERY", icon: Image },
  { href: "/saved-events", label: "DISIMPAN", icon: Heart },
];

const Navbar = () => {
  const { user, signOut, isAdmin, isOrganizer } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[1100] bg-white border-b-4 border-black shadow-md">
        <div className="flex h-16 md:h-24">
          
          {/* Logo Segment */}
          <Link 
            to="/" 
            className="flex items-center justify-center px-4 md:px-10 border-r-4 border-black hover:bg-[#ffde03] transition-colors group relative overflow-hidden shrink-0"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDBMMDAgMEw0MCAwaC0yTDAgMzh6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
            <Trophy strokeWidth={3} className="w-6 h-6 md:w-10 md:h-10 text-black mr-2 md:mr-3 group-hover:rotate-12 transition-transform relative z-10" />
            <span className="font-display text-2xl md:text-5xl mt-1 md:mt-2 tracking-widest font-black uppercase text-black relative z-10">ANTARESTAR</span>
          </Link>

          {/* Spacer for Mobile */}
          <div className="flex-1 lg:hidden" />

          {/* Links Segment - Desktop */}
          <div className="hidden lg:flex flex-1 divide-x-4 divide-black border-r-4 border-black hide-scrollbar overflow-x-auto">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex-1 flex items-center justify-center text-lg md:text-xl font-black uppercase tracking-widest transition-all px-4 relative overflow-hidden group ${
                  location.pathname === link.href ? "bg-black text-white" : "text-black bg-white hover:text-white"
                }`}
              >
                <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0 ${index === 0 ? 'bg-[#ffde03]' : index === 1 ? 'bg-zinc-100' : index === 2 ? 'bg-pink-500' : 'bg-destructive'}`} />
                <span className="relative z-10 flex items-center gap-2 md:gap-3 mix-blend-difference text-white">
                  <link.icon className="w-5 h-5 md:w-6 md:h-6 shrink-0" />
                  <span className="whitespace-nowrap">{link.label}</span>
                </span>
              </Link>
            ))}
          </div>

          {/* Actions Segment - Desktop */}
          <div className="hidden lg:flex items-center divide-x-4 divide-black">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-4 h-full px-8 bg-white hover:bg-zinc-50 transition-colors cursor-pointer group outline-none shrink-0">
                    <div className="w-10 h-10 bg-white border-4 border-black shadow-[2px_2px_0px_0px_black] flex items-center justify-center text-black font-black text-lg group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
                      {user.name?.substring(0, 1).toUpperCase() || "A"}
                    </div>
                    <span className="max-w-[150px] truncate font-black uppercase text-xl text-black">{user.name || "ATLET"}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 border-4 border-black rounded-none shadow-[8px_8px_0px_0px_black] bg-white p-0 mt-2 z-[70]">
                  {isAdmin && (
                    <Link to="/admin">
                      <DropdownMenuItem className="gap-4 cursor-pointer font-black uppercase text-lg p-5 border-b-4 border-black hover:bg-[#ffde03] focus:bg-[#ffde03]">
                        <LayoutDashboard className="w-6 h-6" /> DASHBOARD ADMIN
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {isOrganizer && (
                    <Link to="/organizer">
                      <DropdownMenuItem className="gap-4 cursor-pointer font-black uppercase text-lg p-5 border-b-4 border-black hover:bg-[#ffde03] focus:bg-[#ffde03]">
                        <LayoutDashboard className="w-6 h-6" /> DASHBOARD EO
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <Link to="/profile">
                    <DropdownMenuItem className="gap-4 cursor-pointer font-black uppercase text-lg p-5 border-b-4 border-black hover:bg-[#ffde03] hover:text-black focus:bg-[#ffde03] focus:text-black">
                      <User className="w-6 h-6" /> PROFIL SAYA
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/my-bookings">
                    <DropdownMenuItem className="gap-4 cursor-pointer font-black uppercase text-lg p-5 border-b-4 border-black hover:bg-[#ffde03] hover:text-black focus:bg-[#ffde03] focus:text-black">
                      <Ticket className="w-6 h-6" /> TIKET SAYA
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="gap-4 text-destructive cursor-pointer font-black uppercase text-lg p-5 hover:bg-destructive hover:text-white focus:bg-destructive focus:text-white" onClick={handleLogout}>
                    <LogOut className="w-6 h-6" /> KELUAR AKUN
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="flex items-center justify-center gap-3 h-full px-8 bg-[#ffde03] hover:bg-black hover:text-[#ffde03] transition-colors text-black font-black tracking-widest text-lg uppercase group shrink-0">
                <User strokeWidth={3} className="w-6 h-6 group-hover:scale-110 transition-transform" />
                MASUK / DAFTAR
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center shrink-0">
             <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-full px-8 bg-[#ffde03] flex items-center justify-center text-black border-l-4 border-black hover:bg-black hover:text-[#ffde03] transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6 md:w-10 md:h-10" /> : <Menu className="w-6 h-6 md:w-10 md:h-10" />}
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[1000] bg-background pt-[4rem] md:pt-[6rem] flex flex-col lg:hidden border-b-4 border-foreground h-fit shadow-[0_16px_0px_0px_hsl(var(--foreground))]"
          >
            <div className="flex flex-col divide-y-4 divide-foreground border-t-4 border-foreground max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 divide-y-4 divide-foreground">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-4 p-6 text-2xl font-black uppercase tracking-widest hover:pl-10 transition-all ${index === 0 ? 'hover:bg-secondary' : index === 1 ? 'hover:bg-accent' : 'hover:bg-warning'} ${location.pathname === link.href ? "bg-foreground text-background" : "bg-background text-foreground"}`}
                  >
                    <link.icon className="w-7 h-7" />
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="p-0 bg-muted">
                {user ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4 bg-background p-6 border-b-4 border-foreground">
                      <div className="w-14 h-14 bg-foreground border-4 border-foreground flex items-center justify-center text-background font-black text-2xl shrink-0">
                        {user.name?.substring(0, 1).toUpperCase() || "A"}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-black text-xl uppercase tracking-widest truncate">{user.name || "ATLET"}</p>
                        <p className="font-bold text-sm text-foreground/70 truncate">{user.email}</p>
                      </div>
                    </div>

                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-start gap-4 text-xl font-black py-10 rounded-none border-b-4 border-foreground bg-primary text-foreground hover:bg-primary/85 hover:text-foreground">
                        <LayoutDashboard className="w-6 h-6" /> DASHBOARD ADMIN
                      </Button>
                    </Link>
                  )}
                    
                    <Link to="/my-bookings" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-start gap-4 text-xl font-black py-10 rounded-none border-b-4 border-foreground bg-secondary text-foreground hover:bg-secondary/85 hover:text-foreground">
                      <Ticket className="w-6 h-6" /> TIKET SAYA
                    </Button>
                  </Link>

                    <Button variant="destructive" className="w-full justify-start gap-4 text-xl font-black py-10 rounded-none hover:bg-destructive/90 hover:text-destructive-foreground" onClick={handleLogout}>
                      <LogOut className="w-6 h-6" /> KELUAR AKUN
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="w-full gap-4 text-2xl font-black py-12 rounded-none bg-accent text-accent-foreground hover:bg-accent/85 hover:text-accent-foreground flex items-center justify-center">
                      <User className="w-8 h-8" />
                      LOGIN / DAFTAR
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
