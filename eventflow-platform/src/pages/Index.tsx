import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Search, Menu, Zap, Target, Users2, Calendar } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useEvents, usePublicStats } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data: stats } = usePublicStats();
  const { data: events } = useEvents({ status: "open", featured: true, limit: 12 });

  return (
    <Layout>
      <div className="bg-white min-h-screen text-black font-sans selection:bg-pink-500 selection:text-white">
        
        {/* Top Studio Tape: High impact scrolling text */}
        <div className="w-full bg-[#ffde03] h-14 md:h-20 border-b-4 border-black overflow-hidden flex items-center relative z-20">
           <div className="absolute inset-0 opacity-40 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDEwTDEwIDIwTDIwIDMwTDMwIDIwTDIwIDEwWiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-repeat" />
           <motion.div 
             animate={{ x: ["0%", "-50%"] }} 
             transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
             className="flex whitespace-nowrap gap-12 font-black uppercase text-2xl md:text-4xl tracking-[0.3em] relative z-10"
           >
              {Array(10).fill("ANTARESTAR STUDIO • TEMUKAN MISI • GASPOL JANGAN KASIH KENDOR •").map((t, i) => <span key={i}>{t}</span>)}
           </motion.div>
        </div>

        {/* Chaotic Masterpiece Grid */}
        <section className="relative">
           <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-auto md:auto-rows-[400px]">
              
              {/* Box 1: Hero - Clear Value Proposition */}
              <div className="md:col-span-8 md:row-span-2 relative border-b-4 md:border-r-4 border-black bg-zinc-200 overflow-hidden group min-h-[500px] md:min-h-0">
                 <img src="/images/keringat-ambisi.png" className="absolute inset-0 w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 transition-all duration-1000" />
                 <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
                 <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                    <span className="bg-black text-white px-4 py-2 font-black uppercase text-[10px] tracking-[0.5em] w-fit mb-4 md:mb-6 animate-pulse">MISSION START</span>
                    <h1 className="font-display text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[11rem] font-black leading-[0.85] text-white uppercase tracking-tighter">
                       GASPOL<br/>
                       <span className="text-stroke-white text-transparent">BATAS</span><br/>
                       ARENAMU
                     </h1>
                    <p className="mt-6 md:mt-10 font-sans font-bold text-white text-base md:text-lg lg:text-xl uppercase tracking-tighter opacity-70 max-w-xl">Platform pencarian event lari & olahraga paling gokil se-Indonesia. Temukan misimu hari ini.</p>
                 </div>
              </div>

              {/* Box 2: Featured Arena exhibit */}
              <div className="md:col-span-4 md:row-span-2 relative border-b-4 border-black bg-white group overflow-hidden min-h-[400px] md:min-h-0">
                 <img src={events?.[0]?.image || "/placeholder.svg"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                 <div className="absolute top-10 left-6 right-6 md:left-10 md:right-10 bg-[#ffde03] border-4 border-black p-4 md:p-6 rotate-[-4deg] group-hover:rotate-0 transition-transform z-10 text-center shadow-[6px_6px_0px_black] md:shadow-[8px_8px_0px_black]">
                    <p className="font-sans font-black text-[10px] md:text-xs uppercase tracking-widest">ARENA TERBAIK MINGGU INI</p>
                    <h3 className="font-display font-black text-3xl md:text-4xl uppercase mt-2">{events?.[0]?.title || "Loading Mission..."}</h3>
                 </div>
                 <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                    <Link to={`/events/${events?.[0]?.id}`}>
                       <Button className="rounded-none border-4 border-black bg-white text-black font-sans font-black px-8 md:px-10 py-4 md:py-6 hover:bg-black hover:text-white shadow-[6px_6px_0px_black]">LIHAT MISI</Button>
                    </Link>
                 </div>
              </div>

              {/* Box 3: Functional Search Gallery Style */}
              <div className="md:col-span-4 md:row-span-1 border-b-4 md:border-r-4 border-black relative overflow-hidden flex flex-col justify-center items-center group cursor-pointer bg-white min-h-[300px] md:min-h-0">
                 <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMzBMMDYwIDMwTDAgMEw2MCAweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIi8+PC9zdmc+')] bg-repeat" />
                 <Link to="/events" className="flex flex-col items-center">
                    <span className="font-serif text-[6rem] md:text-[10rem] font-black italic tracking-tighter opacity-100 group-hover:scale-110 transition-transform text-black/20 md:text-black/100">Cari</span>
                    <div className="absolute bottom-10 flex items-center gap-4 border-b-4 border-black px-6 py-3 bg-white hover:bg-zinc-100 shadow-[4px_4px_0px_black]">
                       <Search className="w-6 h-6 md:w-8 md:h-8" />
                       <span className="font-sans font-black uppercase text-[10px] md:text-sm tracking-widest">TELUSURI SEMUA EVENT</span>
                    </div>
                 </Link>
              </div>

              {/* Box 4: Urban/Brick Marketing Box */}
              <div className="md:col-span-8 md:row-span-1 border-b-4 border-black bg-[#ff3b30] relative overflow-hidden flex items-center justify-center group min-h-[400px] md:min-h-0">
                 <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijc4IiBoZWlnaHQ9IjM4IiB4PSIxIiB5PSIxIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjxyZWN0IHdpZHRoPSIzOCIgaGVpZ2h0PSIzOCIgeD0iMzkiIHk9IjIxeCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] bg-repeat" />
                 <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center gap-6 md:gap-12 p-8 md:p-12">
                      <div className="w-48 md:w-1/2 aspect-square border-4 border-black bg-white overflow-hidden shadow-[8px_8px_0px_0px_black] md:shadow-[12px_12px_0px_0px_black] group-hover:scale-95 transition-transform md:rotate-2 group-hover:rotate-0">
                         <img src={events?.[1]?.image || "/placeholder.svg"} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700" />
                      </div>
                      <div className="text-white flex flex-col gap-4 md:gap-6 text-center md:text-left">
                         <h3 className="font-display text-4xl md:text-6xl font-black uppercase leading-none drop-shadow-[4px_4px_0px_black]">GABUNG<br/>EKOSISTEM</h3>
                         <p className="font-sans font-bold text-sm md:text-lg uppercase tracking-tight max-w-xs drop-shadow-[2px_2px_0px_black]">Jadilah bagian dari ribuan kolektor medali dan pemburu garis finish.</p>
                         <Link to="/auth">
                            <Button className="rounded-none bg-white text-black border-4 border-black font-sans font-black px-10 md:px-12 py-6 md:py-8 hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_black] md:shadow-[8px_8px_0px_black]">DAFTAR GRATIS</Button>
                         </Link>
                      </div>
                 </div>
              </div>

              {/* Box 5: Detailed Statistics Horizontal */}
              <div className="md:col-span-12 border-b-4 border-black grid grid-cols-2 lg:grid-cols-4 divide-y-4 md:divide-y-0 lg:divide-x-4 divide-black h-auto md:h-64">
                  <div className="flex flex-col justify-center items-center p-6 md:p-8 bg-zinc-50 hover:bg-black hover:text-white transition-colors group border-r-4 border-black lg:border-r-0">
                     <Target className="w-8 h-8 md:w-10 md:h-10 mb-4 opacity-40 group-hover:opacity-100 group-hover:animate-bounce" />
                     <span className="font-display text-5xl md:text-9xl font-black px-4">{stats?.totalEvents || "0"}</span>
                     <span className="font-sans font-black uppercase text-[8px] md:text-[10px] tracking-[0.4em] mt-2 md:mt-4">ARENA TERDAFTAR</span>
                  </div>
                  <div className="flex flex-col justify-center items-center p-6 md:p-8 bg-[#ffde03] hover:bg-black hover:text-white transition-colors group">
                     <Users2 className="w-8 h-8 md:w-10 md:h-10 mb-4 opacity-40 group-hover:opacity-100 group-hover:animate-spin" />
                     <span className="font-display text-5xl md:text-9xl font-black px-4">{stats?.totalParticipants || "0"}</span>
                     <span className="font-sans font-black uppercase text-[8px] md:text-[10px] tracking-[0.4em] mt-2 md:mt-4">PENGGUNA AKTIF</span>
                  </div>
                  <div className="flex flex-col justify-center items-center p-6 md:p-8 bg-zinc-50 hover:bg-black hover:text-white transition-colors group border-r-4 border-black lg:border-r-0">
                     <Zap className="w-8 h-8 md:w-10 md:h-10 mb-4 opacity-40 group-hover:opacity-100 group-hover:scale-125" />
                     <span className="font-display text-5xl md:text-9xl font-black px-4">12</span>
                     <span className="font-sans font-black uppercase text-[8px] md:text-[10px] tracking-[0.4em] mt-2 md:mt-4 text-center">KATEGORI OLAHRAGA</span>
                  </div>
                  <div className="flex flex-col justify-center items-center p-6 md:p-8 bg-pink-500 text-white hover:bg-black transition-colors group">
                     <Calendar className="w-8 h-8 md:w-10 md:h-10 mb-4 opacity-40 group-hover:opacity-100" />
                     <span className="font-display text-5xl md:text-9xl font-black px-4">24/7</span>
                     <span className="font-sans font-black uppercase text-[8px] md:text-[10px] tracking-[0.4em] mt-2 md:mt-4 text-center">MONITORING</span>
                  </div>
              </div>
           </div>
        </section>

        {/* Gallery Feed Header */}
        <section className="py-12 md:py-20 px-6 md:px-24 border-b-4 border-black flex flex-col md:flex-row items-center md:items-end justify-between gap-12 bg-white relative text-center md:text-left">
           <div className="max-w-3xl">
              <span className="font-black text-pink-500 uppercase tracking-widest mb-6 block border-l-0 md:border-l-4 border-pink-500 pl-0 md:pl-6 text-sm">KATALOG MISI</span>
              <h2 className="font-display text-5xl md:text-[10rem] font-black uppercase leading-[0.8] tracking-tighter">ANTREAN<br/>START</h2>
              <p className="mt-6 md:mt-8 font-bold text-lg md:text-2xl uppercase tracking-tight opacity-60">Jelajahi berbagai pilihan arena dan jadilah juara di setiap lintasan.</p>
           </div>
           <Link to="/events" className="group">
              <div className="flex items-center gap-6 md:gap-8 font-black uppercase tracking-[0.3em] text-lg md:text-2xl">
                 LIHAT SEMUA <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-black rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-[6px_6px_0px_rgba(0,0,0,0.1)] group-hover:shadow-none"><ArrowRight className="w-6 h-6 md:w-10 md:h-10" /></div>
              </div>
           </Link>
        </section>

        {/* Dynamic Gallery Strip: Edge-to-edge layout */}
        <section className="bg-black grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0 border-b-4 border-black border-l-4">
           {events?.slice(2, 8).map((event, i) => (
              <Link to={`/events/${event.id}`} key={i} className="aspect-[3/4] bg-white relative group overflow-hidden border-r-4 border-black last:border-r-0">
                 <img src={event.image || "/placeholder.svg"} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                 <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t-4 border-black translate-y-full group-hover:translate-y-0 transition-all z-20">
                    <p className="font-black uppercase text-[10px] tracking-widest text-center truncate mb-4">{event.title}</p>
                    <div className="flex justify-center"><Button className="rounded-none bg-black text-white font-black text-[8px] h-7 px-3 uppercase">VIEW MISSION</Button></div>
                 </div>
              </Link>
           ))}
        </section>

        {/* Final CTA Strip: The ultimate closer */}
        <div className="w-full h-48 md:h-72 bg-[#ffde03] text-black border-b-4 border-black flex items-center justify-center overflow-hidden hover:bg-black hover:text-[#ffde03] transition-all cursor-pointer group">
           <Link to="/auth" className="flex items-center gap-6 md:gap-12 w-full justify-center p-6 text-center">
              <div className="flex flex-col items-center">
                 <span className="font-display text-4xl md:text-7xl lg:text-[9rem] font-black uppercase tracking-tighter leading-[0.85] transition-all group-hover:tracking-widest">SIAP BERAKSI?</span>
                 <span className="font-display uppercase tracking-[0.3em] text-xs md:text-lg mt-4 md:mt-6 bg-black text-[#ffde03] px-6 md:px-10 py-2 md:py-3 group-hover:bg-[#ffde03] group-hover:text-black transition-colors">DAFTAR SEKARANG</span>
              </div>
              <ArrowRight className="w-16 h-16 md:w-32 md:h-32 group-hover:translate-x-24 transition-transform hidden md:block" />
           </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
