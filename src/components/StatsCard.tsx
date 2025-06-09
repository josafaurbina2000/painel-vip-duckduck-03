
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const StatsCard = ({ title, value, icon: Icon, description, trend, color = 'default' }: StatsCardProps) => {
  const colorClasses = {
    default: 'from-primary/20 to-primary/5 border-primary/20',
    success: 'from-success/20 to-success/5 border-success/20',
    warning: 'from-warning/20 to-warning/5 border-warning/20',
    danger: 'from-danger/20 to-danger/5 border-danger/20',
    info: 'from-info/20 to-info/5 border-info/20'
  };

  const iconColorClasses = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    info: 'text-info'
  };

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {value}
            </p>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">vs mês anterior</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-background/50 ${iconColorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
