import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Target, Zap, Waves, LogOut, Settings, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, signOut } = useAuth();

  return (
    <Layout>
      <div className="bg-white min-h-screen text-black font-sans pb-20">
        
        {/* Profile Header: Athlete ID Style */}
        <section className="relative border-b-4 border-black pt-32 pb-20 px-8 flex flex-col md:flex-row items-center gap-12 bg-zinc-50 overflow-hidden">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-[#ffde03] -skew-x-12 translate-x-20 z-0 border-l-4 border-black" />
           <div className="absolute top-10 right-10 flex gap-2 z-10 opacity-20">
              {Array(5).fill(0).map((_, i) => <div key={i} className="w-12 h-12 border-4 border-black" />)}
           </div>

           <div className="relative z-10">
              <div className="w-48 h-48 md:w-64 md:h-64 border-4 border-black shadow-[12px_12px_0px_black] bg-white overflow-hidden group">
                 <div className="w-full h-full flex items-center justify-center bg-zinc-100 font-display text-8xl group-hover:scale-110 transition-transform">
                    {user?.name?.substring(0, 1).toUpperCase() || "A"}
                 </div>
              </div>
           </div>

           <div className="relative z-10 flex-1 text-center md:text-left">
              <span className="bg-black text-white px-4 py-2 font-black uppercase text-xs tracking-[0.4em]">RANK: PRO ATLET</span>
              <h1 className="font-display text-6xl md:text-9xl font-black uppercase tracking-tighter mt-4 leading-none truncate">
                 {user?.name || "USER ANONYMOUS"}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                 <div className="flex items-center gap-2 border-2 border-black px-4 py-2 bg-white">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-black uppercase text-xs">STATUS: AKTIF</span>
                 </div>
                 <div className="flex items-center gap-2 border-2 border-black px-4 py-2 bg-white">
                    <span className="font-black uppercase text-xs">ID: {String(user?.id || "").substring(0, 8) || "N/A"}</span>
                 </div>
              </div>
           </div>
        </section>

        {/* Stats Bento Grid */}
        <section className="px-8 mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
           <div className="md:col-span-2 bg-[#ffde03] border-4 border-black p-8 shadow-[8px_8px_0px_black] group hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="flex justify-between items-start mb-12">
                 <Trophy className="w-12 h-12" />
                 <span className="font-display text-2xl font-black opacity-20">DATA: 001</span>
              </div>
              <p className="font-display text-8xl font-black leading-none">12</p>
              <p className="font-sans font-black uppercase text-lg tracking-[0.2em] mt-2">MISI SELESAI</p>
           </div>

           <div className="border-4 border-black p-8 bg-zinc-900 text-white shadow-[8px_8px_0px_black] group hover:-translate-y-1 transition-transform cursor-pointer">
              <Award className="w-10 h-10 mb-8 text-[#ffde03]" />
              <p className="font-display text-6xl font-black">2.4K</p>
              <p className="font-sans font-black uppercase text-xs tracking-widest mt-2 opacity-60">XP POINTS</p>
           </div>

           <div className="border-4 border-black p-8 shadow-[8px_8px_0px_black] group hover:-translate-y-1 transition-transform cursor-pointer bg-white">
              <Target className="w-10 h-10 mb-8" />
              <p className="font-display text-6xl font-black">88%</p>
              <p className="font-sans font-black uppercase text-xs tracking-widest mt-2 opacity-60">WIN RATE</p>
           </div>
        </section>

        {/* Action Center */}
        <section className="px-8 mt-20">
           <div className="flex items-center gap-4 mb-8">
              <h2 className="font-display text-4xl font-black uppercase tracking-tighter">DATA CENTER</h2>
              <div className="h-[2px] flex-1 bg-black" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/my-bookings" className="flex items-center justify-between p-8 border-4 border-black hover:bg-[#ffde03] hover:text-black transition-all group">
                 <div className="flex items-center gap-6">
                    <Ticket className="w-8 h-8" />
                    <span className="font-sans font-black uppercase text-xl tracking-widest">TIKET SAYA</span>
                 </div>
                 <Zap className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <button className="flex items-center justify-between p-8 border-4 border-black hover:bg-zinc-100 transition-all group">
                 <div className="flex items-center gap-6">
                    <Settings className="w-8 h-8" />
                    <span className="font-sans font-black uppercase text-xl tracking-widest">PENGATURAN</span>
                 </div>
              </button>

              <button 
                onClick={() => signOut()}
                className="flex items-center justify-between p-8 border-4 border-black bg-red-500 text-white hover:bg-black transition-all group"
              >
                 <div className="flex items-center gap-6">
                    <LogOut className="w-8 h-8" />
                    <span className="font-sans font-black uppercase text-xl tracking-widest">KELUAR AKUN</span>
                 </div>
              </button>
           </div>
        </section>

        {/* Visual Decoration */}
        <div className="mt-20 px-8">
           <div className="w-full h-24 border-4 border-black border-dashed flex items-center justify-center opacity-10 font-display text-4xl font-black">
              ANTARESTAR ATHLETE PERFORMANCE OVERVIEW // 2026
           </div>
        </div>

      </div>
    </Layout>
  );
};

export default Profile;
