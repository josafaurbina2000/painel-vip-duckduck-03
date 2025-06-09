
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, AlertTriangle } from "lucide-react";
import { VIP } from "@/types/vip";
import { calculateDaysRemaining, formatDate } from "@/utils/vipUtils";
import { useToast } from "@/hooks/use-toast";

interface NotificationSystemProps {
  vips: VIP[];
}

const NotificationSystem = ({ vips }: NotificationSystemProps) => {
  const { toast } = useToast();

  // VIPs expirando hoje
  const expiringToday = vips.filter(vip => {
    if (vip.isPermanent) return false;
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining === 0;
  });

  // VIPs expirando em 1-3 dias
  const expiringSoon = vips.filter(vip => {
    if (vip.isPermanent) return false;
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining > 0 && daysRemaining <= 3;
  });

  // VIPs expirando em 4-7 dias
  const expiringThisWeek = vips.filter(vip => {
    if (vip.isPermanent) return false;
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining > 3 && daysRemaining <= 7;
  });

  // Toast para VIPs expirando hoje
  useEffect(() => {
    if (expiringToday.length > 0) {
      toast({
        title: "⚠️ VIPs Expirando Hoje!",
        description: `${expiringToday.length} VIP${expiringToday.length > 1 ? 's' : ''} expira${expiringToday.length === 1 ? '' : 'm'} hoje. Verifique a lista para renovar.`,
        variant: "destructive",
      });
    }
  }, [expiringToday.length, toast]);

  if (expiringToday.length === 0 && expiringSoon.length === 0 && expiringThisWeek.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Alerta crítico para VIPs expirando hoje */}
      {expiringToday.length > 0 && (
        <Alert className="border-danger bg-danger/5">
          <AlertTriangle className="h-4 w-4 text-danger" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              <strong className="text-danger">{expiringToday.length} VIP{expiringToday.length > 1 ? 's' : ''} expira{expiringToday.length === 1 ? '' : 'm'} hoje!</strong>
              {' '}Ação imediata necessária.
            </span>
            <Badge variant="destructive">{expiringToday.length}</Badge>
          </AlertDescription>
        </Alert>
      )}

      {/* Card de notificações detalhadas */}
      <Card className="bg-card/50 backdrop-blur-sm border-warning/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-warning" />
            Centro de Notificações
            {(expiringSoon.length + expiringThisWeek.length + expiringToday.length) > 0 && (
              <Badge variant="secondary" className="bg-warning/20 text-warning">
                {expiringSoon.length + expiringThisWeek.length + expiringToday.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* VIPs expirando hoje */}
          {expiringToday.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-danger flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Expirando Hoje ({expiringToday.length})
              </h4>
              {expiringToday.map(vip => (
                <div key={vip.id} className="flex items-center justify-between p-2 rounded bg-danger/5 border border-danger/20">
                  <span className="font-medium">{vip.playerName}</span>
                  <span className="text-xs text-danger">Hoje</span>
                </div>
              ))}
            </div>
          )}

          {/* VIPs expirando em 1-3 dias */}
          {expiringSoon.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-warning flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Próximos 3 Dias ({expiringSoon.length})
              </h4>
              {expiringSoon.map(vip => {
                const daysRemaining = calculateDaysRemaining(vip.endDate);
                return (
                  <div key={vip.id} className="flex items-center justify-between p-2 rounded bg-warning/5 border border-warning/20">
                    <span className="font-medium">{vip.playerName}</span>
                    <span className="text-xs text-warning">
                      {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIPs expirando em 4-7 dias */}
          {expiringThisWeek.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Esta Semana ({expiringThisWeek.length})
              </h4>
              {expiringThisWeek.map(vip => {
                const daysRemaining = calculateDaysRemaining(vip.endDate);
                return (
                  <div key={vip.id} className="flex items-center justify-between p-2 rounded bg-muted/20 border border-muted">
                    <span>{vip.playerName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(vip.endDate)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem;
