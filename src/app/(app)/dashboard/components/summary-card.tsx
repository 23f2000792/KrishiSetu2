import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

type SummaryCardProps = {
    title: string;
    value: string;
    icon: LucideIcon;
    details: string;
    trend?: 'up' | 'down';
    animationDelay?: number;
};

export default function SummaryCard({ title, value, icon: Icon, details, trend, animationDelay = 0 }: SummaryCardProps) {
  return (
    <Card 
      className="transform-gpu transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center">
          {details}
          {trend && (
            trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500 ml-1" />
            )
          )}
        </p>
      </CardContent>
    </Card>
  )
}
