
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Badge, User, Plus, List, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { to: "/", icon: Badge, label: "Dashboard" },
    { to: "/vips", icon: List, label: "Lista de VIPs" },
    { to: "/add-vip", icon: Plus, label: "Adicionar VIP" },
  ];

  if (!isMobile) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              alt="BF4 VIP Panel Logo" 
              className="w-full h-full object-cover" 
              src="/lovable-uploads/174ee1fd-49bf-40c5-9a69-c78c6aa39044.png" 
            />
          </div>
          <div>
            <h2 className="font-bold text-lg">DUCK DUCK</h2>
            <p className="text-xs text-muted-foreground">VIP Panel</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
