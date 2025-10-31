import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, ScanLine, ShoppingBasket, ArrowRight } from "lucide-react";
import Link from "next/link";

const actions = [
    {
        icon: ScanLine,
        title: "Scan a Crop",
        description: "Diagnose crop issues instantly.",
        href: "/scanner",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
    {
        icon: Bot,
        title: "Ask AI Copilot",
        description: "Get expert advice anytime.",
        href: "/chat",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        icon: ShoppingBasket,
        title: "Check Mandi Prices",
        description: "View latest market rates.",
        href: "/market",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
    }
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump right into what you need.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <Link href={action.href} key={action.title} className="block group">
                <div className="p-4 border rounded-lg flex items-center gap-4 hover:bg-secondary transition-colors group-hover:border-primary">
                    <div className={`p-3 rounded-full ${action.bgColor} transition-colors group-hover:bg-primary/20`}>
                        <action.icon className={`h-6 w-6 ${action.color} transition-colors group-hover:text-primary`} />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
