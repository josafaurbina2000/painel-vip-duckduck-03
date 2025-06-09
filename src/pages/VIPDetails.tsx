import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, FileText, User, Crown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useVIP } from "@/contexts/VIPContext";
import { calculateDaysRemaining, formatCurrency, formatDate, formatDateTime } from "@/utils/vipUtils";
import { useToast } from "@/hooks/use-toast";
import VIPBadge from "@/components/VIPBadge";
import FileViewer from "@/components/FileViewer";

const VIPDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVIPById, deleteVIP, updateVIP } = useVIP();
  const { toast } = useToast();
  
  const vip = id ? getVIPById(id) : null;

  if (!vip) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <User className="w-16 h-16 text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold mb-2">VIP não encontrado</h3>
                <p className="text-muted-foreground">
                  O VIP solicitado não existe ou foi removido.
                </p>
              </div>
              <Link to="/vips">
                <Button className="bg-primary hover:bg-primary/90">
                  Voltar para Lista
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(vip.endDate);

  const handleDeleteVIP = () => {
    deleteVIP(vip.id);
    toast({
      title: "VIP removido",
      description: `O VIP de ${vip.playerName} foi removido com sucesso.`,
    });
    navigate("/vips");
  };

  const handleExtendVIP = () => {
    const newEndDate = new Date(vip.endDate);
    newEndDate.setDate(newEndDate.getDate() + 30);
    
    updateVIP(vip.id, { endDate: newEndDate, durationDays: vip.durationDays + 30 });
    
    toast({
      title: "VIP estendido",
      description: `O VIP de ${vip.playerName} foi estendido por mais 30 dias.`,
    });
  };

  const handleEditVIP = () => {
    navigate(`/add-vip?edit=${vip.id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{vip.playerName}</h1>
            <p className="text-muted-foreground">
              Detalhes do VIP
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <VIPBadge status={vip.status} className="text-sm" />
          <Button variant="outline" size="sm" onClick={handleEditVIP}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status e datas */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Informações do VIP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data de Início</p>
                    <p className="font-semibold">{formatDate(vip.startDate)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data de Vencimento</p>
                    <p className="font-semibold">{formatDate(vip.endDate)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Data de Cadastro</p>
                    <p className="font-semibold">{formatDateTime(vip.createdAt)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Duração</p>
                    <p className="font-semibold">{vip.durationDays} dias</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dias Restantes</p>
                    <p className={`font-semibold ${
                      daysRemaining <= 0 ? 'text-danger' : 
                      daysRemaining <= 7 ? 'text-warning' : 'text-success'
                    }`}>
                      {daysRemaining > 0 ? daysRemaining : 'Expirado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <VIPBadge status={vip.status} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pagamento */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Pago</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(vip.amountPaid)}</p>
                </div>
                {vip.paymentProof ? (
                  <FileViewer file={vip.paymentProof} />
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nenhum comprovante anexado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {vip.observations && (
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="whitespace-pre-wrap">{vip.observations}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Ações rápidas */}
        <div className="space-y-6">
          {/* Resumo */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{vip.playerName}</p>
                  <p className="text-sm text-muted-foreground">Jogador VIP</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor Pago</span>
                  <span className="font-medium">{formatCurrency(vip.amountPaid)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duração</span>
                  <span className="font-medium">{vip.durationDays} dias</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-lg">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handleEditVIP}>
                <Edit className="w-4 h-4 mr-2" />
                Editar VIP
              </Button>
              
              {vip.status === 'active' && (
                <Button variant="outline" className="w-full justify-start" onClick={handleExtendVIP}>
                  <Clock className="w-4 h-4 mr-2" />
                  Estender Duração (+30 dias)
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-danger border-danger/20 hover:bg-danger/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remover VIP
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
                    <AlertDialogAction onClick={handleDeleteVIP} className="bg-danger hover:bg-danger/90">
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VIPDetails;
