import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type SummaryCardProps = {
    title: string;
    value: string;
    icon: LucideIcon;
    details: string;
    trend?: 'up' | 'down';
    change?: string;
    animationDelay?: number;
};

function SummaryCard({ title, value, icon: Icon, details, trend, change, animationDelay = 0 }: SummaryCardProps) {
  return (
    <Card 
      className="transform-gpu transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground flex items-center truncate">
            <span className="truncate">{details}</span>
            {trend && change && (
                <span className={cn("flex items-center ml-2 font-semibold", trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                    {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                    {change}
                </span>
            )}
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryCardSkeleton({ animationDelay = 0 }: { animationDelay?: number }) {
  return (
    <Card 
      className="animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-5" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-3 w-full" />
      </CardContent>
    </Card>
  )
}

SummaryCard.Skeleton = SummaryCardSkeleton;
export default SummaryCard;
