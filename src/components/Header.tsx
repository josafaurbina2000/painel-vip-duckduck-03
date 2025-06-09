
import { Badge } from "@/components/ui/badge";

const Header = () => {
  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">BF4</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Painel VIP
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gerenciamento de VIPs - Battlefield 4
                </p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Admin Panel
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Header;
