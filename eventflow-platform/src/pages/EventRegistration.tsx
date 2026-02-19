import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Participant } from "@/hooks/useBookings";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { ChevronLeft, User, Mail, Phone, ShieldCheck, CreditCard, Footprints, CheckCircle2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEvent } from "@/hooks/useEvents";
import { useCreateBooking } from "@/hooks/useBookings";
import { useValidatePromoCode } from "@/hooks/usePromoCodes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Tag, Loader2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

declare global {
    interface Window {
        snap: {
            pay: (token: string, callbacks: {
                onSuccess?: (result: unknown) => void;
                onPending?: (result: unknown) => void;
                onError?: (result: unknown) => void;
                onClose?: () => void;
            }) => void;
        };
    }
}

import { PromoCode } from "@/hooks/usePromoCodes";

const EventRegistration = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const { toast } = useToast();
    const { data: event, isLoading: eventLoading } = useEvent(id || "");
    const createBooking = useCreateBooking();
    const validatePromo = useValidatePromoCode();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        participants: [] as Participant[],
    });

    const [promoCode, setPromoCode] = useState("");
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
    const [isValidatingPromo, setIsValidatingPromo] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user && !formData.name && !formData.email) {
            setFormData(prev => ({
                ...prev,
                name: user.name || "",
                email: user.email || ""
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyPromo = async () => {
        if (!promoCode) return;
        setIsValidatingPromo(true);
        try {
            const result = await validatePromo.mutateAsync({
                code: promoCode,
                eventId: event?.id.toString()
            });
            setAppliedPromo(result as PromoCode);
            toast({ title: "Promo Applied!", description: "Discount has been applied to your total." });
        } catch (error: unknown) {
            let message = "This promo code is not valid.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            toast({
                title: "Invalid Promo",
                description: message,
                variant: "destructive"
            });
            setAppliedPromo(null);
        } finally {
            setIsValidatingPromo(false);
        }
    };

    const calculateDiscount = () => {
        if (!appliedPromo || !event) return 0;
        const price = Number(event.price);
        if (appliedPromo.discount_percentage) {
            return (price * appliedPromo.discount_percentage) / 100;
        }
        if (appliedPromo.discount_amount) {
            return Number(appliedPromo.discount_amount);
        }
        return 0;
    };

    const discountAmount = calculateDiscount();
    const finalTotal = Math.max(0, Number(event?.price || 0) - discountAmount);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createBooking.mutateAsync({
                event_id: event?.id,
                promo_code: appliedPromo?.code,
                ...formData
            });

            if (result.snap_token) {
                setIsSubmitting(false);
                window.snap.pay(result.snap_token, {
                    onSuccess: () => {
                        setShowSuccess(true);
                    },
                    onPending: (result: unknown) => {
                        toast({
                            title: "Payment Pending",
                            description: "Please complete your payment.",
                        });
                        navigate("/my-bookings");
                    },
                    onError: (result: unknown) => {
                        toast({
                            title: "Payment Failed",
                            description: "There was an error processing your payment.",
                            variant: "destructive",
                        });
                    }
                });
            } else {
                // Free event
                setIsSubmitting(false);
                setShowSuccess(true);
            }
        } catch (error: unknown) {
            setIsSubmitting(false);
            let message = "Could not create booking. Please try again.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            toast({
                title: "Registration Failed",
                description: message,
                variant: "destructive",
            });
        }
    };

    if (eventLoading) return <div className="p-24 text-center">Loading...</div>;

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 relative">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Event
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-2xl p-8"
                        >
                            <h1 className="font-display text-3xl mb-2">Registration</h1>
                            <p className="text-muted-foreground mb-8">Please fill in your participant details correctly.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Main Participant Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                name="name"
                                                placeholder="Enter your full name"
                                                className="pl-10"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    className="pl-10"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="Enter your phone number"
                                                    className="pl-10"
                                                    required
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Multi-Participant Section */}
                                <div className="space-y-4 pt-4 border-t border-border">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-lg font-display">Additional Participants (Max 4)</Label>
                                        <span className="text-xs text-muted-foreground">{formData.participants.length}/4</span>
                                    </div>

                                    {formData.participants.map((p: Participant, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-6 rounded-2xl border border-border bg-card/50 space-y-4 relative group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <Badge variant="outline" className="text-primary border-primary/20">
                                                    Participant #{idx + 2}
                                                </Badge>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"
                                                    onClick={() => {
                                                        const newParticipants = [...formData.participants];
                                                        newParticipants.splice(idx, 1);
                                                        setFormData(prev => ({ ...prev, participants: newParticipants }));
                                                    }}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Full Name</Label>
                                                    <Input
                                                        value={p.name}
                                                        onChange={(e) => {
                                                            const newParticipants = [...formData.participants];
                                                            newParticipants[idx].name = e.target.value;
                                                            setFormData(prev => ({ ...prev, participants: newParticipants }));
                                                        }}
                                                        placeholder="Name"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Email</Label>
                                                        <Input
                                                            type="email"
                                                            value={p.email}
                                                            onChange={(e) => {
                                                                const newParticipants = [...formData.participants];
                                                                newParticipants[idx].email = e.target.value;
                                                                setFormData(prev => ({ ...prev, participants: newParticipants }));
                                                            }}
                                                            placeholder="Email"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Phone</Label>
                                                        <Input
                                                            type="tel"
                                                            value={p.phone}
                                                            onChange={(e) => {
                                                                const newParticipants = [...formData.participants];
                                                                newParticipants[idx].phone = e.target.value;
                                                                setFormData(prev => ({ ...prev, participants: newParticipants }));
                                                            }}
                                                            placeholder="Phone"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {formData.participants.length < 4 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-dashed border-2 py-8 rounded-2xl hover:bg-primary/5 hover:border-primary/50 transition-all group"
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                participants: [...prev.participants, { name: "", email: "", phone: "" }]
                                            }))}
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <span>Add Another Participant</span>
                                            </div>
                                        </Button>
                                    )}
                                </div>

                                <div className="space-y-2 pt-4 border-t border-border">
                                    <Label htmlFor="promo">Promo Code (Optional)</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                id="promo"
                                                placeholder="Enter promo code"
                                                className="pl-10"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                disabled={!!appliedPromo}
                                            />
                                        </div>
                                        {appliedPromo ? (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setAppliedPromo(null);
                                                    setPromoCode("");
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={handleApplyPromo}
                                                disabled={!promoCode || isValidatingPromo}
                                                className="gap-2"
                                            >
                                                {isValidatingPromo && <Loader2 className="w-4 h-4 animate-spin" />}
                                                Apply
                                            </Button>
                                        )}
                                    </div>
                                    {appliedPromo && (
                                        <p className="text-xs text-success flex items-center gap-1 mt-1">
                                            <ShieldCheck className="w-3 h-3" />
                                            Promo code applied: {appliedPromo.discount_percentage ? `${appliedPromo.discount_percentage}% OFF` : `Rp ${Number(appliedPromo.discount_amount).toLocaleString()} OFF`}
                                        </p>
                                    )}
                                </div>

                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                                    <div className="flex items-center gap-2 text-primary font-semibold">
                                        <ShieldCheck className="w-5 h-5" />
                                        Participation Terms
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        By registering, I agree to the event's terms and conditions, including health requirements and safety protocols.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full btn-hero h-14"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Processing..." : finalTotal > 0 ? "Continue to Payment" : "Confirm Registration"}
                                </Button>
                            </form>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                            <h3 className="font-display text-xl mb-4">Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between pb-4 border-b border-border">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                                            <img src={event?.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-semibold line-clamp-1">{event?.title}</div>
                                            <div className="text-xs text-muted-foreground">1 Ticket + {formData.participants.length} Add-ons</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal ({formData.participants.length + 1} Pax)</span>
                                        <span>Rp {(Number(event?.price || 0) * (formData.participants.length + 1)).toLocaleString("id-ID")}</span>
                                    </div>

                                    {appliedPromo && (
                                        <div className="flex justify-between text-success">
                                            <div className="flex items-center gap-1">
                                                <span>Promo Discount</span>
                                            </div>
                                            <span>-Rp {discountAmount.toLocaleString("id-ID")}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between font-bold text-xl pt-4 border-t border-border">
                                        <span>Total</span>
                                        <span className="text-primary">
                                            Rp {(finalTotal * (formData.participants.length + 1)).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                            <CreditCard className="w-4 h-4" />
                            {finalTotal > 0 ? "Secure Payment via Midtrans" : "Secure Registration"}
                        </div>
                    </div>
                </div>

                {/* Loading Runner Overlay */}
                <AnimatePresence>
                    {isSubmitting && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center"
                        >
                            <div className="relative w-24 h-24 mb-6">
                                <motion.div
                                    animate={{
                                        x: [-20, 20, -20],
                                        y: [0, -10, 0],
                                        rotate: [0, 5, 0]
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="text-primary"
                                >
                                    <Footprints className="w-16 h-16" />
                                </motion.div>
                                <motion.div
                                    animate={{
                                        opacity: [0.2, 0.5, 0.2],
                                        scale: [0.8, 1.2, 0.8]
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary/20 rounded-full blur-sm"
                                />
                            </div>
                            <h2 className="font-display text-2xl animate-pulse">Running to Secure Your Spot...</h2>
                            <p className="text-muted-foreground mt-2">Preparing your digital BIB numbers</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Success Animation Overlay */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[110] bg-background flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="max-w-md w-full text-center space-y-8"
                            >
                                <div className="relative flex justify-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                                        className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center text-success"
                                    >
                                        <CheckCircle2 className="w-12 h-12" />
                                    </motion.div>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="absolute inset-0 w-24 h-24 rounded-full border-4 border-success/30 mx-auto"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <h1 className="font-display text-4xl">Registration Confirmed!</h1>
                                    <p className="text-muted-foreground">You have successfully registered for</p>
                                    <p className="font-semibold text-lg text-primary">{event?.title}</p>
                                </div>

                                <Card className="bg-card/50 border-dashed">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Total Participants</span>
                                            <span className="font-bold">{formData.participants.length + 1} People</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Order Ref</span>
                                            <span className="font-mono text-primary font-bold">READY TO RUN</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="space-y-4">
                                    <Button
                                        className="w-full h-14 text-lg font-display"
                                        onClick={() => navigate("/my-bookings")}
                                    >
                                        View My Bookings
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        Your digital BIB numbers and tickets are now ready in your dashboard.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default EventRegistration;
