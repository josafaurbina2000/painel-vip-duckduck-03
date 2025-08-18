import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao sair da conta",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    }
  };
  return <header className="glass-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img alt="Duck Duck Logo" src="/lovable-uploads/94c07cd7-e0e8-4f86-b70e-b733408e84a7.png" className="h-8 w-8 my-0 rounded-sm object-contain" />
              
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Painel VIP - DUCK DUCK</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Sistema de Gerenciamento
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hidden sm:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>;
};
export default Header;