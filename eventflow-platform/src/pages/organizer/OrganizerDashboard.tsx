import { motion } from "framer-motion";
import { Calendar, Users, DollarSign, Ticket, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import OrganizerLayout from "@/components/organizer/OrganizerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    useOrganizerStats,
    useOrganizerRecentBookings,
    useOrganizerUpcomingEvents
} from "@/hooks/useOrganizer";
import { Booking } from "@/hooks/useBookings";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
};

const OrganizerDashboard = () => {
    const { data: stats, isLoading: statsLoading } = useOrganizerStats();
    const { data: recentBookings, isLoading: bookingsLoading } = useOrganizerRecentBookings();
    const { data: upcomingEvents, isLoading: eventsLoading } = useOrganizerUpcomingEvents();

    const statCards = [
        {
            title: "My Total Revenue",
            value: stats ? formatCurrency(stats.totalRevenue) : "Rp 0",
            change: `+${stats?.revenueChange || 0}%`,
            trend: "up",
            icon: DollarSign,
            color: "text-success",
        },
        {
            title: "Total Bookings",
            value: stats?.totalBookings.toLocaleString() || "0",
            change: `+${stats?.bookingsChange || 0}%`,
            trend: "up",
            icon: Ticket,
            color: "text-primary",
        },
        {
            title: "My Active Events",
            value: stats?.activeEvents.toString() || "0",
            change: "+2",
            trend: "up",
            icon: Calendar,
            color: "text-secondary",
        },
        {
            title: "Event Participants",
            value: stats?.totalParticipants.toLocaleString() || "0",
            change: "+15.3%",
            trend: "up",
            icon: Users,
            color: "text-accent",
        },
    ];

    return (
        <OrganizerLayout>
            <div className="space-y-8">
                <section className="relative overflow-hidden border-4 border-foreground bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_black]">
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-[#ffde03] opacity-90" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="font-black uppercase text-[10px] tracking-[0.4em] opacity-40 mb-3">Organizer Control Room</p>
                            <h1 className="font-display text-4xl md:text-6xl font-black uppercase leading-none">Dashboard</h1>
                            <p className="mt-4 max-w-xl text-sm md:text-base font-bold uppercase tracking-widest opacity-60">
                                Pantau event, booking, dan performa organizer dari tampilan yang lebih seragam.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 border-4 border-foreground bg-black text-white px-4 py-3 w-fit">
                            <Sparkles className="w-5 h-5 text-[#ffde03]" />
                            <span className="font-black uppercase tracking-[0.2em] text-xs">Live Overview</span>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-4 border-foreground rounded-none bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.08)]">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.35em] opacity-40">{stat.title}</p>
                                            {statsLoading ? (
                                                <Skeleton className="h-10 w-28 mt-2" />
                                            ) : (
                                                <p className="text-3xl font-display font-black mt-2">{stat.value}</p>
                                            )}
                                            <div className={`flex items-center gap-1 mt-2 text-sm font-black uppercase ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                                                {stat.trend === "up" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                                {stat.change}
                                            </div>
                                        </div>
                                        <div className={`w-12 h-12 border-2 border-foreground flex items-center justify-center bg-[#f7f4ee] ${stat.color}`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-4 border-foreground rounded-none bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)]">
                        <CardHeader>
                            <CardTitle className="font-display text-2xl uppercase">Recent Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookingsLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Skeleton key={i} className="h-16 w-full" />
                                    ))}
                                </div>
                            ) : recentBookings && recentBookings.length > 0 ? (
                                <div className="space-y-4">
                                    {recentBookings.map((booking: Booking) => (
                                        <div key={booking.id} className="flex items-center justify-between p-4 border-2 border-foreground bg-[#f7f4ee]">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{booking.name}</p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {booking.Event?.title || "Event"}
                                                </p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="font-medium">{formatCurrency(Number(booking.total))}</p>
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 border border-foreground ${booking.payment_status === "success"
                                                    ? "bg-success/20"
                                                    : booking.payment_status === "pending"
                                                        ? "bg-warning/20"
                                                        : "bg-destructive/20 text-white"
                                                    }`}>
                                                    {booking.payment_status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No bookings yet</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-4 border-foreground rounded-none bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)]">
                        <CardHeader>
                            <CardTitle className="font-display text-2xl uppercase">My Upcoming Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {eventsLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-16 w-full" />
                                    ))}
                                </div>
                            ) : upcomingEvents && upcomingEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingEvents.map((event) => {
                                        const percentage = event.quota > 0 ? (event.registered / event.quota) * 100 : 0;
                                        return (
                                            <div key={event.id} className="space-y-2 border-b border-foreground/10 pb-4 last:border-b-0 last:pb-0">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">{event.name}</p>
                                                        <p className="text-sm text-muted-foreground">{event.date}</p>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {event.registered} / {event.quota}
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-warning transition-all duration-500"
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No upcoming events</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </OrganizerLayout>
    );
};

export default OrganizerDashboard;
