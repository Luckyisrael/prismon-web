import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

type IconType = React.ReactNode;

interface AppStatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  iconBgColor: string;
  iconColor: string;
  change?: {
    value: string | number;
    isPositive: boolean;
    label: string;
  };
}

export function AppStatCard({ 
  title, 
  value, 
  icon, 
  iconBgColor, 
  iconColor,
  change 
}: AppStatCardProps) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-slate-400 text-sm font-semibold">{title}</h2>
          <div className={cn("p-2 rounded-md", iconBgColor)}>
            <div className={cn("h-5 w-5", iconColor)}>{icon}</div>
          </div>
        </div>
        <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        
        {change && (
          <p className="text-xs text-slate-400 mt-1">
            <span className={change.isPositive ? "text-secondary" : "text-red-500"}>
              {change.isPositive ? <ArrowUpIcon className="inline-block h-3 w-3" /> : <ArrowDownIcon className="inline-block h-3 w-3" />}
              {' '}{change.value}
            </span>
            <span className="ml-1">{change.label}</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
