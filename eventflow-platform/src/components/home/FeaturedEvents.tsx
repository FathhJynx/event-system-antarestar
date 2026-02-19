import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/events/EventCard";
import { useEvents, EventWithDetails } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedEvents = () => {
  const { data: events, isLoading } = useEvents({
    status: "open",
    featured: true,
    limit: 3
  });

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl section-header"
            >
              FEATURED EVENTS
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mt-6 max-w-xl"
            >
              Don't miss out on the most anticipated sports events in Indonesia. Register now before slots run out!
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/events">
              <Button variant="outline" className="gap-2">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: EventWithDetails, index) => {
              // Registration count should ideally come from backend, but for now we'll default to 0
              // or handle it if we add it to the API response
              const registered = event.registered_count || 0;
              const quota = event.max_participants || 0;
              const price = Number(event.price) || 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCard
                    id={event.id}
                    title={event.title}
                    date={event.date ? new Date(event.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) : "TBA"}
                    location={event.venues?.city ? (event.venues.province ? `${event.venues.city}, ${event.venues.province}` : event.venues.city) : "TBA"}
                    category={event.event_categories?.name || "Event"}
                    image={event.image || "/placeholder.svg"}
                    price={price}
                    quota={quota}
                    registered={registered}
                    status={event.status === 'open' ? 'open' : 'closed'}
                  />
                </motion.div>
              );
            })}

          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured events available</p>
            <Link to="/events" className="mt-4 inline-block">
              <Button>Browse All Events</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
