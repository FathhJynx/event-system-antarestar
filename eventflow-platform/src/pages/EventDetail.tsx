import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Heart,
  ChevronRight,
  CheckCircle,
  Copy,
  Check,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import MapRouteView from "@/components/events/MapRouteView";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvent } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: event, isLoading, error } = useEvent(id || "");
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsSaved(false);
      return;
    }
    const savedEvents = JSON.parse(localStorage.getItem(`savedEvents_${user.id}`) || "[]");
    if (event && savedEvents.includes(event.id)) {
      setIsSaved(true);
    } else {
      setIsSaved(false);
    }
  }, [event, user]);

  const handleSave = () => {
    if (!event) return;

    if (!user) {
      toast.error("PLEASE LOGIN. WE NEED YOUR INFO TO SAVE.");
      navigate("/auth");
      return;
    }

    const savedEvents = JSON.parse(localStorage.getItem(`savedEvents_${user.id}`) || "[]");
    let newSavedEvents;

    if (isSaved) {
      newSavedEvents = savedEvents.filter((savedId: string) => savedId !== event.id);
      toast.success("EVENT DIHAPUS DARI DAFTAR PANTAU.");
    } else {
      newSavedEvents = [...savedEvents, event.id];
      toast.success("SIP! EVENT BERHASIL DISIMPAN.");
    }

    localStorage.setItem(`savedEvents_${user.id}`, JSON.stringify(newSavedEvents));
    setIsSaved(!isSaved);
  };

  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    toast.success("MANTAP! LINK BERHASIL DICOPY.");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 space-y-12">
          <div className="h-[50vh] border-2 border-foreground bg-muted animate-pulse shadow-[4px_4px_0px_0px_hsl(var(--foreground))]" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-20 w-3/4 border-2 border-foreground rounded-none" />
              <Skeleton className="h-8 w-1/2 border-2 border-foreground rounded-none" />
              <Skeleton className="h-96 w-full border-2 border-foreground rounded-none" />
            </div>
            <Skeleton className="h-[600px] w-full border-2 border-foreground rounded-none" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="inline-block border-2 border-foreground p-8 md:p-12 bg-destructive shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <AlertTriangle className="w-16 h-16 md:w-24 md:h-24 text-foreground mx-auto mb-6" />
            <h2 className="text-4xl md:text-6xl font-display font-black uppercase text-foreground mb-4">WADUH, NYASAR!</h2>
            <p className="text-lg md:text-xl font-bold uppercase mb-8 text-foreground">EVENT INI GAK KETEMU ATAU UDAH GAK TERSEDIA LAGI.</p>
            <Link to="/events">
              <Button size="lg" className="btn-neo text-xl md:text-2xl h-16 md:h-20 px-12 bg-background text-foreground hover:bg-foreground hover:text-background shadow-[2px_2px_0px_0px_black]">
                BALIK KE DAFTAR EVENT
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const spotsLeft = (event.max_participants || 0) - (event.registered_count || 0);

  return (
    <Layout>
      <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white">
        {/* Collector Series Breadcrumb */}
        <div className="bg-white border-b-2 border-black pt-8 pb-4 px-4 sticky top-[64px] md:top-[96px] z-[40]">
           <div className="container mx-auto flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
              <Link to="/" className="hover:text-black transition-colors">BERANDA</Link>
              <div className="w-4 h-[1px] bg-black/20" />
              <Link to="/events" className="hover:text-black transition-colors">EVENT</Link>
              <div className="w-4 h-[1px] bg-black/20" />
              <span className="text-black">{event.title}</span>
           </div>
        </div>

        {/* High-Impact Detail Hero */}
        <section className="relative border-b-2 border-black overflow-hidden flex flex-col lg:flex-row">
           {/* Left: Mission Content */}
           <div className="w-full lg:w-3/5 p-8 md:p-16 lg:p-24 border-r-0 lg:border-r-2 border-black flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                  <div className="flex items-center gap-4 mb-8">
                     <span className="font-black text-[10px] uppercase tracking-widest leading-none">
                        {event.event_categories?.name || "MISSION"}
                     </span>
                     <div className="h-[1px] flex-1 bg-black/10" />
                     <span className="font-black text-[10px] uppercase tracking-widest opacity-40">CASE NO: {String(event.id).slice(-6).toUpperCase()}</span>
                  </div>
                  
                  <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-12">
                     {event.title}
                  </h1>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12 border-t-2 border-black pt-12">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">TANGGAL</p>
                        <p className="font-display text-3xl font-black uppercase">{event.date ? new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'TBA'}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">LOKASI</p>
                        <p className="font-bold text-sm uppercase tracking-wider">{event.venues?.city || "ARENA"}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">HADIAH</p>
                        <p className="font-display text-3xl font-black uppercase">{event.prizepool ? `Rp ${(Number(event.prizepool)/1000000).toFixed(0)}JT` : 'TBA'}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">STATUS</p>
                        <p className="font-black text-sm uppercase text-primary">{event.status === 'open' ? 'BUKA' : 'TUTUP'}</p>
                     </div>
                  </div>
              </motion.div>
           </div>

           {/* Right: Masterpiece Image */}
           <div className="w-full lg:w-2/5 relative h-[500px] lg:h-auto bg-zinc-100 overflow-hidden">
               <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
               <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
           </div>
        </section>

        {/* Content Section: Information & Registration */}
        <section className="bg-zinc-50/30">
           <div className="container mx-auto px-4 py-20 lg:py-32">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                 
                 {/* Left Column: Mission Files */}
                 <div className="lg:col-span-7 space-y-24">
                    <Tabs defaultValue="about" className="w-full">
                       <TabsList className="w-full flex bg-transparent p-0 border-b-2 border-black/10 mb-12 gap-10 overflow-x-auto no-scrollbar justify-start">
                          {['about', 'schedule', 'route', 'prizes', 'participants'].filter(tab => tab !== 'route' || event.route_coordinates).map(tab => (
                             <TabsTrigger 
                               key={tab} 
                               value={tab} 
                               className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:text-black font-black uppercase text-xs md:text-sm tracking-widest py-4 bg-transparent text-black/40 transition-all"
                             >
                                {tab}
                             </TabsTrigger>
                          ))}
                       </TabsList>

                       <TabsContent value="about" className="space-y-10">
                          <div>
                             <h3 className="font-display text-4xl lg:text-5xl font-black uppercase mb-8">TENTANG ARENA</h3>
                             <p className="font-bold text-lg lg:text-xl uppercase tracking-wider leading-relaxed text-black/80 whitespace-pre-line border-l-4 border-black pl-8">
                                {event.description || "DETAIL MISI BELUM TERSEDIA, SOB. PANTAU TERUS UPDATE-NYA."}
                             </p>
                          </div>
                          
                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y-2 border-black/5">
                             <div className="flex items-center gap-4">
                                <Users className="w-10 h-10 text-black/20" />
                                <div>
                                   <p className="text-[10px] font-black opacity-40 uppercase">PENDAFTAR</p>
                                   <p className="font-display text-3xl font-black">{event.registered_count || 0}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <Trophy className="w-10 h-10 text-black/20" />
                                <div>
                                   <p className="text-[10px] font-black opacity-40 uppercase">KUOTA MAX</p>
                                   <p className="font-display text-3xl font-black">{event.max_participants || "UNLIMITED"}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <Clock className="w-10 h-10 text-black/20" />
                                <div>
                                   <p className="text-[10px] font-black opacity-40 uppercase">DURASI</p>
                                   <p className="font-display text-3xl font-black">2.5 JAM</p>
                                </div>
                             </div>
                          </div>
                       </TabsContent>

                       <TabsContent value="schedule" className="space-y-8">
                          <div className="bg-white border-2 border-black p-10 shadow-[4px_4px_0px_0px_black]">
                             <h3 className="font-display text-4xl font-black uppercase mb-8">URUTAN MAIN</h3>
                             <p className="font-bold text-lg uppercase tracking-widest whitespace-pre-line leading-relaxed">
                                {event.schedule || "JADWAL RESMI AKAN DIRILIS SEGERA."}
                             </p>
                          </div>
                       </TabsContent>

                       <TabsContent value="participants" className="space-y-8 text-black">
                          <div className="border-2 border-black overflow-hidden bg-white shadow-[4px_4px_0px_0px_black]">
                             <div className="p-8 border-b-2 border-black bg-zinc-50">
                                <h3 className="font-display text-4xl font-black uppercase">DAFTAR JAGOAN</h3>
                                <p className="font-bold uppercase tracking-[0.2em] text-[10px] opacity-40">TARGET OPERATIVES YANG SUDAH TERDAFTAR.</p>
                             </div>
                             <div className="overflow-x-auto">
                                <Table>
                                   <TableHeader className="bg-zinc-50/50 border-b-2 border-black">
                                      <TableRow className="hover:bg-transparent">
                                         <TableHead className="font-black uppercase text-[10px] py-6 border-r-2 border-black">ID</TableHead>
                                         <TableHead className="font-black uppercase text-[10px] py-6 border-r-2 border-black">NAMA</TableHead>
                                         <TableHead className="font-black uppercase text-[10px] py-6 border-r-2 border-black text-center">BOOKING ID</TableHead>
                                         <TableHead className="font-black uppercase text-[10px] py-6 text-right pr-8">DATE</TableHead>
                                      </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                      {event.Bookings?.length ? (
                                         event.Bookings.flatMap(b => b.participants.map(p => ({ ...p, code: b.code }))).map((p, i) => (
                                            <TableRow key={i} className="border-b-2 border-black/5 last:border-b-0 hover:bg-zinc-50 transition-colors">
                                               <TableCell className="font-display text-lg py-4 border-r-2 border-black/5">{i+1}</TableCell>
                                               <TableCell className="font-black uppercase text-sm py-4 border-r-2 border-black/5">{p.name}</TableCell>
                                               <TableCell className="py-4 border-r-2 border-black/5 text-center">
                                                  <span className="bg-black text-white px-4 py-1 font-mono font-bold text-[10px] rounded-full uppercase">{p.code}</span>
                                               </TableCell>
                                               <TableCell className="text-right font-bold text-[10px] pr-8 uppercase opacity-40">24 JAN 2024</TableCell>
                                            </TableRow>
                                         ))
                                      ) : (
                                         <TableRow>
                                            <TableCell colSpan={4} className="h-48 text-center text-sm font-black uppercase opacity-20">BELUM ADA YANG DAFTAR. JADI YANG PERTAMA!</TableCell>
                                         </TableRow>
                                      )}
                                   </TableBody>
                                </Table>
                             </div>
                          </div>
                       </TabsContent>

                       <TabsContent value="prizes" className="space-y-12 text-black">
                          <div className="p-12 border-2 border-black bg-primary/5 text-center shadow-[4px_4px_0px_0px_black]">
                             <Trophy className="w-20 h-20 mx-auto mb-8 opacity-20" />
                             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">TOTAL PRIZEPOOL</h3>
                             <p className="font-display text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                {event.prizepool ? `RP ${Number(event.prizepool).toLocaleString("id-ID")}` : "CUMA GLORY, SOB"}
                             </p>
                          </div>
                          {event.additional_rewards && (
                             <div className="p-10 border-2 border-black bg-white">
                                <h4 className="font-black uppercase text-xs tracking-widest mb-6 border-b-2 border-black/5 pb-4">BONUS REWARD</h4>
                                <p className="font-bold uppercase text-lg leading-relaxed opacity-60 italic">{event.additional_rewards}</p>
                             </div>
                          )}
                       </TabsContent>

                       {event.route_coordinates && (
                          <TabsContent value="route" className="space-y-12 text-black">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 border-2 border-black bg-white shadow-[4px_4px_0px_0px_black]">
                                   <p className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-widest">TITIK START</p>
                                   <p className="font-display text-4xl font-black uppercase">{event.route_start_name || "ARENA START"}</p>
                                </div>
                                <div className="p-8 border-2 border-black bg-white shadow-[4px_4px_0px_0px_black]">
                                   <p className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-widest">TITIK FINISH</p>
                                   <p className="font-display text-4xl font-black uppercase">{event.route_end_name || "ARENA FINISH"}</p>
                                </div>
                             </div>
                             <div className="border-2 border-black bg-zinc-100 aspect-video relative overflow-hidden shadow-[4px_4px_0px_0px_black]">
                                <MapRouteView routeCoordinates={event.route_coordinates} />
                             </div>
                          </TabsContent>
                       )}
                    </Tabs>
                 </div>

                 {/* Right Column: Registration Unit */}
                 <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-40 space-y-8">
                       {/* Main Checkout Box */}
                       <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_black] p-10 overflow-hidden relative">
                          <div className="absolute top-0 right-0 py-2 px-6 bg-black text-white font-black text-[10px] uppercase tracking-widest">REGISTRATION BOX</div>
                          
                          <div className="mb-12">
                             <p className="text-[10px] font-black uppercase opacity-40 mb-4 tracking-[0.4em]">BIAYA DAFTAR</p>
                             <div className="font-display text-5xl md:text-7xl font-black uppercase">
                                {event.price ? `RP ${Number(event.price).toLocaleString("id-ID")}` : "GRATIS, SOB!"}
                             </div>
                          </div>

                          <div className="space-y-6 mb-12">
                             <div className="flex justify-between items-center py-4 border-b-2 border-black/5">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">BATAS PENDAFTARAN</span>
                                <span className="font-black text-xs uppercase">{event.registration_end ? new Date(event.registration_end).toLocaleDateString('id-ID') : 'TBA'}</span>
                             </div>
                             <div className="flex justify-between items-center py-4 border-b-2 border-black/5">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">SISA SLOT</span>
                                <span className="font-black text-xs uppercase text-primary">{(event.max_participants || 0) - (event.registered_count || 0)} KURSI</span>
                             </div>
                          </div>

                          <div className="space-y-4">
                             {user ? (
                                <Link to={event.status === 'open' && spotsLeft > 0 ? `/events/${event.id}/register` : "#"} className="block">
                                   <Button className="w-full h-16 text-xl font-black uppercase tracking-widest rounded-none bg-black text-white hover:bg-zinc-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                                      DAFTAR SEKARANG <ArrowRight className="ml-4 w-8 h-8" />
                                   </Button>
                                </Link>
                             ) : (
                                <Button 
                                  onClick={() => { navigate("/auth"); toast.error("MASUK DULU BRO!"); }} 
                                  className="w-full h-20 text-xl font-black uppercase tracking-widest rounded-none bg-black text-white hover:bg-zinc-800"
                                >
                                   LOG IN BUAT DAFTAR
                                </Button>
                             )}
                             
                             <div className="grid grid-cols-2 gap-4">
                                <Button onClick={handleSave} className={`h-16 rounded-none border-2 border-black font-black uppercase text-[10px] tracking-widest transition-all ${isSaved ? 'bg-primary text-black' : 'bg-white text-black hover:bg-zinc-50'}`}>
                                   <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                                   {isSaved ? 'TERSIMPAN' : 'SIMPAN MISI'}
                                </Button>
                                <Dialog>
                                   <DialogTrigger asChild>
                                      <Button className="h-16 rounded-none border-2 border-black bg-white text-black hover:bg-zinc-50 font-black uppercase text-[10px] tracking-widest">
                                         <Share2 className="w-4 h-4 mr-2" />
                                         AJAK SQUAD
                                      </Button>
                                   </DialogTrigger>
                                   <DialogContent className="border-2 border-black rounded-none p-10 bg-white">
                                      <div className="text-center">
                                         <h3 className="font-display text-4xl font-black uppercase mb-6">SHARE KE SQUAD</h3>
                                         <div className="p-8 bg-zinc-50 border-2 border-black mb-8 inline-block">
                                            <img src={qrCodeUrl} alt="QR" className="w-48 h-48 mx-auto" />
                                         </div>
                                         <div className="flex gap-2">
                                            <Input defaultValue={currentUrl} readOnly className="border-2 border-black rounded-none font-mono text-xs uppercase" />
                                            <Button onClick={handleCopyLink} className="bg-black text-white rounded-none w-14 shrink-0">
                                               {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </Button>
                                         </div>
                                      </div>
                                   </DialogContent>
                                </Dialog>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </Layout>
  );
};

export default EventDetail;
