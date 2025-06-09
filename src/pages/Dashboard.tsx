
import { Users, DollarSign, Clock, Calendar } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVIP } from "@/contexts/VIPContext";
import { calculateStats, calculateDaysRemaining, formatCurrency, formatDate } from "@/utils/vipUtils";
import VIPBadge from "@/components/VIPBadge";
import NotificationSystem from "@/components/NotificationSystem";

const Dashboard = () => {
  const { vips } = useVIP();
  const stats = calculateStats(vips);

  const expiringSoonVips = vips.filter(vip => {
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining > 0 && daysRemaining <= 7;
  });

  const recentVips = vips
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  // VIPs ativos
  const activeVips = vips.filter(vip => vip.status === 'active');

  // VIPs expirando em 7 dias
  const expiring7Days = vips.filter(vip => {
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining === 7;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cards principais no topo - Receita Total e Total de VIPs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                <p className="text-3xl font-bold text-success">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  De todos os VIPs ativos
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de VIPs</p>
                <p className="text-3xl font-bold text-primary">{stats.totalActive + stats.totalExpired}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalActive} ativos • {stats.totalExpired} expirados
                </p>
              </div>
              <Users className="w-10 h-10 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha - Cards customizados e Centro de Notificações */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[400px]">
        {/* Cards customizados ocupando 2 colunas */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          
          {/* Card VIPs Ativos com lista de nomes */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-success/20 to-success/5 border-success/20 border transition-all duration-300 hover:scale-105 hover:shadow-lg h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    VIPs Ativos
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-success">
                    {stats.totalActive}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-background/50 text-success">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="space-y-1">
                    {activeVips.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhum VIP ativo</p>
                    ) : (
                      activeVips.map((vip) => (
                        <div
                          key={vip.id}
                          className="p-2 rounded bg-background/30 border border-success/10"
                        >
                          <p className="text-xs font-medium truncate">{vip.playerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {calculateDaysRemaining(vip.endDate)} dias restantes
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Card Expirando em 7 dias com lista de nomes */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-danger/20 to-danger/5 border-danger/20 border transition-all duration-300 hover:scale-105 hover:shadow-lg h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Expirando em 7 dias
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-danger">
                    {expiring7Days.length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-background/50 text-danger">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="space-y-1">
                    {expiring7Days.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhum VIP expirando em 7 dias</p>
                    ) : (
                      expiring7Days.map((vip) => (
                        <div
                          key={vip.id}
                          className="p-2 rounded bg-background/30 border border-danger/10"
                        >
                          <p className="text-xs font-medium truncate">{vip.playerName}</p>
                          <p className="text-xs text-muted-foreground">
                            Expira em {formatDate(vip.endDate)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Centro de Notificações ocupando 2 colunas */}
        <div className="lg:col-span-2 h-full">
          <NotificationSystem vips={vips} />
        </div>
      </div>

      {/* Grid principal com VIPs expirando e VIPs recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VIPs expirando em breve */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-warning" />
              VIPs Expirando em Breve
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringSoonVips.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nenhum VIP expirando nos próximos 7 dias
              </p>
            ) : (
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {expiringSoonVips.map((vip) => {
                    const daysRemaining = calculateDaysRemaining(vip.endDate);
                    return (
                      <div
                        key={vip.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{vip.playerName}</p>
                          <p className="text-sm text-muted-foreground">
                            {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-xs font-medium text-warning">
                            {formatDate(vip.endDate)}
                          </p>
                          <VIPBadge status={vip.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* VIPs recentes - expandido */}
        <Card className="bg-card/50 backdrop-blur-sm border-border lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-primary" />
              VIPs Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recentVips.map((vip) => (
                  <div
                    key={vip.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{vip.playerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(vip.createdAt)} • {vip.durationDays} dias
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                      <span className="text-sm font-medium">
                        {formatCurrency(vip.amountPaid)}
                      </span>
                      <VIPBadge status={vip.status} />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
