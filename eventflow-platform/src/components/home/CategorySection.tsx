import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Footprints, Bike, Waves, Mountain, Timer, Medal, LucideIcon } from "lucide-react";
import { useCategoriesWithCount } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, LucideIcon> = {
  marathon: Footprints,
  "trail-running": Mountain,
  cycling: Bike,
  triathlon: Waves,
  obstacle: Timer,
  virtual: Medal,
};

const colorMap: Record<string, string> = {
  marathon: "bg-primary/20 text-primary",
  "trail-running": "bg-success/20 text-success",
  cycling: "bg-secondary/20 text-secondary",
  triathlon: "bg-accent/20 text-accent",
  obstacle: "bg-warning/20 text-warning",
  virtual: "bg-destructive/20 text-destructive",
};

const CategorySection = () => {
  const { data: categories, isLoading } = useCategoriesWithCount();

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            EXPLORE BY <span className="text-gradient">CATEGORY</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find your perfect challenge from our wide range of sports categories
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 rounded-xl border border-border bg-background">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-14 h-14 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = iconMap[category.slug] || Footprints;
              const color = colorMap[category.slug] || "bg-primary/20 text-primary";

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/events?category=${category.slug}`}
                    className="block p-6 rounded-xl border border-border bg-background hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display text-xl group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <span className="text-sm text-muted-foreground">
                            {category.event_count || 0} events
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {category.description || "Explore exciting events in this category"}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No categories available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
