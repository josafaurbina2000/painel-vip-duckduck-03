
import { Users, DollarSign, Clock, Calendar } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sistema de Notificações */}
      <NotificationSystem vips={vips} />

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="VIPs Ativos"
          value={stats.totalActive}
          icon={Users}
          description="VIPs temporários ativos"
          color="success"
          trend={{
            value: stats.monthlyTrend,
            isPositive: stats.monthlyTrend >= 0
          }}
        />
        <StatsCard
          title="Receita Mensal"
          value={formatCurrency(stats.monthlyRevenue)}
          icon={DollarSign}
          description="Receita do mês atual"
          color="warning"
          trend={{
            value: stats.monthlyTrend,
            isPositive: stats.monthlyTrend >= 0
          }}
        />
        <StatsCard
          title="Expirando em 7 dias"
          value={stats.expiringInDays}
          icon={Clock}
          description="VIPs vencendo em breve"
          color="danger"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VIPs expirando em breve */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
              <div className="space-y-3">
                {expiringSoonVips.map((vip) => {
                  const daysRemaining = calculateDaysRemaining(vip.endDate);
                  return (
                    <div
                      key={vip.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20"
                    >
                      <div>
                        <p className="font-medium">{vip.playerName}</p>
                        <p className="text-sm text-muted-foreground">
                          Expira em {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-warning">
                          {formatDate(vip.endDate)}
                        </p>
                        <VIPBadge status={vip.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* VIPs recentes */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              VIPs Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentVips.map((vip) => (
                <div
                  key={vip.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{vip.playerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(vip.createdAt)} • {vip.durationDays} dias
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatCurrency(vip.amountPaid)}
                    </span>
                    <VIPBadge status={vip.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  De todos os VIPs ativos
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de VIPs</p>
                <p className="text-2xl font-bold text-primary">{stats.totalActive + stats.totalExpired}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalActive} ativos • {stats.totalExpired} expirados
                </p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
