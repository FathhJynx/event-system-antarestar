import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      
      <main className="flex-1 pt-16 md:pt-24 overflow-hidden">
        {children}
      </main>

      <Footer />

      {/* Extreme Floating Sticky CTA */}
      <Link to="/events" className="fixed bottom-8 right-8 z-[90] group hidden md:block">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 1 }}
          className="relative block"
        >
          {/* Shadow Behind */}
          <div className="absolute inset-0 bg-foreground translate-x-2 translate-y-2 pointer-events-none group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
          
          {/* Main Button Body */}
          <div className="relative bg-primary text-foreground border-4 border-foreground px-8 py-4 flex items-center gap-4 group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-200">
            <span className="font-display font-black text-3xl uppercase tracking-widest leading-none mt-1">BELI TIKET</span>
            <div className="w-10 h-10 border-4 border-foreground bg-background rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:bg-foreground group-hover:text-background transition-all">
               <ArrowUpRight className="w-6 h-6 stroke-[3]" />
            </div>
          </div>
          
          {/* Notification blip */}
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-destructive border-2 border-foreground rounded-full animate-bounce" />
        </motion.div>
      </Link>
    </div>
  );
};

export default Layout;
