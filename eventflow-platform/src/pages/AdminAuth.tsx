import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Mail, Lock, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAdmin, adminSignIn } = useAuth();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/admin";

    useEffect(() => {
        if (user && isAdmin) {
            navigate(from, { replace: true });
        }
    }, [user, isAdmin, navigate, from]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await adminSignIn(formData.email, formData.password);

        setIsLoading(false);

        if (error) {
            toast({
                title: "Access Denied",
                description: error || "Invalid admin credentials",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Welcome, Administrator",
            description: "You have successfully authenticated to the management console.",
        });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <ShieldCheck className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <span className="font-display text-3xl tracking-wider text-foreground">ANTARESTAR</span>
                    </div>
                    <h1 className="text-xl font-medium text-muted-foreground uppercase tracking-[0.2em]">Management Console</h1>
                </div>

                <div className="glass border border-border p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-muted-foreground">Administrator Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@antarestar.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-muted/50 border-input pl-10 h-12 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/30"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-muted-foreground">Access Password</Label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-muted/50 border-input pl-10 h-12 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/30"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "SECURE LOGIN"
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-8 text-muted-foreground/30 text-xs tracking-widest uppercase">
                    Authorized Personnel Only • Secure Access System
                </p>
            </motion.div>
        </div>
    );
};

export default AdminAuth;
