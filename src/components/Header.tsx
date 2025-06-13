
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileNav />
            <div className="flex items-center gap-3">
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  alt="BF4 VIP Panel Logo" 
                  className="w-full h-full object-cover" 
                  src="/lovable-uploads/174ee1fd-49bf-40c5-9a69-c78c6aa39044.png" 
                />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {isMobile ? "DUCK DUCK" : "Painel VIP - DUCK DUCK"}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {isMobile ? "VIP Panel" : "Gerenciamento de VIPs"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Badge variant="secondary" className="hidden sm:flex bg-primary/10 text-primary border-primary/20">
              Admin Panel
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
