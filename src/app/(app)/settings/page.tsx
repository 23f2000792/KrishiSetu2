'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/language-context';

export default function SettingsPage() {
    const { toast } = useToast();
    const { t } = useLanguage();

    const handleReset = () => {
        toast({
            title: t('settings.resetToastTitle'),
            description: t('settings.resetToastDesc'),
        });
    }

  return (
    <div className="pb-16 md:pb-0">
      <PageHeader
        title={t('settings.title')}
        description={t('settings.description')}
      />
      <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>{t('settings.pwaSettings')}</CardTitle>
                <CardDescription>{t('settings.pwaDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <div className='flex items-center gap-2'>
                        <Wifi />
                        <Label htmlFor="offline-mode">{t('settings.offline')}</Label>
                    </div>
                    <Switch id="offline-mode" />
                </div>
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <div className='flex items-center gap-2'>
                        <RefreshCw />
                        <Label htmlFor="data-sync">{t('settings.dataSync')}</Label>
                    </div>
                    <Switch id="data-sync" defaultChecked/>
                </div>
            </CardContent>
        </Card>
        
        <Separator className="my-8" />

        <Card>
            <CardHeader>
                <CardTitle>{t('settings.demoSettings')}</CardTitle>
                <CardDescription>{t('settings.demoDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg border-destructive/50">
                    <div>
                        <Label htmlFor="reset-data" className='text-destructive'>{t('settings.resetDemo')}</Label>
                        <p className="text-sm text-muted-foreground">{t('settings.resetDemoDesc')}</p>
                    </div>
                    <Button variant="destructive" onClick={handleReset}>{t('settings.reset')}</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
