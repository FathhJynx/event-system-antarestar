import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Mail, Lock, User, Phone, ArrowLeft, Loader2, Zap, Target, Flame, ShieldAlert, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp } = useAuth();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginData.email, loginData.password);
    setIsLoading(false);

    if (error) {
      toast({
        title: "ACCESS DENIED",
        description: error || "Invalid credentials.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "ACCESS GRANTED",
      description: "Identity verified. Proceed to deployment.",
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "DATA MISMATCH",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "WEAK SECURITY",
        description: "Minimum 6 characters required for vault encryption.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await signUp(
      signupData.email,
      signupData.password,
      signupData.name,
      signupData.phone
    );
    setIsLoading(false);

    if (error) {
      toast({
        title: "ENLISTMENT FAILED",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "ENLISTMENT SUCCESSFUL",
      description: "Awaiting final clearance. Please check your email.",
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row text-black font-sans selection:bg-pink-500 selection:text-white overflow-hidden">
      
      {/* Left Section: High Impact Editorial Wrapper */}
      <section className="hidden lg:flex flex-1 relative bg-[#ffde03] border-r-4 border-black flex-col justify-between overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwIDEwTDEwIDIwTDIwIDMwTDMwIDIwTDIwIDEwWiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-repeat" />
        
        {/* Top Header */}
        <div className="p-12 z-10 flex justify-between items-start">
           <Link to="/" className="group flex items-center gap-4 border-2 border-black bg-white px-6 py-3 shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <ArrowLeft className="w-6 h-6" />
              <span className="font-black uppercase tracking-widest text-xs tracking-tight">KEMBALI</span>
           </Link>
           <div className="bg-black text-white px-4 py-2 font-black text-xs tracking-[0.5em] rotate-90 origin-right translate-x-12">
              ANTARESTAR.OPS
           </div>
        </div>

        {/* Central Graphic */}
        <div className="px-12 z-10">
           <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
           >
              <h1 className="font-display text-[12rem] font-black leading-[0.75] uppercase tracking-tighter mix-blend-multiply">
                 GASPOL<br/>
                 <span className="text-white text-stroke-black">LIMITS</span>
              </h1>
              <div className="mt-12 flex items-center gap-6">
                 <div className="w-24 h-24 bg-black flex items-center justify-center text-[#ffde03] rotate-6 shadow-[8px_8px_0px_white]">
                    <Target className="w-12 h-12" />
                 </div>
                 <p className="max-w-md font-bold text-xl uppercase leading-tight">
                    ESTABLISH YOUR DIGITAL IDENTITY TO ACCESS THE ARCHIVE AND DEploy INTO THE FIELD.
                 </p>
              </div>
           </motion.div>
        </div>

        {/* Bottom Stats/Info */}
        <div className="p-12 z-10 grid grid-cols-2 gap-8 border-t-2 border-black bg-white/50 backdrop-blur-sm">
           <div className="space-y-2">
              <span className="block font-black text-xs uppercase opacity-40">SYSTEM STATUS</span>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                 <span className="font-bold text-sm uppercase">AUTHENTICATION.SERVER.ONLINE</span>
              </div>
           </div>
           <div className="space-y-2 text-right">
              <span className="block font-black text-xs uppercase opacity-40">ENCRYPTION</span>
              <span className="font-bold text-sm uppercase font-mono">AES-256-GCM.S01</span>
           </div>
        </div>
      </section>

      {/* Right Section: Form Terminal */}
      <section className="flex-1 min-h-screen flex flex-col items-center justify-start lg:justify-center p-6 md:p-12 relative bg-white">
        {/* Mobile Header: Fixed for better space management */}
        <div className="lg:hidden fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-white border-b-2 border-black z-[100] h-16 w-full shadow-sm">
          <Link to="/" className="text-black group">
             <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <span className="font-display font-black text-xl tracking-tighter">ANTARESTAR</span>
          <div className="w-7 h-7 bg-black flex items-center justify-center text-white">
             <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        
        {/* Spacer for fixed header on mobile */}
        <div className="h-20 lg:hidden" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl"
        >
          {/* Content Wrapper */}
          <div className="relative w-full">
            {/* Softened Frames */}
            <div className="absolute -inset-2 bg-black rotate-1 z-0 shadow-[4px_4px_0px_#ffde03]" />
            <div className="absolute -inset-2 bg-white border-2 border-black z-10" />

            {/* Main Content */}
            <div className="relative z-20 p-6 md:p-10">
              {/* Tab Switcher */}
              <div className="flex border-2 border-black mb-8 overflow-hidden shadow-[4px_4px_0px_black]">
                <button 
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 font-display text-xl font-black uppercase transition-all ${activeTab === 'login' ? 'bg-black text-white' : 'bg-white hover:bg-zinc-100'}`}
                >
                  MASUK
                </button>
                <button 
                  onClick={() => setActiveTab('signup')}
                  className={`flex-1 py-3 font-display text-xl font-black uppercase transition-all ${activeTab === 'signup' ? 'bg-black text-white' : 'bg-white hover:bg-zinc-100'}`}
                >
                  DAFTAR
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    <div className="border-l-8 border-black pl-6 mb-8">
                      <h2 className="font-display text-5xl font-black uppercase leading-none">SELAMAT<br/>DATANG</h2>
                      <p className="mt-2 text-sm font-bold uppercase opacity-50 tracking-widest leading-relaxed">Masuk untuk melanjutkan perjuanganmu di arena.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-3">
                        <Label className="font-black text-xs uppercase tracking-[0.2em]">Email Terdaftar</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                          <Input 
                            type="email" 
                            required
                            placeholder="OPERATIVE@ANTARESTAR.COM"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className="h-14 pl-12 border-2 border-black rounded-none bg-zinc-50 focus:bg-white focus:ring-0 text-base font-bold placeholder:opacity-30 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.1)] focus:shadow-[2px_2px_0px_black]"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <Label className="font-black text-xs uppercase tracking-[0.2em]">Kata Sandi Aman</Label>
                          <button type="button" className="text-[10px] font-black uppercase tracking-tighter hover:text-pink-500">LUPA SANDI?</button>
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            required
                            placeholder="••••••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="h-14 pl-12 pr-12 border-2 border-black rounded-none bg-zinc-50 focus:bg-white focus:ring-0 text-base font-bold placeholder:opacity-30 transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.1)] focus:shadow-[2px_2px_0px_black]"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-zinc-200 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        disabled={isLoading}
                        className="w-full h-14 bg-black text-white hover:bg-pink-500 font-display text-xl font-black uppercase tracking-widest rounded-none border-t-0 shadow-[4px_4px_0px_#ffde03] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                      >
                        {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : "MASUK SEKARANG"}
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="border-l-8 border-[#ffde03] pl-6 mb-8">
                       <h2 className="font-display text-5xl font-black uppercase leading-none text-black">GABUNG<br/>EKOSISTEM</h2>
                       <p className="mt-2 text-sm font-bold uppercase opacity-50 tracking-widest leading-relaxed">Jadilah bagian dari ribuan atlet terbaik di Indonesia.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                      {/* Grid for compact feel */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="font-black text-[10px] uppercase tracking-widest opacity-40">Alias/Designation</Label>
                           <Input 
                            placeholder="OPERATIVE NAME"
                            required
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            className="h-12 border-2 border-black rounded-none font-bold"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="font-black text-[10px] uppercase tracking-widest opacity-40">Comm-Link (Phone)</Label>
                           <Input 
                            placeholder="+62 8XX..."
                            type="tel"
                            required
                            value={signupData.phone}
                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                            className="h-14 border-4 border-black rounded-none font-bold"
                           />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-black text-[10px] uppercase tracking-widest opacity-40">Primary Email</Label>
                        <Input 
                          placeholder="OPERATIVE@EMAIL.COM"
                          type="email"
                          required
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="h-12 border-2 border-black rounded-none font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="font-black text-[10px] uppercase tracking-widest opacity-40">Vault Key</Label>
                           <Input 
                            type="password"
                            required
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            className="h-12 border-2 border-black rounded-none font-bold"
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="font-black text-[10px] uppercase tracking-widest opacity-40">Verify Key</Label>
                           <Input 
                            type="password"
                            required
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                            className="h-12 border-2 border-black rounded-none font-bold"
                           />
                        </div>
                      </div>

                      <Button 
                        disabled={isLoading}
                        className="w-full h-14 bg-[#ffde03] text-black hover:bg-black hover:text-white font-display text-xl font-black uppercase tracking-widest rounded-none border-2 border-black shadow-[4px_4px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mt-4"
                      >
                        {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : "DAFTAR SEKARANG"}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Login/Footer */}
              <div className="mt-8 pt-6 border-t-2 border-black border-dashed flex flex-col items-center gap-6">
                 <div className="flex items-center gap-4 w-full">
                    <div className="h-[2px] flex-1 bg-black/10" />
                    <span className="font-black text-[10px] uppercase tracking-[0.3em] opacity-30">SECURE TRANSACTION ZONE</span>
                    <div className="h-[2px] flex-1 bg-black/10" />
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer">
                       <Flame className="w-5 h-5" />
                    </div>
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center grayscale hover:grayscale-0 cursor-pointer">
                       <Trophy className="w-5 h-5" />
                    </div>
                 </div>
                 <p className="text-[9px] font-bold text-center uppercase leading-relaxed opacity-40 max-w-xs">
                    By authenticating, you agree to our Protocol Terms and Field Deployment Guidelines. All data is encrypted via military-grade standards.
                 </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-32 h-32 border-b-8 border-l-8 border-black pointer-events-none opacity-5 hidden lg:block" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-t-8 border-r-8 border-black pointer-events-none opacity-5 hidden lg:block" />
      </section>
    </div>
  );
};

export default Auth;
