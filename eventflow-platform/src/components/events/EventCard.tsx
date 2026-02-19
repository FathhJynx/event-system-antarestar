import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
  price: number;
  quota: number;
  registered: number;
  status: "open" | "closed" | "soon";
}

const EventCard = ({
  id,
  title,
  date,
  location,
  category,
  image,
  price,
  quota,
  registered,
  status,
}: EventCardProps) => {
  const spotsLeft = quota - registered;
  const percentageFilled = (registered / quota) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="event-card group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-4 left-4 badge-category">
          {category}
        </span>

        {/* Status Badge */}
        <span className={`absolute top-4 right-4 badge-status ${status}`}>
          {status === "open" ? "Open" : status === "closed" ? "Closed" : "Coming Soon"}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <h3 className="font-display text-xl line-clamp-2">{title}</h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {date}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            {spotsLeft > 0 ? `${spotsLeft} spots left` : "Fully booked"}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-warning transition-all duration-500"
              style={{ width: `${Math.min(percentageFilled, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {registered} / {quota} registered
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-xs text-muted-foreground">Starting from</div>
            <div className="font-display text-xl text-primary">
              Rp {price.toLocaleString("id-ID")}
            </div>
          </div>
          {status === 'open' ? (
            <Link to={`/events/${id}`}>
              <Button size="sm" className="gap-1">
                Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Button size="sm" variant="outline" className="gap-1 opacity-50 cursor-not-allowed" disabled>
              Closed
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
