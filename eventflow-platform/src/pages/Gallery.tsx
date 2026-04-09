import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useEvents } from "@/hooks/useEvents";
import { Zap, Target } from "lucide-react";

const Gallery = () => {
  const { data: events } = useEvents({ limit: 40 });

  return (
    <Layout>
      <div className="bg-white min-h-screen text-black font-sans">
        
        {/* Gallery Hero: Editorial Archive Style */}
        <section className="relative border-b-4 border-black py-20 px-8 md:px-24 bg-zinc-50 overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDEwTDEwIDIwTDIwIDMwTDMwIDIwTDIwIDExWiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-repeat" />
           
           <div className="flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
              <div className="max-w-4xl">
                 <div className="flex items-center gap-4 mb-4 md:mb-8">
                    <span className="bg-black text-[#ffde03] px-4 py-1 font-sans font-black uppercase text-xs tracking-[0.4em]">ARCHIVE • 001</span>
                    <div className="h-[2px] w-12 md:w-24 bg-black" />
                 </div>
                 <h1 className="font-display text-7xl md:text-[14rem] font-black uppercase leading-[0.8] tracking-tighter drop-shadow-[8px_8px_0px_rgba(255,62,48,0.2)]">
                    VISUAL<br/>CORE
                 </h1>
                 <p className="mt-8 md:mt-12 font-sans font-bold text-lg md:text-2xl uppercase tracking-tighter max-w-2xl opacity-60">
                    Koleksi dokumentasi arena, keringat, dan ambisi. Setiap piksel menyimpan cerita perjuangan di garis start hingga finish.
                 </p>
              </div>
              
              <div className="hidden md:flex gap-4">
                 <div className="w-24 h-24 border-4 border-black flex items-center justify-center animate-spin-slow">
                    <Zap className="w-10 h-10" />
                 </div>
                 <div className="w-24 h-24 bg-black text-white flex items-center justify-center">
                    <Target className="w-10 h-10" />
                 </div>
              </div>
           </div>
        </section>

        {/* Dynamic Studio Bento Grid */}
        <section className="p-0 border-b-4 border-black">
           <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[300px] md:auto-rows-[400px]">
              {events?.map((event, i) => {
                 const bentoSpans = [
                    "md:col-span-8 md:row-span-2", // Large Hero
                    "md:col-span-4 md:row-span-1", // Standard
                    "md:col-span-4 md:row-span-1", // Standard
                    "md:col-span-6 md:row-span-1", // Wide
                    "md:col-span-6 md:row-span-1", // Wide
                    "md:col-span-4 md:row-span-2", // Vertical Tall
                    "md:col-span-8 md:row-span-1", // Horizontal Wide
                 ];
                 const span = bentoSpans[i % bentoSpans.length];

                 return (
                    <motion.div 
                       key={event.id}
                       initial={{ opacity: 0 }}
                       whileInView={{ opacity: 1 }}
                       viewport={{ once: true }}
                       className={`${span} relative group border-r-4 border-b-4 border-black overflow-hidden bg-black cursor-crosshair`}
                    >
                       <img 
                          src={event.image || "/placeholder.svg"} 
                          alt={event.title}
                          className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                       />
                       
                       {/* Subtle Label on Hover */}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                          <span className="font-serif italic font-black text-white text-3xl mb-2">{event.title}</span>
                          <div className="flex items-center gap-4">
                             <span className="bg-[#ffde03] text-black px-3 py-1 font-sans font-black uppercase text-[10px] tracking-widest">{event.event_categories?.name || "ACTIVITY"}</span>
                             <div className="h-[2px] flex-1 bg-[#ffde03]/30" />
                          </div>
                       </div>

                       {/* Artifact ID Overlay */}
                       <div className="absolute top-6 left-6 font-display text-white/20 text-4xl group-hover:text-[#ffde03] transition-colors pointer-events-none">
                          #{i.toString().padStart(3, '0')}
                       </div>
                    </motion.div>
                 );
              })}
           </div>
        </section>

        {/* Bottom Marquee Tape */}
        <div className="w-full bg-[#ffde03] h-16 border-b-4 border-black overflow-hidden flex items-center">
           <motion.div 
             animate={{ x: ["0%", "-50%"] }} 
             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
             className="flex whitespace-nowrap gap-12 font-black uppercase text-2xl tracking-[0.5em] text-black"
           >
              {Array(10).fill("STUDIO DOCUMENTATION • VISUAL DATA ARCHIVE • ARENA RECORDS •").map((t, i) => <span key={i}>{t}</span>)}
           </motion.div>
        </div>

      </div>
    </Layout>
  );
};

export default Gallery;
