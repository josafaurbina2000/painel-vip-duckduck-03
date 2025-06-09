
import { useState, useEffect } from "react";
import { Search, Filter, Calendar, User, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Link, useNavigate } from "react-router-dom";
import { VIP } from "@/types/vip";
import { useVIP } from "@/contexts/VIPContext";
import { calculateDaysRemaining, formatCurrency, formatDate, filterVIPs } from "@/utils/vipUtils";
import { useToast } from "@/hooks/use-toast";
import VIPBadge from "@/components/VIPBadge";

const VIPList = () => {
  const { vips, deleteVIP } = useVIP();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [filteredVips, setFilteredVips] = useState<VIP[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expiringFilter, setExpiringFilter] = useState("todos");

  useEffect(() => {
    setFilteredVips(vips);
  }, [vips]);

  useEffect(() => {
    const filters = {
      search: searchTerm,
      status: statusFilter,
      expiringInDays: expiringFilter !== "todos" ? parseInt(expiringFilter) : undefined
    };

    const filtered = filterVIPs(vips, filters);
    setFilteredVips(filtered);
  }, [vips, searchTerm, statusFilter, expiringFilter]);

  const handleDeleteVIP = (vip: VIP) => {
    deleteVIP(vip.id);
    toast({
      title: "VIP removido",
      description: `O VIP de ${vip.playerName} foi removido com sucesso.`,
    });
  };

  const handleEditVIP = (vipId: string) => {
    navigate(`/add-vip?edit=${vipId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com filtros */}
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nome do jogador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-background/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="expired">Expirados</SelectItem>
                  <SelectItem value="permanent">Permanentes</SelectItem>
                </SelectContent>
              </Select>

              <Select value={expiringFilter} onValueChange={setExpiringFilter}>
                <SelectTrigger className="w-48 bg-background/50">
                  <SelectValue placeholder="Vencimento" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="5">Próximos 5 dias</SelectItem>
                  <SelectItem value="10">Próximos 10 dias</SelectItem>
                  <SelectItem value="15">Próximos 15 dias</SelectItem>
                  <SelectItem value="30">Próximos 30 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {filteredVips.length} {filteredVips.length === 1 ? 'VIP encontrado' : 'VIPs encontrados'}
            </p>
            <Link to="/add-vip">
              <Button className="bg-primary hover:bg-primary/90">
                Adicionar VIP
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Lista de VIPs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVips.map((vip) => {
          const daysRemaining = vip.isPermanent ? null : calculateDaysRemaining(vip.endDate);
          
          return (
            <Card key={vip.id} className="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header do card */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{vip.playerName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Cadastrado em {formatDate(vip.createdAt)}
                        </p>
                      </div>
                    </div>
                    <VIPBadge status={vip.status} />
                  </div>

                  {/* Informações do VIP */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor Pago</p>
                      <p className="font-semibold text-lg">{formatCurrency(vip.amountPaid)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {vip.isPermanent ? 'Status' : 'Vencimento'}
                      </p>
                      <p className="font-semibold">
                        {vip.isPermanent ? 'Permanente' : formatDate(vip.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Dias restantes (se não for permanente) */}
                  {!vip.isPermanent && daysRemaining !== null && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {daysRemaining > 0 ? (
                          <span className={daysRemaining <= 7 ? 'text-warning font-medium' : 'text-muted-foreground'}>
                            {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
                          </span>
                        ) : (
                          <span className="text-danger font-medium">Expirado</span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Observações (se houver) */}
                  {vip.observations && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Observações</p>
                      <p className="text-sm">{vip.observations}</p>
                    </div>
                  )}

                  {/* Botões de ação */}
                  <div className="flex gap-2">
                    <Link to={`/vip/${vip.id}`} className="flex-1">
                      <Button variant="outline" className="w-full hover:bg-primary/10 hover:border-primary">
                        Ver Detalhes
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEditVIP(vip.id)}
                      className="hover:bg-primary/10 hover:border-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="hover:bg-danger/10 hover:border-danger text-danger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover o VIP de {vip.playerName}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteVIP(vip)} 
                            className="bg-danger hover:bg-danger/90"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredVips.length === 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <Filter className="w-12 h-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Nenhum VIP encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou adicionar um novo VIP.
                </p>
              </div>
              <Link to="/add-vip">
                <Button className="bg-primary hover:bg-primary/90">
                  Adicionar VIP
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VIPList;
