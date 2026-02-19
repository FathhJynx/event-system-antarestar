import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, MapPin, SlidersHorizontal, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents, EventWithDetails } from "@/hooks/useEvents";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const sortOptions = ["Date (Nearest)", "Date (Furthest)", "Price (Low to High)", "Price (High to Low)"];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("Date (Nearest)");

  const { data: events, isLoading: eventsLoading } = useEvents({ status: "open" });
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    const result: EventWithDetails[] = [...events].filter((event: EventWithDetails) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.venues?.city || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" ||
        event.event_categories?.slug === selectedCategory;
      return matchesSearch && matchesCategory;
    });


    // Sort
    switch (sortBy) {
      case "Date (Nearest)":
        result.sort((a: EventWithDetails, b: EventWithDetails) => new Date(a.date || "").getTime() - new Date(b.date || "").getTime());
        break;
      case "Date (Furthest)":
        result.sort((a: EventWithDetails, b: EventWithDetails) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
        break;
      case "Price (Low to High)":
        result.sort((a: EventWithDetails, b: EventWithDetails) => {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          return Number(priceA) - Number(priceB);
        });
        break;
      case "Price (High to Low)":
        result.sort((a: EventWithDetails, b: EventWithDetails) => {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          return Number(priceB) - Number(priceA);
        });
        break;

    }

    return result;
  }, [events, searchQuery, selectedCategory, sortBy]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl mb-4"
          >
            ALL <span className="text-gradient">EVENTS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl"
          >
            Discover and register for upcoming sports events across Indonesia
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-background border-b border-border sticky top-16 md:top-20 z-40">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full lg:w-48 bg-card">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-56 bg-card">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{filteredEvents.length}</span> events
            </p>
          </div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event: EventWithDetails, index) => {
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
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-2xl mb-2">No Events Found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                handleCategoryChange("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
