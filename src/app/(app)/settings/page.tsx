'use client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Wifi, WifiOff } from 'lucide-radix';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    const { toast } = useToast();

    const handleReset = () => {
        toast({
            title: "Demo Data Reset",
            description: "The application data has been reset to its initial state.",
        });
    }

  return (
    <div className="pb-16 md:pb-0">
      <PageHeader
        title="Settings"
        description="Manage your application preferences and data."
      />
      <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>PWA Settings</CardTitle>
                <CardDescription>Configure offline and data synchronization behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <div className='flex items-center gap-2'>
                        <Wifi />
                        <Label htmlFor="offline-mode">Offline Functionality</Label>
                    </div>
                    <Switch id="offline-mode" />
                </div>
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                    <div className='flex items-center gap-2'>
                        <RefreshCw />
                        <Label htmlFor="data-sync">Automatic Data Sync</Label>
                    </div>
                    <Switch id="data-sync" defaultChecked/>
                </div>
            </CardContent>
        </Card>
        
        <Separator className="my-8" />

        <Card>
            <CardHeader>
                <CardTitle>Demo Settings</CardTitle>
                <CardDescription>Manage data for this demonstration app.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg border-destructive/50">
                    <div>
                        <Label htmlFor="reset-data" className='text-destructive'>Reset Demo Data</Label>
                        <p className="text-sm text-muted-foreground">This will restore all data to the original demo state.</p>
                    </div>
                    <Button variant="destructive" onClick={handleReset}>Reset</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
