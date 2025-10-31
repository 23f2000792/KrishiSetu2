
'use client';
import { useState, useMemo } from 'react';
import { PageHeader } from "@/components/page-header";
import { GrowthTimeline } from "../dashboard/components/growth-timeline";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from '@/contexts/auth-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from '@/components/ui/skeleton';

export default function GrowthForecastPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    
    const primaryCrop = useMemo(() => user?.crops?.[0] || '', [user?.crops]);
    const [selectedCrop, setSelectedCrop] = useState<string>(primaryCrop);

    return (
        <div className="pb-16 md:pb-0 animate-fade-in">
            <PageHeader
                title={t('growthForecast.title')}
                description={t('growthForecast.description')}
            >
                {user?.crops && user.crops.length > 0 ? (
                    <Select onValueChange={setSelectedCrop} defaultValue={selectedCrop}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a crop" />
                        </SelectTrigger>
                        <SelectContent>
                            {user.crops.map(crop => (
                                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Skeleton className='h-10 w-[180px]' />
                )}
            </PageHeader>
            <div className="max-w-4xl mx-auto">
                {selectedCrop ? <GrowthTimeline crop={selectedCrop} /> : <p>Please select a crop to see the forecast.</p>}
            </div>
        </div>
    );
}
