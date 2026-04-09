import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, AlertOctagon, ArrowRight, Calendar, MapPin, Sparkles } from "lucide-react";
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

const sortOptions = ["Date (Nearest)", "Date (Furthest)", "Price (Low to High)", "Price (High to Low)"];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState("Date (Nearest)");

  const { data: events, isLoading: eventsLoading } = useEvents({ status: "open" });
  const { data: categories } = useCategories();

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    const result: EventWithDetails[] = [...events].filter((event: EventWithDetails) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.venues?.city || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" ||
        event.event_categories?.slug === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "Date (Nearest)":
        result.sort((a, b) => new Date(a.date || "").getTime() - new Date(b.date || "").getTime());
        break;
      case "Date (Furthest)":
        result.sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
        break;
      case "Price (Low to High)":
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case "Price (High to Low)":
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
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
      {/* Antarestar Event Hub Header */}
      <section className="relative bg-white pt-32 pb-20 border-b-4 border-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="absolute top-8 left-8">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="bg-primary border-2 border-foreground px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_0px_black] cursor-pointer"
            >
              <span className="font-black uppercase text-sm tracking-tighter">Arena Hub</span>
              <div className="w-5 h-5 rounded-full bg-foreground border-2 border-foreground flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter text-foreground mb-4 leading-none"
          >
            Antarestar <span className="font-serif italic font-black">Events</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto px-4"
          >
            <h2 className="font-display text-2xl sm:text-2xl sm:text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 bg-foreground text-white inline-block px-4 py-2">MISI OLAHRAGA TERBESAR</h2>
            <p className="font-sans text-sm sm:text-base font-bold uppercase tracking-widest leading-relaxed opacity-60 mt-4">
              Cari lawan, temukan tim, dan taklukkan setiap arena. <br className="hidden md:block"/> 
              Pusat misi buat lo yang berani melangkah lebih jauh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Extreme Minimal Filter Section */}
      <section className="bg-white border-b-4 border-foreground sticky top-[64px] md:top-[96px] z-[40]">
        <div className="flex flex-col md:flex-row divide-y-4 md:divide-y-0 md:divide-x-4 divide-foreground h-auto md:h-20">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-foreground/40" />
            <input 
              type="text" 
              placeholder="CARI ARENA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 md:h-full pl-12 md:pl-16 pr-6 bg-transparent outline-none font-black uppercase tracking-[0.1em] md:tracking-[0.2em] placeholder:text-foreground/20 text-base md:text-lg"
            />
          </div>
          <div className="w-full md:w-80">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
               <SelectTrigger className="w-full h-16 md:h-full border-0 rounded-none bg-transparent hover:bg-muted transition-colors font-black uppercase tracking-widest text-base md:text-lg px-8">
                 <SelectValue placeholder="ARENA" />
               </SelectTrigger>
               <SelectContent className="border-4 border-foreground rounded-none shadow-none bg-white">
                 <SelectItem value="all" className="font-black uppercase py-3 border-b-2 border-foreground last:border-b-0">SEMUA KOLEKSI</SelectItem>
                 {categories?.map((cat) => (
                   <SelectItem key={cat.id} value={cat.slug} className="font-black uppercase py-3 border-b-2 border-foreground last:border-b-0">
                     {cat.name}
                   </SelectItem>
                 ))}
               </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-80">
             <Select value={sortBy} onValueChange={setSortBy}>
               <SelectTrigger className="w-full h-16 md:h-full border-0 rounded-none bg-transparent hover:bg-muted transition-colors font-black uppercase tracking-widest text-base md:text-lg px-8">
                 <SelectValue placeholder="URUTKAN" />
               </SelectTrigger>
               <SelectContent className="border-4 border-foreground rounded-none shadow-none bg-white">
                 <SelectItem value="Date (Nearest)" className="font-black uppercase py-3 border-b-2 border-foreground last:border-b-0">TERDEKAT</SelectItem>
                 <SelectItem value="Date (Furthest)" className="font-black uppercase py-3 border-b-2 border-foreground last:border-b-0">PALING JAUH</SelectItem>
                 <SelectItem value="Price (Low to High)" className="font-black uppercase py-3 border-b-2 border-foreground last:border-b-0">TERMURAH</SelectItem>
                 <SelectItem value="Price (High to Low)" className="font-black uppercase py-3 border-b-2 border-foreground last:border-b-0">TERMAHAL</SelectItem>
               </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Full-Width Studio Bento Grid */}
      <section className="bg-white min-h-screen border-t-4 border-foreground">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 border-l-4 border-foreground">
          {eventsLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="md:col-span-4 h-[500px] bg-muted animate-pulse border-r-4 border-b-4 border-foreground" />
            ))
          ) : filteredEvents.length > 0 ? (
            <>
              {filteredEvents.map((event: EventWithDetails, index) => {
                const bentoSpans = [
                  "md:col-span-8 md:row-span-2", // BIG HERO
                  "md:col-span-4 md:row-span-1",
                  "md:col-span-4 md:row-span-1",
                  "md:col-span-6 md:row-span-1",
                  "md:col-span-6 md:row-span-1",
                  "md:col-span-4 md:row-span-2",
                  "md:col-span-8 md:row-span-1",
                ];
                const span = bentoSpans[index % bentoSpans.length];

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className={`${span} relative h-[400px] md:h-auto min-h-[400px] border-r-4 border-b-4 border-foreground overflow-hidden group bg-[#f8f8f8]`}
                  >
                    <Link to={`/events/${event.id}`} className="block h-full w-full">
                      <img 
                        src={event.image || "/placeholder.svg"} 
                        alt={event.title} 
                        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                      />
                      
                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between opacity-100 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 bg-white/95">
                         <div className="flex justify-between items-start">
                            <span className="font-black uppercase tracking-tighter text-[10px] md:text-sm bg-foreground text-white px-2 md:px-3 py-1">
                              {event.event_categories?.name}
                            </span>
                            <span className="font-display text-2xl md:text-2xl md:text-4xl font-black">#{index + 1}</span>
                         </div>
                         
                         <div>
                            <h3 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase leading-tight mb-2 md:mb-4 text-foreground">
                              {event.title}
                            </h3>
                            <div className="flex items-center justify-between border-t-2 border-foreground pt-3 md:pt-3 md:pt-3 md:pt-4">
                               <div className="space-y-0.5 md:space-y-0.5 md:space-y-0.5 md:space-y-1">
                                  <p className="font-bold text-[8px] md:text-[8px] md:text-[8px] md:text-[9px] uppercase tracking-widest opacity-40">TEMPAT</p>
                                  <p className="font-black uppercase text-[10px] sm:text-xs md:text-sm">{event.venues?.city || "TBA"}</p>
                               </div>
                               <div className="text-right">
                                  <p className="font-bold text-[8px] md:text-[8px] md:text-[8px] md:text-[9px] uppercase tracking-widest opacity-40">TIKET</p>
                                  <p className="font-black uppercase text-base sm:text-lg md:text-xl text-primary">RP {Number(event.price).toLocaleString("id-ID")}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Minimal Title Label (Visible by default on desktop) */}
                      <div className="absolute bottom-6 left-6 bg-white border-2 border-foreground px-4 py-1.5 md:group-hover:opacity-0 transition-opacity hidden md:flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-primary" />
                         <p className="font-black uppercase tracking-tighter text-xs sm:text-sm">{event.title}</p>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}

              {/* Stats & CTA Integrated into Global Grid */}
              <div className="md:col-span-4 p-8 md:p-12 border-r-4 border-b-4 border-foreground h-40 md:h-auto flex flex-col justify-center">
                 <h4 className="font-bold text-[10px] md:text-[10px] md:text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-40 mb-2">KONEKSI ATLET</h4>
                 <p className="font-display text-3xl md:text-6xl font-black uppercase">GLOBAL</p>
              </div>
              <div className="md:col-span-4 p-8 md:p-12 border-r-4 border-b-4 border-foreground h-40 md:h-auto flex flex-col justify-center">
                 <h4 className="font-bold text-[10px] md:text-[10px] md:text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-40 mb-2">TOTAL MISI</h4>
                 <p className="font-display text-3xl md:text-6xl font-black uppercase">{events?.length || 0}</p>
              </div>
              <div className="md:col-span-4 p-8 md:p-12 border-r-4 border-b-4 border-foreground h-40 md:h-auto group hover:bg-foreground hover:text-white transition-colors cursor-pointer flex flex-col justify-center">
                 <Link to="/auth" className="block w-full">
                   <h4 className="font-bold text-[10px] md:text-[10px] md:text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-40 mb-2 group-hover:text-white/40">AKSI STUDIO</h4>
                   <div className="flex items-center justify-between">
                     <p className="font-display text-3xl md:text-6xl font-black uppercase">BUAT MISI</p>
                     <ArrowRight className="w-8 h-8 md:w-12 md:h-12" />
                   </div>
                 </Link>
              </div>
            </>
          ) : (
            <div className="md:col-span-12 py-40 text-center border-r-4 border-b-4 border-foreground">
               <AlertOctagon className="w-32 h-32 mx-auto mb-8 opacity-10" />
               <h3 className="font-display text-3xl md:text-6xl font-black uppercase">GALERI KOSONG, SOB</h3>
               <p className="font-bold uppercase tracking-widest opacity-40 mt-4 px-4">BELUM ADA MISI YANG COCOK SAMA KRITERIA-MU. COBA CARI YANG LAIN!</p>
               <Button 
                onClick={() => {setSearchQuery(""); handleCategoryChange("all");}}
                className="mt-12 bg-foreground text-white rounded-none px-12 h-16 font-black uppercase tracking-widest hover:bg-foreground/80"
               >
                 ULANGI PENCARIAN
               </Button>
            </div>
          )}
        </div>
      </section>

    </Layout>
  );
};

export default Events;
