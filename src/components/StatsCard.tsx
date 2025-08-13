
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

  const chipBgClasses = {
    default: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    danger: 'bg-danger/10',
    info: 'bg-info/10',
  } as const;

  return (
    <Card className={`card-elevated relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} h-full`}>
      <CardContent className="p-5 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            {trend && trend.value !== 0 && (
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
                  {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground">vs mês anterior</span>
              </div>
            )}
          </div>
          <div className={`${chipBgClasses[color]} ${iconColorClasses[color]} p-2.5 rounded-full`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
