import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Mail, Lock, Loader2, ShieldCheck, ArrowLeft, Terminal } from "lucide-react";
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
                title: "ACCESS DENIED",
                description: error || "Invalid admin credentials",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "WELCOME, ADMINISTRATOR",
            description: "Permission granted. Transferring to management console.",
        });
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 selection:bg-[#ffde03] selection:text-black">
            {/* Background pattern */}
            <div className="fixed inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9Ijc4IiBoZWlnaHQ9IjM4IiB4PSIxIiB5PSIxIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-repeat" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                {/* Back to Home */}
                <div className="mb-10 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest border border-zinc-500 hover:border-white px-4 py-2 mb-8">
                        <ArrowLeft className="w-3 h-3" />
                        KEMBALI KE BERANDA
                    </Link>
                    
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-[#ffde03] border-2 border-white flex items-center justify-center rotate-6 shadow-[4px_4px_0px_white]">
                            <Terminal className="w-8 h-8 text-black" />
                        </div>
                        <div className="space-y-1">
                             <h1 className="font-display text-4xl font-black text-white uppercase tracking-tighter">ADMIN<br/>ACCESS</h1>
                             <div className="h-1 w-16 bg-red-600 mx-auto" />
                        </div>
                    </div>
                </div>

                {/* Brutalist Form Container */}
                <div className="relative group">
                    {/* Background Offset */}
                    <div className="absolute inset-0 bg-red-600 translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
                    
                    <div className="relative bg-zinc-900 border-2 border-white p-8 md:p-10 shadow-xl">
                        <div className="mb-6 border-b border-white/10 pb-4 flex items-center justify-between">
                            <span className="font-black text-[9px] text-white/30 uppercase tracking-[0.4em]">SYSTEM.AUTH.SECURE</span>
                            <ShieldCheck className="w-4 h-4 text-[#ffde03]" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label className="font-black text-[10px] text-white/50 uppercase tracking-widest">Email Administrator</Label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-[#ffde03] transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="ROOT@ANTARESTAR.OPS"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="h-14 pl-12 bg-black border border-white/20 focus:border-white focus:ring-0 rounded-none text-white font-bold placeholder:text-white/10 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="font-black text-[10px] text-white/50 uppercase tracking-widest">Kata Sandi Akses</Label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-[#ffde03] transition-colors" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="h-14 pl-12 bg-black border border-white/20 focus:border-white focus:ring-0 rounded-none text-white font-bold placeholder:text-white/10 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-white text-black hover:bg-[#ffde03] font-display text-xl font-black uppercase tracking-widest rounded-none border-0 transition-all active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    "MASUK PANEL"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center gap-4">
                    <p className="text-[9px] font-bold text-zinc-600 text-center uppercase tracking-widest leading-relaxed">
                        Authorized Personnel Only<br/>
                        All Access Attempts are Logged via IP-6 Grid
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminAuth;
