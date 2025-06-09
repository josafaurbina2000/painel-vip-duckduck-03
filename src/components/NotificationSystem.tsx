
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Clock, AlertTriangle } from "lucide-react";
import { VIP } from "@/types/vip";
import { calculateDaysRemaining, formatDate } from "@/utils/vipUtils";
import { useToast } from "@/hooks/use-toast";

interface NotificationSystemProps {
  vips: VIP[];
}

const NotificationSystem = ({
  vips
}: NotificationSystemProps) => {
  const {
    toast
  } = useToast();

  // VIPs expirando hoje
  const expiringToday = vips.filter(vip => {
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining === 0;
  });

  // VIPs expirando em 1-3 dias
  const expiringSoon = vips.filter(vip => {
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining > 0 && daysRemaining <= 3;
  });

  // VIPs expirando em 4-7 dias
  const expiringThisWeek = vips.filter(vip => {
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining > 3 && daysRemaining <= 7;
  });

  // Toast para VIPs expirando hoje
  useEffect(() => {
    if (expiringToday.length > 0) {
      toast({
        title: "⚠️ VIPs Expirando Hoje!",
        description: `${expiringToday.length} VIP${expiringToday.length > 1 ? 's' : ''} expira${expiringToday.length === 1 ? '' : 'm'} hoje. Verifique a lista para renovar.`,
        variant: "destructive"
      });
    }
  }, [expiringToday.length, toast]);

  if (expiringToday.length === 0 && expiringSoon.length === 0 && expiringThisWeek.length === 0) {
    return <Card className="bg-card/50 backdrop-blur-sm border-border h-[400px]">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <div className="text-center">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
          </div>
        </CardContent>
      </Card>;
  }

  return <Card className="bg-card/50 backdrop-blur-sm border-warning/50 h-[400px] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="w-4 h-4 text-warning" />
          Centro de Notificações
          {expiringSoon.length + expiringThisWeek.length + expiringToday.length > 0 && <Badge variant="secondary" className="bg-warning/20 text-warning text-xs">
              {expiringSoon.length + expiringThisWeek.length + expiringToday.length}
            </Badge>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 min-h-0 flex flex-col">
        {/* Alerta crítico para VIPs expirando hoje - integrado no card */}
        {expiringToday.length > 0 && <Alert className="border-danger bg-danger/5 py-3 flex-shrink-0 mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-danger flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-danger">
                  {expiringToday.length} VIP{expiringToday.length > 1 ? 's' : ''} expira{expiringToday.length === 1 ? '' : 'm'} hoje!
                </span>
              </div>
              <Badge variant="destructive" className="text-xs flex-shrink-0">{expiringToday.length}</Badge>
            </div>
          </Alert>}

        {/* Lista de notificações com scroll */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-3">
              {/* VIPs expirando hoje */}
              {expiringToday.length > 0 && <div className="space-y-2">
                  <h4 className="font-medium text-danger flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3" />
                    Hoje ({expiringToday.length})
                  </h4>
                  <div className="space-y-1">
                    {expiringToday.map(vip => <div key={vip.id} className="flex items-center justify-between p-2 rounded bg-danger/5 border border-danger/20 text-xs">
                        <span className="font-medium truncate">{vip.playerName}</span>
                        <span className="text-danger ml-2">Hoje</span>
                      </div>)}
                  </div>
                </div>}

              {/* VIPs expirando em 1-3 dias */}
              {expiringSoon.length > 0 && <div className="space-y-2">
                  <h4 className="font-medium text-warning flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3" />
                    Próximos 3 Dias ({expiringSoon.length})
                  </h4>
                  <div className="space-y-1">
                    {expiringSoon.map(vip => {
                  const daysRemaining = calculateDaysRemaining(vip.endDate);
                  return <div key={vip.id} className="flex items-center justify-between p-2 rounded bg-warning/5 border border-warning/20 text-xs">
                          <span className="font-medium truncate">{vip.playerName}</span>
                          <span className="text-warning ml-2">{daysRemaining}d</span>
                        </div>;
                })}
                  </div>
                </div>}

              {/* VIPs expirando em 4-7 dias */}
              {expiringThisWeek.length > 0 && <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3" />
                    Esta Semana ({expiringThisWeek.length})
                  </h4>
                  <div className="space-y-1">
                    {expiringThisWeek.map(vip => {
                  const daysRemaining = calculateDaysRemaining(vip.endDate);
                  return <div key={vip.id} className="flex items-center justify-between p-2 rounded bg-muted/20 border border-muted text-xs">
                          <span className="truncate">{vip.playerName}</span>
                          <span className="text-muted-foreground ml-2">{daysRemaining}d</span>
                        </div>;
                })}
                  </div>
                </div>}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>;
};

export default NotificationSystem;
