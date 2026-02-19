import { motion } from "framer-motion";
import {
  Calendar, Users, DollarSign, Ticket,
  ArrowUp, ArrowDown, Loader2
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminStats, useRecentBookings, useUpcomingEventsStats, useRevenueHistory } from "@/hooks/useAdminStats";
import { Booking } from "@/hooks/useBookings";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentBookings, isLoading: bookingsLoading } = useRecentBookings();
  const { data: upcomingEvents, isLoading: eventsLoading } = useUpcomingEventsStats();
  const { data: revenueHistory, isLoading: historyLoading } = useRevenueHistory();


  const statCards = [
    {
      title: "Total Revenue",
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
      title: "Active Events",
      value: stats?.activeEvents.toString() || "0",
      change: "+2",
      trend: "up",
      icon: Calendar,
      color: "text-secondary",
    },
    {
      title: "Participants",
      value: stats?.totalParticipants.toLocaleString() || "0",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-accent",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="stat-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      {statsLoading ? (
                        <Skeleton className="h-8 w-24 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      )}
                      <div className={`flex items-center gap-1 mt-1 text-sm ${stat.trend === "up" ? "text-success" : "text-destructive"
                        }`}>
                        {stat.trend === "up" ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                        {stat.change}
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="font-display text-xl">Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            {historyLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueHistory}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#888', fontSize: 12 }}
                    tickFormatter={(value) => `Rp ${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">Recent Bookings</CardTitle>
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
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{booking.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {booking.Event?.title || "Event"}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium">{formatCurrency(Number(booking.total))}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${booking.payment_status === "success"
                          ? "bg-success/20 text-success"
                          : booking.payment_status === "pending"
                            ? "bg-warning/20 text-warning"
                            : "bg-destructive/20 text-destructive"
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

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-xl">Upcoming Events</CardTitle>
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
                      <div key={event.id} className="space-y-2">
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
    </AdminLayout>
  );
};

export default AdminDashboard;
