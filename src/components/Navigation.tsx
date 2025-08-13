
import { NavLink } from "react-router-dom";
import { Badge, User, Plus, List } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navigation = () => {
  const isMobile = useIsMobile();

  const navItems = [
    { to: "/", icon: Badge, label: "Dashboard" },
    { to: "/vips", icon: List, label: "Lista de VIPs" },
    { to: "/add-vip", icon: Plus, label: "Adicionar VIP" },
  ];

  if (isMobile) {
    return null; // Navigation é tratada pelo MobileNav
  }

  return (
    <nav className="bg-transparent">
      <div className="container mx-auto px-6">
        <div className="flex gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active text-primary" : "text-muted-foreground"}`
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
