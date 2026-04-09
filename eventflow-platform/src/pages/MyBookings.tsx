import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Ticket, Clock, CheckCircle, ChevronRight, X, Download, RefreshCw, AlertTriangle, ArrowUpRight, ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookings, Booking, Participant, useVerifyBookingStatus } from "@/hooks/useBookings";
import { toPng } from "html-to-image";
import { toast } from "@/hooks/use-toast";

const MyBookings = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: bookings, isLoading } = useBookings();
    const verifyStatus = useVerifyBookingStatus();
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const bibRef = useRef<HTMLDivElement>(null);

    const filteredBookings = bookings?.filter((b: Booking) =>
        b.Event?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleDownloadBIB = async () => {
        if (!bibRef.current || !selectedParticipant) return;
        try {
            const dataUrl = await toPng(bibRef.current, { cacheBust: true });
            const link = document.createElement("a");
            link.download = `MISSION-ID-${selectedParticipant.bib_number}.png`;
            link.href = dataUrl;
            link.click();
            toast({ title: "ACQUISITION SUCCESSFUL", description: "Clearance ID downloaded." });
        } catch (err) {
            console.error(err);
            toast({ title: "SYSTEM ERROR", description: "Download failed.", variant: "destructive" });
        }
    };

    const handleRefreshStatus = async (id: string | number) => {
        try {
            await verifyStatus.mutateAsync(id);
            toast({ title: "STATUS OVERRIDDEN", description: "Payment status synced." });
        } catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast({
                title: "SYNC FAILED",
                description: error.response?.data?.message || "Midtrans gateway unresponsive.",
                variant: "destructive"
            });
        }
    };

    return (
    <Layout>
      {/* My Bookings Gallery Header */}
      <section className="relative bg-white pt-32 pb-20 border-b-4 border-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="absolute top-8 left-8">
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="bg-primary border-2 border-foreground px-4 py-2 flex items-center gap-2 shadow-[2px_2px_0px_0px_black] cursor-pointer"
            >
              <span className="font-black uppercase text-sm tracking-tighter">Mission Log</span>
              <div className="w-5 h-5 rounded-full bg-foreground border-2 border-foreground flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </div>
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-7xl md:text-[10rem] font-black uppercase tracking-tighter text-foreground mb-4 leading-none"
          >
            Daftar <span className="text-stroke">Misi</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] mb-4">RIWAYAT PERJUANGAN LO</h2>
            <p className="text-sm font-bold uppercase tracking-widest leading-relaxed opacity-60">
              Cek semua misi yang udah lo amankan. <br className="hidden md:block"/> 
              Siapkan mental dan fisik buat hari penentuan!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Minimalist Search Section */}
      <section className="bg-white border-b-4 border-foreground sticky top-[64px] md:top-[96px] z-[40]">
        <div className="flex relative group h-20">
          <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-8 h-8 text-foreground/40 transition-colors group-focus-within:text-foreground" />
          <input 
            type="text" 
            placeholder="CARI KODE BOOKING ATAU NAMA EVENT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full pl-24 pr-10 bg-transparent outline-none font-black uppercase tracking-[0.2em] placeholder:text-foreground/20 text-xl md:text-2xl"
          />
        </div>
      </section>

      {/* Booking Grid Area */}
      <section className="bg-[#f8f8f8] min-h-screen">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 border-l-4 border-foreground">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="md:col-span-12 h-64 bg-muted animate-pulse border-r-4 border-b-4 border-foreground" />
            ))
          ) : filteredBookings.length > 0 ? (
            <>
              {filteredBookings.map((booking: Booking, index: number) => {
                const isFinished = booking.payment_status === 'success' && booking.Event?.registration_end && new Date(booking.Event.registration_end) < new Date();
                const statusLabel = isFinished ? 'HANGUS' : 
                                    booking.payment_status === 'success' ? 'AMAN' :
                                    booking.payment_status === 'pending' ? 'TUNGGU' : 'GAGAL';
                const statusBg = booking.payment_status === 'success' ? 'bg-success' : 
                                booking.payment_status === 'failed' ? 'bg-destructive text-white' : 
                                booking.payment_status === 'pending' ? 'bg-warning' : 'bg-foreground text-white';

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="md:col-span-12 group relative border-r-4 border-b-4 border-foreground overflow-hidden bg-white"
                  >
                    <div className="flex flex-col lg:flex-row h-auto lg:h-[400px]">
                       {/* Event Visual Side */}
                       <div className="w-full lg:w-[400px] h-[300px] lg:h-full relative overflow-hidden bg-foreground border-b-4 lg:border-b-0 lg:border-r-4 border-foreground">
                          <img 
                            src={booking.Event?.image || "/placeholder.svg"} 
                            alt={booking.Event?.title}
                            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                          />
                          <div className={`absolute top-6 left-6 z-10 font-black uppercase text-sm px-4 py-1 border-4 border-foreground shadow-[4px_4px_0px_0px_black] ${statusBg}`}>
                             {statusLabel}
                          </div>
                          <div className="absolute bottom-6 right-6 font-display text-4xl font-black text-white mix-blend-difference opacity-40">
                             #{index + 1}
                          </div>
                       </div>

                       {/* Mission Detail Side */}
                       <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40 mb-2">TARGET ARENA</p>
                             <h3 className="font-display text-4xl md:text-6xl font-black uppercase leading-none mb-8 group-hover:text-primary transition-colors">
                                {booking.Event?.title}
                             </h3>
                             
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black uppercase tracking-widest opacity-40">TANGGAL</p>
                                   <p className="font-black uppercase text-sm">{new Date(booking.Event?.date).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black uppercase tracking-widest opacity-40">KODE BOOKING</p>
                                   <p className="font-black uppercase text-sm font-mono">{booking.code.substring(0, 10)}..</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black uppercase tracking-widest opacity-40">BIAYA MISI</p>
                                   <p className="font-black uppercase text-xl text-primary">{formatCurrency(Number(booking.total))}</p>
                                </div>
                             </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-12 pt-8 border-t-2 border-foreground/10">
                             <Link to={`/events/${booking.Event?.slug || booking.Event?.id}`}>
                                <Button className="h-16 px-10 bg-foreground text-white rounded-none font-black uppercase tracking-widest hover:bg-primary hover:text-foreground transition-all">
                                   LIHAT ARENA <ArrowUpRight className="ml-4 w-6 h-6" />
                                </Button>
                             </Link>
                             {booking.payment_status === 'pending' && (
                                <Button 
                                   onClick={() => handleRefreshStatus(booking.id)}
                                   disabled={verifyStatus.isPending}
                                   className="h-16 px-10 bg-warning text-foreground border-4 border-foreground rounded-none font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                                >
                                   {verifyStatus.isPending ? <RefreshCw className="w-6 h-6 animate-spin" /> : "CEK STATUS BAYAR"}
                                </Button>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Squad Roster Bar (Integrated) */}
                    {booking.participants && booking.participants.length > 0 && (
                      <div className="w-full bg-[#eee] border-t-4 border-foreground p-8">
                         <div className="flex items-center gap-4 mb-6">
                            <span className="font-black uppercase text-xs sm:text-sm tracking-[0.3em] bg-foreground text-white px-3 py-1">SQUAD ROSTER</span>
                            <span className="font-bold text-sm opacity-40">{booking.participants.length} ATLET TERDAFTAR</span>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {booking.participants.map((p: Participant) => (
                               <div key={p.id} className="bg-white border-2 border-foreground p-4 flex justify-between items-center group/squad hover:bg-black hover:text-white transition-colors">
                                  <div>
                                     <p className="font-black uppercase text-sm leading-tight">{p.name}</p>
                                     <p className="font-mono text-[10px] font-bold opacity-60">#{p.bib_number}</p>
                                  </div>
                                  {booking.payment_status === 'success' && (
                                     <Button 
                                        size="icon"
                                        onClick={() => { setSelectedParticipant(p); setSelectedBooking(booking); }}
                                        className="w-10 h-10 border-2 border-foreground bg-primary rounded-none group-hover/squad:bg-white group-hover/squad:text-black transition-colors"
                                     >
                                        <Ticket className="w-5 h-5" />
                                     </Button>
                                  )}
                               </div>
                            ))}
                         </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Integrated Statistics Footer Area */}
              <div className="md:col-span-4 p-8 md:p-12 border-r-4 border-b-4 border-foreground h-48 md:h-auto flex flex-col justify-center bg-white">
                 <h4 className="font-bold text-xs uppercase tracking-[0.3em] opacity-40 mb-2">TOTAL MISI</h4>
                 <p className="font-display text-5xl md:text-6xl font-black uppercase">{bookings?.length || 0}</p>
              </div>
              <div className="md:col-span-4 p-8 md:p-12 border-r-4 border-b-4 border-foreground h-48 md:h-auto flex flex-col justify-center bg-white">
                 <h4 className="font-bold text-xs uppercase tracking-[0.3em] opacity-40 mb-2">MISI AMAN</h4>
                 <p className="font-display text-5xl md:text-6xl font-black uppercase text-success">
                    {bookings?.filter(b => b.payment_status === 'success').length || 0}
                 </p>
              </div>
              <div className="md:col-span-4 p-8 md:p-12 border-r-4 border-b-4 border-foreground h-48 md:h-auto group hover:bg-primary transition-colors cursor-pointer flex flex-col justify-center bg-white">
                 <Link to="/events" className="block w-full">
                    <h4 className="font-bold text-xs uppercase tracking-[0.3em] opacity-40 mb-2 group-hover:text-foreground">TAMBAH MISI</h4>
                    <div className="flex items-center justify-between">
                       <p className="font-display text-4xl md:text-6xl font-black uppercase">GAS LAGI</p>
                       <ArrowRight className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                 </Link>
              </div>
            </>
          ) : (
            <div className="md:col-span-12 py-40 text-center border-r-4 border-b-4 border-foreground bg-white">
               <AlertTriangle className="w-32 h-32 mx-auto mb-8 opacity-10" />
               <h3 className="font-display text-4xl md:text-7xl font-black uppercase mb-6">BELUM ADA MISI</h3>
               <p className="font-bold uppercase tracking-widest opacity-40 mb-12">LO BELUM PUNYA TIKET MISI AKTIF. GAS SEKARANG!</p>
               <Link to="/events">
                  <Button className="h-20 px-12 bg-foreground text-white rounded-none font-black uppercase text-2xl tracking-[0.2em] hover:bg-primary hover:text-black transition-all">
                    CARI MISI PERDANA <ChevronRight className="ml-4 w-8 h-8" />
                  </Button>
               </Link>
            </div>
          )}
        </div>
      </section>

      {/* Extreme BIB Modal (Gallery Style) */}
      <AnimatePresence>
        {selectedParticipant && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedParticipant(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-white border-4 border-black shadow-[20px_20px_0px_0px_rgba(255,222,3,1)] p-0 overflow-y-auto max-h-[95vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="bg-black text-white p-6 flex justify-between items-center sticky top-0 z-20">
                 <div className="flex items-center gap-4">
                    <Trophy className="w-8 h-8 text-[#ffde03]" />
                    <span className="font-display text-3xl font-black uppercase tracking-widest">ATHLETE CLEARANCE</span>
                 </div>
                 <button onClick={() => setSelectedParticipant(null)} className="hover:rotate-90 transition-transform">
                    <X className="w-8 h-8" />
                 </button>
              </div>

              {/* The Actual BIB Design (A5 Aspect Ratio) */}
              <div className="p-4 md:p-8 bg-zinc-100 overflow-hidden">
                <div 
                  className="bg-white border-4 border-black shadow-[12px_12px_0px_black] p-4 md:p-8 relative overflow-hidden flex flex-col justify-between aspect-[1.4/1] w-full max-w-3xl mx-auto" 
                  ref={bibRef}
                >
                   {/* Background Decorative Patterns */}
                   <div className="absolute top-0 left-0 w-full h-10 md:h-12 bg-black flex items-center justify-between px-4 md:px-6 text-white overflow-hidden">
                      <div className="flex gap-4 font-black uppercase text-[8px] md:text-[10px] tracking-[0.4em]">
                         <span>OFFICIAL BI-IDENT</span>
                         <span className="hidden sm:inline">•</span>
                         <span className="hidden sm:inline">MISSION-ID-{String(selectedParticipant.id).substring(0, 4)}</span>
                      </div>
                      <div className="flex gap-2">
                         <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#ffde03]" />
                         <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-pink-500" />
                      </div>
                   </div>

                   <div className="mt-8 md:mt-12 text-center relative z-10 flex-1 flex flex-col justify-center">
                      <p className="font-black uppercase text-[8px] md:text-xs tracking-[0.4em] opacity-30 mb-2">ARENA: {selectedBooking?.Event?.title}</p>
                      
                      {/* HUGE BIB NUMBER - Scaled for visibility */}
                      <h1 className="text-[10rem] md:text-[16rem] font-display font-black leading-none tracking-tighter text-black select-none">
                        {selectedParticipant.bib_number?.split('-')[1] || "000"}
                      </h1>
                      
                      <div className="flex flex-col items-center gap-2 mt-[-5px] md:mt-[-10px]">
                         <span className="font-serif italic font-black text-3xl md:text-6xl uppercase tracking-tighter truncate max-w-full px-4">
                            {selectedParticipant.name}
                         </span>
                         <div className="bg-black text-[#ffde03] px-6 md:px-10 py-1.5 md:py-2 font-black uppercase text-sm md:text-xl mt-2 md:mt-4 tracking-[0.5em] shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                            {selectedParticipant.bib_number}
                         </div>
                      </div>
                   </div>

                   <div className="mt-4 md:mt-8 flex justify-between items-end border-t-4 border-black pt-4 md:pt-6">
                      <div className="flex flex-col gap-1">
                         <span className="font-black uppercase text-[8px] md:text-[10px] opacity-40">TANGGAL MISI</span>
                         <span className="font-display text-2xl md:text-4xl font-black">{new Date(selectedBooking?.Event?.date).toLocaleDateString('id-ID', { month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-4 md:gap-6">
                         <div className="text-right hidden sm:block">
                           <span className="font-black uppercase text-[10px] opacity-40">KODE DATA</span>
                           <p className="font-mono font-bold text-base md:text-lg">{selectedBooking?.code.substring(0, 8)}</p>
                         </div>
                         <div className="w-12 h-12 md:w-20 md:h-20 bg-black border-2 md:border-4 border-black flex items-center justify-center">
                               <RefreshCw className="w-6 h-6 md:w-10 md:h-10 text-white animate-spin-slow rotate-12" />
                         </div>
                      </div>
                   </div>

                   {/* Corner Stamp - Repositioned to stay within bounds */}
                   <div className="absolute top-16 right-[-50px] rotate-45 bg-[#ffde03] border-4 border-black px-12 md:px-20 py-2 md:py-4 font-black text-lg md:text-2xl uppercase tracking-[0.2em] shadow-lg pointer-events-none">
                      ANTARESTAR
                   </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-6 bg-white border-t-4 border-black sticky bottom-0 z-20">
                 <Button 
                   className="flex-1 h-16 md:h-20 text-xl md:text-3xl font-display font-black uppercase tracking-widest border-4 border-black bg-[#ffde03] text-black shadow-[6px_6px_0px_black] md:shadow-[10px_10px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-none" 
                   onClick={handleDownloadBIB}
                 >
                    <Download className="mr-4 md:mr-6 w-8 h-8 md:w-10 md:h-10" /> EKSPOR DATA
                 </Button>
                 <Button 
                   className="h-16 md:h-20 px-6 md:px-12 text-lg md:text-xl font-black uppercase border-4 border-black bg-white hover:bg-black hover:text-white transition-all rounded-none" 
                   onClick={() => setSelectedParticipant(null)}
                 >
                    BATAL
                 </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Toast/Log Action (Like Events Page) */}
      <div className="fixed bottom-8 left-8 z-[100] hidden md:block">
         <motion.div 
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            className="bg-black text-white p-4 flex items-center gap-4 border-2 border-white shadow-[4px_4px_20px_rgba(0,0,0,0.4)]"
         >
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-black">LOG</div>
            <div>
               <p className="text-[10px] font-bold uppercase opacity-60">Status</p>
               <p className="font-black uppercase text-xs tracking-tighter">DATA TERVERIFIKASI</p>
            </div>
         </motion.div>
      </div>

    </Layout>
    );
};

export default MyBookings;
