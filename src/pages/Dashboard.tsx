
import { Users, DollarSign, Clock, Crown } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVIP } from "@/contexts/VIPContext";
import { calculateStats, calculateDaysRemaining, formatCurrency, formatDate } from "@/utils/vipUtils";
import VIPBadge from "@/components/VIPBadge";

const Dashboard = () => {
  const { vips } = useVIP();
  const stats = calculateStats(vips);

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
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="VIPs Ativos"
          value={stats.totalActive}
          icon={Users}
          description="Jogadores com VIP ativo"
          color="success"
        />
        <StatsCard
          title="VIPs Expirados"
          value={stats.totalExpired}
          icon={Clock}
          description="VIPs que expiraram"
          color="danger"
        />
        <StatsCard
          title="VIPs Permanentes"
          value={stats.totalPermanent}
          icon={Crown}
          description="VIPs sem vencimento"
          color="info"
        />
        <StatsCard
          title="Receita Total"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          description="De VIPs ativos e permanentes"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VIPs expirando em breve */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
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
                      {formatDate(vip.createdAt)}
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
    </div>
  );
};

export default Dashboard;
