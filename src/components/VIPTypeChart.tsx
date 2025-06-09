
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Users } from "lucide-react";

interface VIPTypeChartProps {
  permanentCount: number;
  temporaryCount: number;
}

const VIPTypeChart = ({ permanentCount, temporaryCount }: VIPTypeChartProps) => {
  const data = [
    { name: 'VIPs Permanentes', value: permanentCount, color: 'hsl(var(--info))' },
    { name: 'VIPs Temporários', value: temporaryCount, color: 'hsl(var(--success))' }
  ];

  const total = permanentCount + temporaryCount;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Distribuição de VIPs Ativos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-info"></div>
              <span className="text-sm text-muted-foreground">Permanentes</span>
            </div>
            <p className="text-2xl font-bold">{permanentCount}</p>
            <p className="text-xs text-muted-foreground">
              {total > 0 ? ((permanentCount / total) * 100).toFixed(1) : 0}% do total
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-sm text-muted-foreground">Temporários</span>
            </div>
            <p className="text-2xl font-bold">{temporaryCount}</p>
            <p className="text-xs text-muted-foreground">
              {total > 0 ? ((temporaryCount / total) * 100).toFixed(1) : 0}% do total
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VIPTypeChart;
