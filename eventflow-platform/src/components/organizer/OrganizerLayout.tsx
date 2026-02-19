import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Calendar, Ticket, LogOut, ChevronLeft, Menu, X,
    Trophy, CreditCard, MapPin, Tag
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface OrganizerLayoutProps {
    children: ReactNode;
}

const menuItems = [
    { href: "/organizer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/organizer/events", label: "My Events", icon: Calendar },
    { href: "/organizer/bookings", label: "Bookings", icon: Ticket },
    { href: "/organizer/venues", label: "Venues", icon: MapPin },
    { href: "/organizer/promo-codes", label: "Promo Codes", icon: Tag },
    { href: "/organizer/payouts", label: "Payouts", icon: CreditCard },
];

const OrganizerLayout = ({ children }: OrganizerLayoutProps) => {
    const { user, signOut } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 lg:relative lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
                        <Link to="/organizer/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <span className="font-display text-lg">ANTARESTAR</span>
                                <span className="text-xs text-sidebar-foreground/60 block">Organizer Panel</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-sidebar-foreground"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.href ||
                                (item.href !== "/organizer/dashboard" && location.pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-sidebar-accent text-sidebar-primary"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-sidebar-border space-y-2">
                        <Link to="/">
                            <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground">
                                <ChevronLeft className="w-4 h-4" />
                                Back to Site
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
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
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-16 border-b border-border flex items-center px-4 gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-foreground"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                            {user?.name?.substring(0, 1) || "O"}
                        </div>
                        <span className="hidden sm:inline text-muted-foreground">{user?.name || "Organizer User"}</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default OrganizerLayout;
