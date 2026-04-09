import { Link } from "react-router-dom";
import { Trophy, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background border-t-8 border-background relative">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-14 h-14 bg-primary border-4 border-background flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-[4px_4px_0px_0px_hsl(var(--background))]">
                <Trophy className="w-8 h-8 text-foreground" />
              </div>
              <span className="font-display text-4xl tracking-widest font-black uppercase">ANTARESTAR</span>
            </Link>
            <p className="text-lg font-bold max-w-sm">
              YOUR PREMIER DESTINATION FOR SPORTS EVENTS, MARATHONS, AND ENDURANCE CHALLENGES ACROSS INDONESIA.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 bg-background text-foreground flex items-center justify-center hover:-translate-y-1 hover:bg-primary transition-transform border-2 border-transparent">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="w-10 h-10 bg-background text-foreground flex items-center justify-center hover:-translate-y-1 hover:bg-primary transition-transform border-2 border-transparent">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="w-10 h-10 bg-background text-foreground flex items-center justify-center hover:-translate-y-1 hover:bg-primary transition-transform border-2 border-transparent">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="w-10 h-10 bg-background text-foreground flex items-center justify-center hover:-translate-y-1 hover:bg-primary transition-transform border-2 border-transparent">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-2xl font-black mb-6 bg-primary text-foreground inline-block px-3 py-1">QUICK LINKS</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/events" className="text-xl font-black hover:text-primary hover:translate-x-2 transition-transform inline-block">
                  ALL EVENTS
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-xl font-black hover:text-primary hover:translate-x-2 transition-transform inline-block">
                  EVENT CATEGORIES
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-xl font-black hover:text-primary hover:translate-x-2 transition-transform inline-block">
                  MY DASHBOARD
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-2xl font-black mb-6 bg-secondary text-foreground inline-block px-3 py-1">SUPPORT</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-xl font-black hover:text-secondary hover:translate-x-2 transition-transform inline-block">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-xl font-black hover:text-secondary hover:translate-x-2 transition-transform inline-block">
                  TERMS & CONDITIONS
                </a>
              </li>
              <li>
                <a href="#" className="text-xl font-black hover:text-secondary hover:translate-x-2 transition-transform inline-block">
                  PRIVACY POLICY
                </a>
              </li>
              <li>
                <a href="#" className="text-xl font-black hover:text-secondary hover:translate-x-2 transition-transform inline-block">
                  REFUND POLICY
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-2xl font-black mb-6 bg-accent text-foreground inline-block px-3 py-1">CONTACT US</h4>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-lg font-bold hover:text-accent transition-colors">
                <div className="w-10 h-10 bg-background text-foreground flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                INFO@ANTARESTAR.COM
              </li>
              <li className="flex items-center gap-4 text-lg font-bold hover:text-accent transition-colors">
                <div className="w-10 h-10 bg-background text-foreground flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                +62 812 3456 7890
              </li>
              <li className="flex items-start gap-4 text-lg font-bold hover:text-accent transition-colors">
                <div className="w-10 h-10 bg-background text-foreground flex items-center justify-center mt-1 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                JAKARTA, INDONESIA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t-4 border-background/20 text-center text-lg font-black tracking-widest">
          <p>COPYRIGHT &copy; {new Date().getFullYear()} ANTARESTAR EVENT. RAW TO THE CORE.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
