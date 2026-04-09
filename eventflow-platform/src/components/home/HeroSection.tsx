import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicStats } from "@/hooks/useEvents";
import heroImage from "@/assets/hero-marathon.jpg";
import { useRef } from "react";

const HeroSection = () => {
  const { data: stats } = usePublicStats();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yBlock = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={containerRef} className="relative min-h-[100vh] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-background border-b-8 border-foreground">
      {/* Background Parallax Images & Blocks */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-multiply">
        <div className="w-full h-[150%] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-repeat" />
      </motion.div>

      <motion.div style={{ y: yBlock }} className="absolute top-1/4 -left-20 w-64 h-64 bg-primary border-8 border-foreground shadow-[16px_16px_0px_0px_hsl(var(--foreground))] rotate-12 flex items-center justify-center opacity-80" />
      <motion.div style={{ y: yBlock }} className="absolute bottom-40 -right-20 w-80 h-80 bg-secondary border-8 border-foreground shadow-[16px_16px_0px_0px_hsl(var(--foreground))] -rotate-12 flex items-center justify-center opacity-80" />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Typography */}
        <motion.div style={{ y: yText }} className="max-w-4xl pt-12">
          
          {/* Top warning tape */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="mb-8 rotate-[-1deg]"
          >
            <span className="inline-flex items-center gap-2 px-6 py-2 border-4 border-foreground bg-warning text-foreground text-sm font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
              <AlertTriangle className="w-5 h-5" /> SYSTEM ONLINE - READY FOR DEPLOYMENT
            </span>
          </motion.div>

          {/* Massive offset text */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-8xl md:text-9xl lg:text-[11rem] leading-[0.8] mb-8 font-black uppercase drop-shadow-[8px_8px_0px_hsl(var(--primary))] text-foreground bg-background inline-block p-2 ml-[-8px]"
          >
            PUSH
            <br />
            <motion.span 
              initial={{ rotate: -5 }}
              animate={{ rotate: 2 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
              className="text-secondary bg-foreground px-6 py-2 inline-block transform shadow-[12px_12px_0px_0px_hsl(var(--primary))] mt-2 border-8 border-background z-20 relative mix-blend-normal"
            >
              YOUR
            </motion.span>
            <br />
            <span className="relative z-10 block mt-2">LIMITS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold max-w-xl mb-12 border-l-8 border-foreground pl-6 bg-background/80 py-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] relative -left-4"
          >
            NO WEAKNESS TOLERATED. JOIN THOUSANDS OF ATHLETES CRUSHING MARATHONS AND ENDURANCE EVENTS NOW.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 mb-16 relative"
          >
            {/* Aggressive Primary CTA */}
            <Link to="/events" className="group flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-foreground translate-x-3 translate-y-3 pointer-events-none transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                <Button size="lg" className="relative w-full text-2xl md:text-3xl font-black tracking-widest uppercase border-4 border-foreground py-10 bg-primary text-foreground rounded-none group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform">
                  HUNT TICKETS
                  <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </Link>

            {/* Brutalist Secondary CTA */}
            <Link to="/auth" className="group flex-1">
              <Button size="lg" variant="outline" className="w-full text-xl md:text-2xl font-black tracking-widest uppercase border-4 border-foreground py-10 bg-background text-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] group-hover:bg-foreground group-hover:text-background group-hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] group-hover:translate-x-1 group-hover:translate-y-1 transition-all rounded-none">
                ENLIST NOW
              </Button>
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-0 border-8 border-foreground shadow-[12px_12px_0px_0px_hsl(var(--foreground))] bg-white dark:bg-black divide-x-8 divide-foreground"
          >
            <div className="p-8 text-center hover:bg-primary transition-colors hover:-translate-y-2 hover:-translate-x-2 border-r-0 relative group">
              <div className="font-display text-5xl md:text-6xl font-black leading-none">{stats?.totalEvents || 0}+</div>
              <div className="text-sm font-black uppercase tracking-widest mt-4 bg-foreground text-background py-1 group-hover:bg-background group-hover:text-foreground border-2 border-transparent group-hover:border-foreground">MISSIONS</div>
            </div>
            <div className="p-8 text-center hover:bg-secondary transition-colors hover:-translate-y-2 hover:-translate-x-2 border-r-0 relative group">
              <div className="font-display text-5xl md:text-6xl font-black leading-none">{stats?.totalParticipants?.toLocaleString() || 0}+</div>
              <div className="text-sm font-black uppercase tracking-widest mt-4 bg-foreground text-background py-1 group-hover:bg-background group-hover:text-foreground border-2 border-transparent group-hover:border-foreground">OPERATIVES</div>
            </div>
            <div className="p-8 text-center hover:bg-accent hover:text-foreground transition-colors hover:-translate-y-2 hover:-translate-x-2 relative group">
              <div className="font-display text-5xl md:text-6xl font-black leading-none">{stats?.totalVenues || 0}+</div>
              <div className="text-sm font-black uppercase tracking-widest mt-4 bg-foreground text-background py-1 group-hover:bg-background group-hover:text-foreground border-2 border-transparent group-hover:border-foreground">ZONES</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Collage with complex scrolling layers */}
        <div className="hidden lg:block relative h-[700px] mt-10">
          {/* Graphic block layer 1 */}
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]) }}
            className="absolute right-10 top-0 w-4/5 h-[550px] border-8 border-foreground shadow-[20px_20px_0px_0px_hsl(var(--foreground))] overflow-hidden bg-primary rotate-3 transition-transform hover:rotate-0 duration-500"
          >
            <img
              src={heroImage}
              alt="Marathon Action"
              className="w-full h-full object-cover filter contrast-125 brightness-90 grayscale-[0.2] mix-blend-multiply hover:mix-blend-normal hover:scale-110 transition-all duration-700"
            />
            {/* CTA Overlay ON image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 opacity-0 hover:opacity-100 transition-opacity">
               <span className="font-black text-white text-3xl uppercase mb-4">READY TO SUFFER?</span>
               <Link to="/events">
                 <Button className="font-black text-xl uppercase tracking-widest py-6 w-full border-4 border-foreground bg-warning text-foreground hover:bg-white rounded-none">
                   TAKE THE CHALLENGE
                 </Button>
               </Link>
            </div>
          </motion.div>
          
          {/* Floating graphic block layer 2 */}
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "50%"]) }}
            className="absolute left-0 bottom-32 bg-secondary p-8 border-8 border-foreground shadow-[12px_12px_0px_0px_hsl(var(--foreground))] rotate-[-12deg] z-20 hover:rotate-0 transition-transform duration-300"
          >
            <div className="font-display text-7xl font-black leading-none uppercase text-secondary-foreground stroke-black">
               OUT<br/>WORK
            </div>
          </motion.div>
          
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]), x: useTransform(scrollYProgress, [0, 1], ["0%", "30%"]) }}
            className="absolute left-[20%] top-1/2 w-24 h-24 bg-destructive border-4 border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] rounded-full flex items-center justify-center -z-10 animate-pulse"
          >
            <ArrowRight className="w-12 h-12 text-foreground -rotate-45" />
          </motion.div>
        </div>
      </div>
      
      {/* Heavy Ticker Tape at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-foreground text-background py-4 overflow-hidden border-t-8 border-foreground z-30">
        <div className="whitespace-nowrap flex gap-8 animate-[marquee_20s_linear_infinite]">
          {Array(15).fill("DON'T WAIT • SECURE YOUR SPOT •").map((text, i) => (
             <span key={i} className="text-3xl font-black tracking-widest uppercase hover:text-primary transition-colors cursor-crosshair">{text}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
