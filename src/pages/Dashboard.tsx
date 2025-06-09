
import { Users, DollarSign, Clock, Crown, Calendar } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVIP } from "@/contexts/VIPContext";
import { calculateStats, calculateDaysRemaining, formatCurrency, formatDate, getMonthlyRevenueData } from "@/utils/vipUtils";
import VIPBadge from "@/components/VIPBadge";
import MonthlyRevenueChart from "@/components/MonthlyRevenueChart";
import VIPTypeChart from "@/components/VIPTypeChart";
import NotificationSystem from "@/components/NotificationSystem";

const Dashboard = () => {
  const { vips } = useVIP();
  const stats = calculateStats(vips);
  const monthlyRevenueData = getMonthlyRevenueData(vips);

  const expiringSoonVips = vips.filter(vip => {
    if (vip.isPermanent) return false;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="VIPs Temporários"
          value={stats.totalTemporary}
          icon={Users}
          description="VIPs temporários ativos"
          color="success"
          trend={{
            value: stats.monthlyTrend,
            isPositive: stats.monthlyTrend >= 0
          }}
        />
        <StatsCard
          title="VIPs Permanentes"
          value={stats.totalPermanent}
          icon={Crown}
          description="VIPs sem vencimento"
          color="info"
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
          description="VIPs temporários vencendo"
          color="danger"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyRevenueChart 
          data={monthlyRevenueData} 
          trend={stats.monthlyTrend}
        />
        <VIPTypeChart 
          permanentCount={stats.totalPermanent}
          temporaryCount={stats.totalTemporary}
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
                Nenhum VIP temporário expirando nos próximos 7 dias
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
                      {formatDate(vip.createdAt)} • {vip.isPermanent ? 'Permanente' : 'Temporário'}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita VIPs Temporários</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(stats.temporaryRevenue)}</p>
              </div>
              <Users className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/20 to-info/5 border-info/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita VIPs Permanentes</p>
                <p className="text-2xl font-bold text-info">{formatCurrency(stats.permanentRevenue)}</p>
              </div>
              <Crown className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalActive} VIPs ativos
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
