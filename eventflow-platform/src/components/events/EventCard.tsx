import { Link } from "react-router-dom";
import { Calendar, MapPin, Target, Sparkles, ArrowUpRight } from "lucide-react";
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
  const percentageFilled = Math.min((registered / quota) * 100, 100);
  const isAlmostFull = percentageFilled > 80 && status === "open";

  return (
    <div className="relative group block h-full bg-background border-4 md:border-[6px] border-foreground hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-300 flex flex-col shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
      {/* Image Header wrapper with aggressive borders */}
      <div className="relative h-[250px] sm:h-[300px] border-b-4 md:border-b-[6px] border-foreground overflow-hidden bg-foreground">
        {/* Abstract offset layer for hover */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgNDBMMDAgMEw0MCAwaC0yTDAgMzh6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')] z-10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover filter contrast-125 saturate-150 transition-all duration-700 group-hover:scale-110"
        />
        
        {/* Category Label (Tape style) */}
        <div className="absolute top-4 left-0 bg-primary text-foreground font-black uppercase tracking-widest px-4 py-1 text-xs md:text-sm border-4 border-foreground border-l-0 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] group-hover:pl-6 transition-all z-20">
          {category}
        </div>

        {/* Status Badge */}
        <div className={`absolute top-4 right-4 font-black uppercase text-sm md:text-base z-20 tracking-tighter ${status === "open" ? "bg-success text-foreground" : status === "closed" ? "bg-destructive text-foreground" : "bg-warning text-foreground"} px-2 py-1 border-4 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] group-hover:-translate-y-1 transition-transform`}>
          {status === "open" ? "GAS" : status === "closed" ? "HABIS" : "SOON"}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white relative">
        <div className="mb-6 relative">
          {/* Is Almost Full warning */}
          {isAlmostFull && (
            <div className="absolute -top-[3.5rem] sm:-top-[4.5rem] right-0 bg-warning text-foreground font-black uppercase px-2 py-1 text-[10px] sm:text-xs border-4 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] flex items-center gap-1 animate-bounce z-30 rotate-2">
              <Sparkles className="w-4 h-4 fill-current" /> MAU HABIS
            </div>
          )}

          <h3 className="font-display text-2xl md:text-3xl font-black uppercase leading-none line-clamp-3 mb-4 text-black group-hover:underline decoration-4 underline-offset-4 decoration-primary break-words">
            {title}
          </h3>

          <div className="flex flex-col gap-2 font-bold uppercase tracking-widest text-[10px] md:text-xs text-black">
            <div className="flex items-center gap-3 border-b-4 border-black pb-2">
              <div className="w-6 h-6 rounded-none bg-secondary border-2 border-black flex items-center justify-center shrink-0">
                 <Calendar className="w-3 h-3 text-black" />
              </div>
              <span className="truncate">{date}</span>
            </div>
            <div className="flex items-center gap-3 border-b-4 border-black pb-2">
              <div className="w-6 h-6 rounded-none bg-accent border-2 border-black flex items-center justify-center shrink-0">
                 <MapPin className="w-3 h-3 text-black" />
              </div>
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          {/* Progress brutalist bar */}
          <div className="mb-4 border-4 border-black p-0.5 bg-white relative overflow-hidden h-6 md:h-8 flex items-center group-hover:bg-muted transition-colors">
            <div
              className={`h-full absolute left-[2px] top-[2px] transition-all duration-700 ease-out border-r-4 border-black bg-foreground group-hover:bg-primary`}
              style={{ width: `calc(${percentageFilled}% - 4px)` }}
            />
            <div className="relative w-full flex justify-between tracking-widest text-[9px] md:text-[10px] font-black uppercase px-2 mix-blend-difference text-white">
              <span>{registered} / {quota} JOIN</span>
              <span className="flex items-center gap-1">TERISI {percentageFilled.toFixed(0)}%</span>
            </div>
          </div>

          <div className="flex items-end justify-between border-t-4 border-black pt-3">
            <div>
              <div className="text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-primary text-black inline-block px-1.5 mb-1 border-2 border-black">
                TIKET MASUK
              </div>
              <div className="font-display text-xl md:text-2xl text-black font-black">
                RP {price.toLocaleString("id-ID")}
              </div>
            </div>
            
            {status === 'open' ? (
              <Link to={`/events/${id}`}>
                <Button size="icon" className="w-10 h-10 md:w-12 md:h-12 border-4 border-black shadow-[2px_2px_0px_0px_black] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none hover:bg-secondary rounded-none shrink-0 bg-white text-black transition-all">
                  <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </Link>
            ) : (
              <Button size="icon" disabled className="w-10 h-10 md:w-12 md:h-12 border-4 border-black shadow-none rounded-none shrink-0 opacity-50 bg-muted">
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-black" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
