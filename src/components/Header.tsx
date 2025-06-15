
import { Crown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Crown className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping"></div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Painel VIP
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Sistema de Gerenciamento
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AuthButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
