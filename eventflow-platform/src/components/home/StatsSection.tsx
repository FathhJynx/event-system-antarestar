import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Trophy } from "lucide-react";
import { usePublicStats } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const StatsSection = () => {
  const { data: stats, isLoading } = usePublicStats();

  const statItems = [
    {
      icon: Calendar,
      value: stats?.totalEvents ? `${stats.totalEvents}+` : "0",
      label: "Annual Events",
      color: "text-primary",
    },
    {
      icon: Users,
      value: stats?.totalParticipants ? `${stats.totalParticipants.toLocaleString()}+` : "0",
      label: "Participants",
      color: "text-secondary",
    },
    {
      icon: MapPin,
      value: stats?.totalVenues ? `${stats.totalVenues}+` : "0",
      label: "Venues",
      color: "text-accent",
    },
    {
      icon: Trophy,
      value: stats?.totalPrizePool
        ? `${(stats.totalPrizePool / 1000000).toFixed(0)}M+`
        : "0",
      label: "Prize Pool (IDR)",
      color: "text-warning",
    },
  ];

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="stat-card text-center"
            >
              <stat.icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
              <div className="font-display text-3xl md:text-4xl mb-1">
                {isLoading ? (
                  <Skeleton className="h-10 w-24 mx-auto" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
