
import { Users, DollarSign, Clock, Calendar, Trash2 } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useVIP } from "@/contexts/VIPContext";
import { calculateStats, calculateDaysRemaining, formatCurrency, formatDate } from "@/utils/vipUtils";
import VIPBadge from "@/components/VIPBadge";
import NotificationSystem from "@/components/NotificationSystem";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import MonthlyRevenueChart from "@/components/MonthlyRevenueChart";

const Dashboard = () => {
  const { vips, clearAllData } = useVIP();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const stats = calculateStats(vips);
  const expiringSoonVips = vips.filter(vip => {
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining > 0 && daysRemaining <= 7;
  });
  const recentVips = vips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  // VIPs ativos
  const activeVips = vips.filter(vip => vip.status === 'active');

  // VIPs expirando em 7 dias
  const expiring7Days = vips.filter(vip => {
    const daysRemaining = calculateDaysRemaining(vip.endDate);
    return daysRemaining === 7;
  });
  // Dados de receita dos últimos 6 meses
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const ref = new Date();
    // do mais antigo para o mais recente
    ref.setMonth(ref.getMonth() - (5 - i));
    const monthLabel = ref.toLocaleString('pt-BR', { month: 'short' });
    const revenue = vips
      .filter(v => {
        const d = new Date(v.createdAt);
        return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
      })
      .reduce((sum, v) => sum + v.amountPaid, 0);
    return { month: monthLabel, revenue };
  });

  const handleClearAllData = () => {
    clearAllData();
    toast({
      title: "Dados limpos com sucesso",
      description: "Todos os dados foram removidos. Sistema pronto para Supabase.",
    });
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Botão de limpeza no topo */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={handleClearAllData}
          variant="destructive"
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4" />
          {isMobile ? "Limpar Dados" : "Limpar Todos os Dados"}
        </Button>
      </div>

      {/* Cards principais no topo - Receita Total e Total de VIPs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatsCard
          title="Receita Total"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          description="De VIPs ativos"
          color="success"
        />
        <StatsCard
          title="Total de VIPs"
          value={stats.totalActive + stats.totalExpired}
          icon={Users}
          description={`${stats.totalActive} ativos • ${stats.totalExpired} expirados`}
        />
        <StatsCard
          title="Ativos"
          value={stats.totalActive}
          icon={Users}
          description="VIPs atualmente ativos"
          color="info"
        />
        <StatsCard
          title="Expirando (7d)"
          value={expiringSoonVips.length}
          icon={Clock}
          description="Nos próximos 7 dias"
          color="warning"
        />
      </div>

      {/* Segunda linha - Cards customizados e Centro de Notificações */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Cards customizados ocupando 2 colunas */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card VIPs Ativos com lista de nomes */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-success/20 to-success/5 border-success/20 border transition-all duration-300 hover:scale-105 hover:shadow-lg h-64 md:h-80">
            <CardContent className="p-3 md:p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    VIPs Ativos
                  </p>
                  <p className="text-xl md:text-2xl font-bold tracking-tight text-success">
                    {stats.totalActive}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-background/50 text-success">
                  <Users className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full pr-2">
                  <div className="space-y-2">
                    {activeVips.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhum VIP ativo</p>
                    ) : (
                      activeVips.map(vip => (
                        <div key={vip.id} className="p-2 rounded bg-background/30 border border-success/10">
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
          <Card className="relative overflow-hidden bg-gradient-to-br from-danger/20 to-danger/5 border-danger/20 border transition-all duration-300 hover:scale-105 hover:shadow-lg h-64 md:h-80">
            <CardContent className="p-3 md:p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Expirando em 7 dias
                  </p>
                  <p className="text-xl md:text-2xl font-bold tracking-tight text-danger">
                    {expiring7Days.length}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-background/50 text-danger">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
              
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full pr-2">
                  <div className="space-y-2">
                    {expiring7Days.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhum VIP expirando em 7 dias</p>
                    ) : (
                      expiring7Days.map(vip => (
                        <div key={vip.id} className="p-2 rounded bg-background/30 border border-danger/10">
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
        <div className="lg:col-span-2">
          <NotificationSystem vips={vips} />
        </div>
      </div>

      <MonthlyRevenueChart data={monthlyData} trend={stats.monthlyTrend} />

      {/* Grid principal com VIPs expirando e VIPs recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* VIPs expirando em breve */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-warning" />
              VIPs Expirando em Breve
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expiringSoonVips.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nenhum VIP expirando nos próximos 7 dias
              </p>
            ) : (
              <ScrollArea className="h-60 md:h-80">
                <div className="space-y-3">
                  {expiringSoonVips.map(vip => {
                    const daysRemaining = calculateDaysRemaining(vip.endDate);
                    return (
                      <div key={vip.id} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate text-sm">{vip.playerName}</p>
                          <p className="text-xs text-muted-foreground">
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
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              VIPs Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60 md:h-80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recentVips.map(vip => (
                  <div key={vip.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-sm">{vip.playerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(vip.createdAt)} • {vip.durationDays} dias
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                      <span className="text-xs md:text-sm font-medium">
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
