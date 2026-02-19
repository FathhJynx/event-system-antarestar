import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Calendar, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents, EventWithDetails } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

const SavedEvents = () => {
    const { user } = useAuth();
    const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
    const { data: events, isLoading } = useEvents({ status: "open" });

    useEffect(() => {
        if (user) {
            const saved = JSON.parse(localStorage.getItem(`savedEvents_${user.id}`) || "[]");
            setSavedEventIds(saved);
        }
    }, [user]);

    const savedEvents = events?.filter((event) => savedEventIds.includes(event.id)) || [];

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 md:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="font-display text-4xl md:text-5xl mb-4">Saved Events</h1>
                    <p className="text-muted-foreground max-w-2xl">
                        Your personal collection of events you're interested in.
                    </p>
                </motion.div>

                {!user ? (
                    <div className="text-center py-20 bg-card rounded-2xl border border-border">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-display text-2xl mb-2">Please Login</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            You need to be logged in to view and manage your saved events.
                        </p>
                        <Link to="/auth">
                            <Button className="gap-2">
                                Login / Register <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                ) : isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
                        ))}
                    </div>
                ) : savedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedEvents.map((event: EventWithDetails, index) => {
                            const registered = event.registered_count || 0;
                            const quota = event.max_participants || 0;
                            const price = Number(event.price) || 0;

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
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
                    <div className="text-center py-20 bg-card rounded-2xl border border-border">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-display text-2xl mb-2">No Saved Events</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            You haven't saved any events yet. Browse our events and click the heart icon to save them for later.
                        </p>
                        <Link to="/events">
                            <Button className="gap-2">
                                Browse Events <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default SavedEvents;
