'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, ScanLine, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from '@/contexts/language-context';

export function QuickActions() {
    const { t } = useLanguage();

    const actions = [
        {
            icon: ScanLine,
            title: t('dashboard.scanCrop'),
            description: t('dashboard.scanCropDesc'),
            href: "/scanner",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            icon: Leaf,
            title: t('dashboard.analyzeSoil'),
            description: t('dashboard.analyzeSoilDesc'),
            href: "/soil-analyzer",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            icon: Bot,
            title: t('dashboard.askKrishiAi'),
            description: t('dashboard.askKrishiAiDesc'),
            href: "/chat",
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
    ];

    return (
        <Card className="h-full">
        <CardHeader>
            <CardTitle>{t('dashboard.quickActionsTitle')}</CardTitle>
            <CardDescription>{t('dashboard.quickActionsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {actions.map((action) => (
                <Link href={action.href} key={action.title} className="block group">
                    <div className="p-4 border rounded-lg flex items-center gap-4 hover:bg-secondary transition-colors duration-200 group-hover:border-primary/50 group-hover:shadow-sm">
                        <div className={`p-3 rounded-full ${action.bgColor} transition-transform group-hover:scale-105`}>
                            <action.icon className={`h-6 w-6 ${action.color}`} />
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
