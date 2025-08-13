
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
      <div className="container mx-auto px-6 py-2">
        <div className="pill-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `pill-nav-link ${isActive ? "pill-nav-link-active" : ""}`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
