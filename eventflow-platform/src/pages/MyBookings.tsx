import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, MapPin, Ticket, Clock, CheckCircle, XCircle, ChevronRight, X, Download, User as UserIcon, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookings, Booking, Participant, useVerifyBookingStatus } from "@/hooks/useBookings";
import { toPng } from "html-to-image";
import { toast } from "@/hooks/use-toast";

const statusColors = {
    pending: "bg-warning/20 text-warning border-warning/20",
    success: "bg-success/20 text-success border-success/20",
    failed: "bg-destructive/20 text-destructive border-destructive/20",
    expired: "bg-muted text-muted-foreground border-muted",
    finished: "bg-secondary/20 text-secondary border-secondary/20",
};

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
        if (!bibRef.current) return;
        try {
            const dataUrl = await toPng(bibRef.current, { cacheBust: true });
            const link = document.createElement("a");
            link.download = `BIB-${selectedParticipant.bib_number}.png`;
            link.href = dataUrl;
            link.click();
            toast({ title: "Success", description: "BIB Card downloaded successfully!" });
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Failed to download BIB card.", variant: "destructive" });
        }
    };

    const handleRefreshStatus = async (id: string | number) => {
        try {
            await verifyStatus.mutateAsync(id);
            toast({ title: "Status Updated", description: "Your payment status has been refreshed." });
        } catch (err: any) {
            toast({
                title: "Refresh Failed",
                description: err.response?.data?.message || "Could not verify payment status with Midtrans.",
                variant: "destructive"
            });
        }
    };

    return (
        <Layout>
            <section className="py-12 bg-card border-b border-border">
                <div className="container mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-4xl md:text-5xl mb-4"
                    >
                        MY <span className="text-gradient">BOOKINGS</span>
                    </motion.h1>
                    <p className="text-muted-foreground">Keep track of your event registrations and tickets</p>
                </div>
            </section>

            <section className="py-12 bg-background min-h-[60vh]">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <Card>
                            <CardContent className="p-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by event name or booking code..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-card"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <Card key={i}>
                                        <CardContent className="p-6">
                                            <div className="flex gap-6">
                                                <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
                                                <div className="flex-1 space-y-3">
                                                    <Skeleton className="h-6 w-3/4" />
                                                    <Skeleton className="h-4 w-1/2" />
                                                    <Skeleton className="h-4 w-1/4" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : filteredBookings.length > 0 ? (
                                filteredBookings.map((booking: Booking, index: number) => (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="hover:border-primary/50 transition-colors group overflow-hidden">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
                                                    {/* Event Info */}
                                                    <div className="p-6 flex-1 flex gap-4">
                                                        <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0">
                                                            <img
                                                                src={booking.Event?.image || "/placeholder.svg"}
                                                                alt={booking.Event?.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Badge className={
                                                                (booking.payment_status === 'success' && booking.Event?.registration_end && new Date(booking.Event.registration_end) < new Date())
                                                                    ? statusColors.finished
                                                                    : statusColors[booking.payment_status as keyof typeof statusColors]
                                                            }>
                                                                {(booking.payment_status === 'success' && booking.Event?.registration_end && new Date(booking.Event.registration_end) < new Date())
                                                                    ? 'finished'
                                                                    : booking.payment_status}
                                                            </Badge>
                                                            <h3 className="font-display text-xl leading-tight group-hover:text-primary transition-colors">
                                                                {booking.Event?.title}
                                                            </h3>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {new Date(booking.Event?.date).toLocaleDateString()}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Ticket className="w-3 h-3" />
                                                                    ID: {booking.code.split('-')[1]?.substring(0, 8) || booking.id}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Payment & Action */}
                                                    <div className="p-6 md:w-64 bg-card/50 flex flex-col justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Paid</p>
                                                            <p className="font-display text-xl">{formatCurrency(Number(booking.total))}</p>
                                                            <p className="font-mono text-[10px] text-muted-foreground">REF: {booking.code}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Link to={`/events/${booking.Event?.slug || booking.Event?.id}`}>
                                                                <Button variant="outline" size="sm" className="w-full gap-2">
                                                                    Event Details
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                            {booking.payment_status === 'pending' && (
                                                                <Button
                                                                    variant="secondary"
                                                                    size="sm"
                                                                    className="w-full gap-2"
                                                                    onClick={() => handleRefreshStatus(booking.id)}
                                                                    disabled={verifyStatus.isPending}
                                                                >
                                                                    <RefreshCw className={`w-4 h-4 ${verifyStatus.isPending ? 'animate-spin' : ''}`} />
                                                                    {verifyStatus.isPending ? "Refreshing..." : "Refresh Status"}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Participants Detail Expansion */}
                                                {booking.participants && booking.participants.length > 0 && (
                                                    <div className="px-6 pb-6 border-t border-border pt-4 bg-muted/30">
                                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Participants ({booking.participants.length})</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {booking.participants?.map((p: Participant) => (
                                                                <div key={p.id} className="bg-card border border-border p-3 rounded-xl flex justify-between items-center group/bib overflow-hidden relative">
                                                                    <div className="space-y-1 z-10">
                                                                        <p className="text-sm font-medium leading-none">{p.name}</p>
                                                                        <p className="text-xs text-muted-foreground font-mono">{p.bib_number}</p>
                                                                    </div>
                                                                    <div className="text-right z-10">
                                                                        {booking.payment_status === 'success' && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-all"
                                                                                onClick={() => {
                                                                                    setSelectedParticipant(p);
                                                                                    setSelectedBooking(booking);
                                                                                }}
                                                                            >
                                                                                <Ticket className="w-4 h-4" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                    {/* Simple mini-bib background effect */}
                                                                    <div className="absolute -bottom-2 -right-2 text-primary/5 font-display text-4xl rotate-12 select-none">
                                                                        {p.bib_number?.split('-')[1]}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                        <Ticket className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-display text-2xl mb-2">No Bookings Yet</h3>
                                    <p className="text-muted-foreground mb-6">Explore our events and start your first registration!</p>
                                    <Link to="/events">
                                        <Button>Discover Events</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* BIB Modal */}
            <AnimatePresence>
                {selectedParticipant && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedParticipant(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-card w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-border flex justify-between items-center">
                                <h3 className="font-display text-lg">Event BIB</h3>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedParticipant(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="p-8">
                                {/* The BIB Card for Download */}
                                <div
                                    ref={bibRef}
                                    className="aspect-[3/4] w-full bg-white rounded-2xl shadow-lg border-t-[12px] border-primary flex flex-col items-center justify-center p-8 text-black relative"
                                    style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)' }}
                                >
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            EF
                                        </div>
                                        <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">EventFlow</span>
                                    </div>

                                    <div className="w-full text-center space-y-6 mt-4">
                                        <div className="space-y-1">
                                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Official Entry</p>
                                            <h2 className="text-xl font-display leading-tight">{selectedBooking?.Event?.title}</h2>
                                        </div>

                                        <div className="py-8 border-y-2 border-dashed border-primary/20">
                                            <h1 className="text-7xl font-display font-black tracking-tighter text-primary">
                                                {selectedParticipant.bib_number?.split('-')[1]}
                                            </h1>
                                            <p className="text-xs font-mono text-muted-foreground mt-2">{selectedParticipant.bib_number}</p>
                                        </div>

                                        <div className="space-y-1 pt-4">
                                            <p className="text-xl font-display uppercase">{selectedParticipant.name}</p>
                                            <div className="flex justify-center gap-4 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                <span>{new Date(selectedBooking?.Event?.date).toLocaleDateString()}</span>
                                                <span className="text-primary/30">•</span>
                                                <span>{selectedBooking?.code.split('-')[1]?.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-4 right-4 text-primary/10 rotate-12">
                                        <Ticket className="w-24 h-24" />
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <Button className="flex-1 gap-2" onClick={handleDownloadBIB}>
                                        <Download className="w-4 h-4" />
                                        Download PNG
                                    </Button>
                                    <Button variant="outline" onClick={() => setSelectedParticipant(null)}>
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default MyBookings;
