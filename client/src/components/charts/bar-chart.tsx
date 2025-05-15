import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface BarChartProps {
  title: string;
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
}

export function BarChart({
  title,
  data,
  dataKey,
  xAxisKey = "name",
  color = "var(--color-primary)",
  height = 300,
  showGrid = false,
}: BarChartProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="rgba(255, 255, 255, 0.1)" 
                />
              )}
              <XAxis 
                dataKey={xAxisKey} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
              />
              <YAxis 
                hide={!showGrid}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(71, 85, 105, 0.5)',
                  borderRadius: '0.375rem',
                  color: 'white',
                  fontSize: '0.875rem',
                }}
              />
              <Bar 
                dataKey={dataKey} 
                fill={color}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
