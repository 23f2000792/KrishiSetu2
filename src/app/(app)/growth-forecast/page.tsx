'use client';

import { PageHeader } from "@/components/page-header";
import { GrowthTimeline } from "../dashboard/components/growth-timeline";
import { useLanguage } from "@/contexts/language-context";

export default function GrowthForecastPage() {
    const { t } = useLanguage();

    return (
        <div className="pb-16 md:pb-0 animate-fade-in">
            <PageHeader
                title={t('growthForecast.title')}
                description={t('growthForecast.description')}
            />
            <div className="max-w-4xl mx-auto">
                <GrowthTimeline />
            </div>
        </div>
    );
}
