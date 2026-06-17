import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Trophy, Home, Circle, Square, Building, BookOpen, Menu, X } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Carrom", href: "/carrom", icon: Circle },
    { name: "Chess", href: "/chess", icon: Square },
    { name: "Jenga", href: "/jenga", icon: Building },
    { name: "Olympics", href: "/olympics", icon: Trophy },
    { name: "Rulebook", href: "/rulebook", icon: BookOpen },
  ];

  const sidebarStyle = { background: "linear-gradient(180deg, hsl(265 30% 8%), hsl(252 30% 6%))" };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {navItems.map((item) => {
        const isActive = location === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            data-testid={`nav-link-${item.name.toLowerCase()}`}
            onClick={onNavigate}
            className={`flex items-center px-4 py-3 transition-all ${isActive
                ? "bg-gradient-to-r from-primary/20 to-secondary/5 border-l-2 border-primary text-primary font-semibold"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-white/5 border-l-2 border-transparent"
              }`}
          >
            <item.icon
              className={`w-5 h-5 mr-3 ${isActive ? "text-primary" : "text-sidebar-foreground/50"}`}
            />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden dark">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex w-64 flex-shrink-0 border-r border-sidebar-border flex-col z-10"
        style={sidebarStyle}
      >
        <div className="h-20 flex flex-col justify-center px-6">
          <div className="flex items-center">
            <Trophy className="w-6 h-6 text-primary mr-3" />
            <span className="font-black text-lg tracking-widest uppercase gradient-text">
              TECHINFINI<br />GAMES
            </span>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="h-px w-full bg-gradient-to-r from-primary/40 via-secondary/20 to-transparent"></div>
        </div>
        <nav className="flex-1 py-2 space-y-1">
          <NavLinks />
        </nav>
      </aside>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={sidebarStyle}
      >
        <div className="h-20 flex items-center justify-between px-6">
          <div className="flex items-center">
            <Trophy className="w-6 h-6 text-primary mr-3" />
            <span className="font-black text-lg tracking-widest uppercase gradient-text">
              TECHINFINI<br />GAMES
            </span>
          </div>
          <button
            data-testid="button-close-menu"
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-md text-sidebar-foreground/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-4">
          <div className="h-px w-full bg-gradient-to-r from-primary/40 via-secondary/20 to-transparent"></div>
        </div>
        <nav className="flex-1 py-2 space-y-1">
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background flex flex-col min-w-0 relative">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center h-16 px-4 border-b border-border flex-shrink-0 z-10"
          style={sidebarStyle}
        >
          <button
            data-testid="button-open-menu"
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-md text-sidebar-foreground/70 hover:text-white hover:bg-white/10 transition-colors mr-3"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Trophy className="w-5 h-5 text-primary mr-2" />
          <span className="font-black text-sm tracking-widest uppercase gradient-text">
            Tournament Hub
          </span>
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
