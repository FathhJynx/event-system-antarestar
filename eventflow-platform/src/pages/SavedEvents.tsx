import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Skull, Sparkles, MapPin, Calendar, Search } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents, EventWithDetails } from "@/hooks/useEvents";

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
      <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white">
        {/* Collector Hero: Scattered Product Layout */}
        <section className="relative w-full py-32 md:py-48 border-b-2 border-black overflow-hidden flex flex-col items-center justify-center text-center px-4">
            {/* Scattered Decorative Floating Images */}
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-20 left-[5%] md:left-[10%] w-32 md:w-56 h-40 md:h-64 border-2 border-black rotate-[-12deg] hidden xl:block overflow-hidden shadow-xl"
            >
               <img src="/images/keringat-ambisi.png" className="w-full h-full object-cover grayscale" alt="Scattered 1" />
            </motion.div>
            <motion.div 
               animate={{ y: [0, 20, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute bottom-20 right-[5%] md:right-[15%] w-32 md:w-64 h-48 md:h-80 border-2 border-black rotate-[8deg] hidden xl:block overflow-hidden shadow-2xl"
            >
               <img src="/images/media__1775610837459.png" className="w-full h-full object-cover grayscale" alt="Scattered 2" />
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="relative z-10"
            >
               <h1 className="font-display text-5xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black uppercase tracking-tighter leading-none mb-6">
                  INCARAN
               </h1>
               <h2 className="text-base md:text-2xl font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mb-8">Koleksi Misi Terpilih</h2>
               <div className="w-24 h-1 bg-black mx-auto mb-10" />
               <p className="max-w-xl mx-auto font-bold text-sm md:text-base uppercase tracking-widest leading-relaxed opacity-60">
                  Setiap misi di halaman ini adalah target yang lo pilih sendiri. <br/> 
                  Kurasi perjuangan lo, buktikan lo kolektor adrenalin sejati.
               </p>
            </motion.div>
        </section>

        {/* Curator Grid: 3-Column Precise Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {!user ? (
            <div className="col-span-full py-40 px-4 text-center">
               <Skull className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-6 md:mb-10" />
               <h3 className="font-display text-3xl md:text-3xl md:text-6xl font-black uppercase mb-6">AKSES TERBATAS</h3>
               <p className="font-bold text-lg uppercase mb-12 opacity-40">Hanya untuk member terdaftar yang bisa kurasi misi.</p>
               <Link to="/auth">
                  <Button className="h-12 md:h-16 px-8 md:px-12 bg-black text-white hover:bg-zinc-800 transition-all text-lg md:text-xl font-black rounded-none">
                     IDENTIFIKASI DIRI <ArrowRight className="ml-4" />
                  </Button>
               </Link>
            </div>
          ) : isLoading ? (
            Array(6).fill(0).map((_, i) => (
               <div key={i} className="aspect-square bg-zinc-50 border-r-2 border-b-2 border-black animate-pulse" />
            ))
          ) : savedEvents.length > 0 ? (
            savedEvents.map((event: EventWithDetails, index) => (
                <motion.div
                    key={event.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="group relative border-r-2 border-b-2 border-black bg-white overflow-hidden flex flex-col"
                >
                    {/* Collection Item Box */}
                    <Link to={`/events/${event.id}`} className="block relative aspect-[4/5] md:aspect-square overflow-hidden border-b-2 border-black">
                        <img 
                            src={event.image || "/placeholder.svg"} 
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 origin-bottom"
                        />
                        <div className="absolute top-6 left-6">
                           <div className="bg-white px-4 py-2 border-2 border-black font-black text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_0px_black]">
                              {event.event_categories?.name}
                           </div>
                        </div>
                    </Link>

                    {/* Metadata: Center Aligned Style */}
                    <div className="p-6 md:p-6 md:p-10 flex flex-col items-center text-center">
                        <h3 className="font-display text-2xl md:text-2xl md:text-4xl font-black uppercase leading-none mb-4 group-hover:tracking-wider transition-all">
                           {event.title}
                        </h3>
                        <div className="flex flex-col items-center gap-2 font-bold text-[8px] md:text-[10px] uppercase tracking-[0.3em] opacity-40 mb-4 md:mb-8">
                           <div className="flex items-center gap-2 text-black">
                              <Calendar className="w-3 h-3 text-black" />
                              {new Date(event.date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                           </div>
                           <span>•</span>
                           <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-black" />
                              {event.venues?.city || "ARENA"}
                           </div>
                        </div>

                        {/* Minimalist Action */}
                        <div className="flex items-center gap-4">
                           <button className="w-12 h-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
                              <Heart className="w-5 h-5 fill-current" />
                           </button>
                           <Link to={`/events/${event.id}`}>
                              <Button className="h-12 px-10 bg-black text-white hover:bg-zinc-800 transition-all font-black text-sm uppercase rounded-none tracking-widest">
                                 LIHAT DETAIL
                              </Button>
                           </Link>
                        </div>
                    </div>
                </motion.div>
            ))
          ) : (
            <div className="col-span-full py-40 px-4 text-center">
               <Heart className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-6 md:mb-10 opacity-10" />
               <h3 className="font-display text-3xl md:text-3xl md:text-6xl font-black uppercase mb-6">KOLEKSI KOSONG</h3>
               <p className="font-bold text-lg uppercase mb-12 opacity-40 max-w-md mx-auto">Belum ada misi yang lo jadikan target incaran saat ini.</p>
               <Link to="/events">
                  <Button className="h-12 md:h-16 px-8 md:px-12 bg-black text-white hover:bg-zinc-800 transition-all text-lg md:text-xl font-black rounded-none">
                     CARI MISI SEKARANG <ArrowRight className="ml-4" />
                  </Button>
               </Link>
            </div>
          )}
        </div>

        {/* Collector Bottom Bar */}
        {savedEvents.length > 0 && (
           <div className="w-full py-12 px-10 border-b-2 border-black flex items-center justify-between">
              <div className="font-black uppercase text-xs tracking-[0.3em] opacity-40">JUMLAH KOLEKSI: {savedEvents.length} ITEM</div>
              <div className="font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-6">
                 <span>ANTARESTAR COLLECTORS EDITION</span>
                 <div className="w-10 h-[1px] bg-black opacity-20" />
                 <span>EST. 2024</span>
              </div>
           </div>
        )}
      </div>
    </Layout>
    );
};

export default SavedEvents;
