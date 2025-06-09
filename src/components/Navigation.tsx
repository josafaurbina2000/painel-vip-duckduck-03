
import { NavLink } from "react-router-dom";
import { Badge, User, Plus, List } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { to: "/", icon: Badge, label: "Dashboard" },
    { to: "/vips", icon: List, label: "Lista de VIPs" },
    { to: "/add-vip", icon: Plus, label: "Adicionar VIP" },
  ];

  return (
    <nav className="border-b border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-4 text-sm font-medium transition-colors hover:text-primary border-b-2 border-transparent hover:border-primary/50 ${
                  isActive 
                    ? "text-primary border-primary" 
                    : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
