import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Award,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Heart,
  Shield,
  Info,
  Map as MapIcon,
  ChevronRight,
  CheckCircle,
  QrCode,
  Copy,
  Check
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
    // Check if event is saved in localStorage only if user is logged in
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
      toast.error("Please login to save events");
      navigate("/auth");
      return;
    }

    const savedEvents = JSON.parse(localStorage.getItem(`savedEvents_${user.id}`) || "[]");
    let newSavedEvents;

    if (isSaved) {
      newSavedEvents = savedEvents.filter((savedId: string) => savedId !== event.id);
      toast.success("Event removed from saved items");
    } else {
      newSavedEvents = [...savedEvents, event.id];
      toast.success("Event saved successfully");
    }

    localStorage.setItem(`savedEvents_${user.id}`, JSON.stringify(newSavedEvents));
    setIsSaved(!isSaved);
  };

  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 space-y-8">
          <Skeleton className="h-[40vh] w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-3xl font-display mb-4">Event Not Found</h2>
          <p className="text-muted-foreground mb-8">The event you are looking for doesn't exist or has been removed.</p>
          <Link to="/events">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </Layout>
    );
  }



  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh]">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />

        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/events" className="hover:text-foreground">Events</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{event.title}</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="badge-category mb-4 inline-block">
                {event.event_categories?.name || "Event"}
              </span>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl mb-2 text-white drop-shadow-md">{event.title}</h1>
              <p className="text-lg md:text-xl text-gray-200">{event.slug}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <Calendar className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-semibold break-words">{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <Clock className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-semibold capitalize break-words">{event.status}</div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <MapPin className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Venue</div>
                  <div className="font-semibold break-words">{event.venues?.name || "TBA"}{event.venues?.city ? `, ${event.venues.city}` : ''}</div>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <Trophy className="w-5 h-5 text-primary mb-2" />
                  <div className="text-sm text-muted-foreground">Prizepool</div>
                  <div className="font-semibold text-gradient break-words">
                    {event.prizepool ? `Rp ${Number(event.prizepool).toLocaleString("id-ID")}` : 'TBA'}
                  </div>
                </div>
              </div>


              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full flex bg-card p-1 overflow-x-auto no-scrollbar">
                  <TabsTrigger value="about" className="flex-1 min-w-[100px]">About</TabsTrigger>
                  <TabsTrigger value="schedule" className="flex-1 min-w-[100px]">Schedule</TabsTrigger>
                  {event.route_coordinates && (
                    <TabsTrigger value="route" className="flex-1 min-w-[100px]">Route</TabsTrigger>
                  )}
                  <TabsTrigger value="prizes" className="flex-1 min-w-[100px]">Prizes</TabsTrigger>
                  <TabsTrigger value="participants" className="flex-1 min-w-[100px]">Participants</TabsTrigger>
                </TabsList>


                <TabsContent value="about" className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-display text-2xl mb-4">Event Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed break-words">
                      {event.description || "No description available."}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="mt-6">
                  <h3 className="font-display text-2xl mb-4">Event Schedule</h3>
                  <div className="p-6 rounded-xl bg-card border border-border">
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {event.schedule || "No schedule information available yet."}
                    </p>
                  </div>
                </TabsContent>

                {event.route_coordinates && (
                  <TabsContent value="route" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {event.route_start_name && (
                        <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Start Location</div>
                            <div className="font-display text-lg">{event.route_start_name}</div>
                          </div>
                        </div>
                      )}
                      {event.route_end_name && (
                        <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-5 h-5 text-destructive" />
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">End Location</div>
                            <div className="font-display text-lg">{event.route_end_name}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <MapRouteView routeCoordinates={event.route_coordinates} />
                    </motion.div>
                  </TabsContent>
                )}


                <TabsContent value="prizes" className="mt-6 space-y-8">
                  <div>
                    <h3 className="font-display text-2xl mb-4">Prizepool</h3>
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-muted border border-border text-center">
                      <Trophy className="w-16 h-16 mx-auto mb-4 text-warning" />
                      <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                        {event.prizepool ? `Rp ${Number(event.prizepool).toLocaleString("id-ID")}` : "TBA"}
                      </div>
                      <p className="text-muted-foreground">Total Prizepool to be won!</p>
                    </div>
                  </div>

                  {event.additional_rewards && (
                    <div>
                      <h3 className="font-display text-2xl mb-4">Additional Rewards</h3>
                      <div className="p-6 rounded-xl bg-card border border-border">
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                          {event.additional_rewards}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="participants" className="mt-6 space-y-6">
                  <div>
                    <h3 className="font-display text-2xl mb-2">Registered Participants</h3>
                    <p className="text-muted-foreground mb-6">List of individuals who have successfully registered for this event.</p>

                    <div className="rounded-xl border border-border overflow-hidden bg-card">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="w-[80px]">No</TableHead>
                            <TableHead>Participant Name</TableHead>
                            <TableHead>Booking Reference</TableHead>
                            <TableHead className="text-right">Registration Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {event.Bookings && event.Bookings.length > 0 ? (
                            event.Bookings.flatMap((booking) =>
                              booking.participants.map(p => ({
                                ...p,
                                bookingCode: booking.code || "N/A",
                                createdAt: (booking as any).createdAt || booking.created_at
                              }))
                            ).sort((a, b) => {
                              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                              return dateA - dateB;
                            })
                              .map((participant, index) => (
                                <TableRow key={`${participant.bookingCode}-${participant.id || index}`}>
                                  <TableCell className="font-medium">{index + 1}</TableCell>
                                  <TableCell className="font-display">{participant.name}</TableCell>
                                  <TableCell className="font-mono text-xs text-primary">{participant.bookingCode}</TableCell>
                                  <TableCell className="text-right text-muted-foreground">
                                    {(() => {
                                      const dateStr = participant.createdAt;
                                      const date = dateStr ? new Date(dateStr) : null;
                                      return date && !isNaN(date.getTime())
                                        ? date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                                        : 'TBA';
                                    })()}
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No participants registered yet.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

              </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-display text-xl mb-4">Registration</h3>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <div className="font-medium text-foreground">Registration Fee</div>
                    <div className="font-display text-2xl text-primary break-all">
                      {event.price ? `Rp ${Number(event.price).toLocaleString("id-ID")}` : "Free"}
                    </div>
                  </div>

                  <div className="space-y-3 p-4 rounded-xl border border-border bg-muted/30">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Reg. Starts</span>
                      <span className="font-semibold">{event.registration_start ? new Date(event.registration_start).toLocaleDateString() : 'TBA'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Reg. Ends</span>
                      <span className="font-semibold text-destructive">{event.registration_end ? new Date(event.registration_end).toLocaleDateString() : 'TBA'}</span>
                    </div>
                  </div>

                  {user ? (
                    <Link to={event.status === 'open' ? `/events/${event.id}/register` : "#"}>
                      <Button size="lg" className="btn-hero w-full rounded-xl h-14" disabled={event.status !== 'open'}>
                        {event.status === 'open' ? 'Register Now' : 'Registration Closed'}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="lg"
                      className="btn-hero w-full rounded-xl h-14"
                      onClick={() => {
                        toast.error("Please login to register for events");
                        navigate("/auth");
                      }}
                      disabled={event.status !== 'open'}
                    >
                      {event.status === 'open' ? 'Login to Register' : 'Registration Closed'}
                    </Button>
                  )}
                </div>
              </div>


              {/* Share & Save */}
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Share this event</DialogTitle>
                      <DialogDescription>
                        Scan the QR code or copy the link to share this event with friends.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                      <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="w-48 h-48"
                        />
                      </div>
                      <div className="flex w-full items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                          <Label htmlFor="link" className="sr-only">
                            Link
                          </Label>
                          <Input
                            id="link"
                            defaultValue={currentUrl}
                            readOnly
                          />
                        </div>
                        <Button type="submit" size="sm" className="px-3" onClick={handleCopyLink}>
                          <span className="sr-only">Copy</span>
                          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className={`flex-1 gap-2 ${isSaved ? 'text-primary border-primary/50 bg-primary/5' : ''}`}
                  onClick={handleSave}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout >
  );
};

export default EventDetail;
