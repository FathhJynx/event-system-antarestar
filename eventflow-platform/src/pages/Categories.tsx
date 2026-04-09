import Layout from "@/components/layout/Layout";
import { useCategories } from "@/hooks/useCategories";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Box } from "lucide-react";

const Categories = () => {
    const { data: categories, isLoading } = useCategories();
    
    // Abstract geometric SVGs for category backgrounds
    const patterns = [
        "radial-gradient(circle at 10% 20%, hsl(var(--primary)) 0%, transparent 20%)",
        "linear-gradient(45deg, hsl(var(--secondary)) 25%, transparent 25%, transparent 75%, hsl(var(--secondary)) 75%, hsl(var(--secondary)))",
        "repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--accent)) 10px, hsl(var(--accent)) 20px)",
        "radial-gradient(circle, hsl(var(--warning)) 10%, transparent 10%)",
        "linear-gradient(135deg, hsl(var(--destructive)) 25%, transparent 25%)"
    ];

    return (
    <Layout>
      {/* Clean Studio Category Hero */}
      <section className="relative w-full min-h-[50vh] md:h-[60vh] lg:h-[75vh] border-b-4 border-foreground overflow-hidden bg-white flex flex-col md:flex-row">
        {/* Left Side: Bold Typography */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center p-6 md:p-12 lg:p-20 relative z-20 border-r-0 md:border-r-4 border-foreground">
           <motion.div
             initial={{ x: -100, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
           >
            <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-black uppercase leading-[0.9] md:leading-[0.85] tracking-tighter mb-4 md:mb-8 px-1 md:px-2">
               PILIH<br/>
               <span className="text-stroke">ARENA</span>
            </h1>

              <div className="max-w-md">
                 <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black uppercase tracking-tight mb-2 md:mb-4">Eksplorasi Passion Lo.</h2>
                 <p className="font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider md:tracking-widest leading-relaxed opacity-60">
                    Gak usah ribet. Pilih kategori event yang paling cocok buat gaya lo. Dari lari santai sampai kompetisi ekstrem, semua ada di sini.
                 </p>
              </div>
           </motion.div>
        </div>

        {/* Right Side: Cinematic Visual Only */}
        <div className="w-full md:w-1/2 h-40 md:h-full relative overflow-hidden bg-neutral-100 group">
           <img
             src="/images/keringat-ambisi.png"
             alt="Athlete Hero"
             className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
           />
           <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        </div>
      </section>

      {/* Clean Vertical Directory Categories List */}
      <section className="bg-white min-h-screen border-t-0 border-foreground">
        <div className="w-full flex flex-col border-l-4 border-foreground">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-40 bg-muted animate-pulse border-b-4 border-foreground" />
            ))
          ) : (
            <>
              {categories?.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="group relative border-b-4 border-r-0 md:border-r-4 border-foreground overflow-hidden bg-white hover:bg-foreground hover:text-white transition-colors"
                >
                  <Link to={`/events?category=${category.slug}`} className="flex flex-col md:flex-row items-stretch md:items-center min-h-[120px] sm:min-h-[140px] cursor-pointer">
                    {/* Category Title Section */}
                    <div className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                       <div className="max-w-xl">
                          <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-7xl font-black uppercase leading-none group-hover:tracking-wider transition-all">
                             {category.name}
                          </h3>
                       </div>

                       <div className="md:max-w-md border-l-0 md:border-l-4 border-foreground/10 md:pl-6 lg:pl-8 group-hover:border-primary transition-colors">
                          <p className="font-bold text-xs sm:text-sm md:text-base uppercase tracking-wider md:tracking-widest leading-relaxed opacity-60 group-hover:opacity-100 line-clamp-2 sm:line-clamp-none">
                             {category.description || "Lihat semua misi di kategori ini dan tunjukkan kemampuan lo sekarang juga."}
                          </p>
                       </div>
                    </div>

                    {/* Simple Action Section */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12 border-t-4 md:border-t-0 md:border-l-4 border-foreground flex items-center justify-center shrink-0 w-full md:w-40 lg:w-48 bg-primary group-hover:bg-white text-foreground transition-all">
                       <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 group-hover:translate-x-2 sm:group-hover:translate-x-4 transition-transform duration-300" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </>
          )}
          
          {/* Action Footer (Full Width Row) */}
          <div className="flex flex-col md:flex-row border-r-0 md:border-r-4 border-b-4 border-foreground bg-[#f8f8f8]">
             <div className="flex-1 p-6 md:p-10 lg:p-16 border-b-4 md:border-b-0 md:border-r-4 border-foreground">
                <h4 className="font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-40 mb-2 sm:mb-4">TOTAL KATEGORI AKTIF</h4>
                <p className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-9xl font-black uppercase leading-none">{categories?.length || 0}</p>
             </div>
             <div className="w-full md:w-[300px] lg:w-[400px] p-6 md:p-10 lg:p-16 group hover:bg-foreground hover:text-white transition-colors cursor-pointer flex flex-col justify-center items-center text-center">
                <Link to="/events" className="block w-full">
                   <h4 className="font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] opacity-40 mb-2 sm:mb-4 group-hover:text-white/40">SEMUA MISI</h4>
                   <p className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black uppercase mb-4 sm:mb-6 leading-none">EXPLORE</p>
                   <div className="mx-auto w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 border-[3px] sm:border-4 border-foreground rounded-full flex items-center justify-center group-hover:border-white transition-colors group-hover:rotate-45">
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                   </div>
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Fixed Status Toast */}
      <div className="fixed bottom-8 left-8 z-[100] hidden md:block">
         <motion.div 
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="bg-black text-white p-4 flex items-center gap-4 border-2 border-white shadow-[4px_4px_20px_rgba(0,0,0,0.4)]"
         >
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-black text-xs">CAT</div>
            <div>
               <p className="text-[10px] font-bold uppercase opacity-60">Status</p>
               <p className="font-black uppercase text-xs tracking-tighter">MAP READY</p>
            </div>
         </motion.div>
      </div>
    </Layout>
    );
};

export default Categories;
