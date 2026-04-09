import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, MapPin, Tag, Users,
  Ticket, CreditCard, LogOut, ChevronLeft, Menu, X,
  Trophy, Landmark
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";


interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/venues", label: "Venues", icon: MapPin },

  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
  { href: "/admin/promo-codes", label: "Promo Codes", icon: CreditCard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Landmark },
];


const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };


  return (
    <div className="h-screen bg-[#f7f4ee] flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-black text-white border-r-4 border-foreground transform transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 shadow-[12px_0px_0px_rgba(0,0,0,0.08)]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-5 border-b-4 border-white/10">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#ffde03] flex items-center justify-center text-black">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display text-lg tracking-tight">ANTARESTAR</span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-white/55 block">Admin Panel</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== "/admin" && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-none border border-transparent text-sm font-black uppercase tracking-[0.08em] transition-colors",
                    isActive
                      ? "bg-white text-black border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                      : "text-white/70 hover:bg-white/15 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-4 border-white/10 space-y-2">
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-white/15 hover:text-white rounded-none border border-white/15">
                <ChevronLeft className="w-4 h-4" />
                Back to Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-2 bg-[#ff3b30] text-white hover:bg-[#ff3b30]/90 rounded-none border border-black"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-20 border-b-4 border-foreground bg-white flex items-center px-4 md:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-foreground border-2 border-foreground p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <p className="font-black uppercase tracking-[0.3em] text-[10px] opacity-40">Control Room</p>
            <h1 className="font-display text-xl md:text-2xl uppercase leading-none">Admin Workspace</h1>
          </div>
          <div className="flex items-center gap-3 text-sm border-2 border-foreground px-3 py-2 bg-[#f7f4ee]">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-black">
              {user?.name?.substring(0, 1) || "A"}
            </div>
            <span className="hidden sm:inline font-bold uppercase tracking-wider">{user?.name || "Admin User"}</span>
          </div>

        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
