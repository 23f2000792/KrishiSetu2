
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/language-context';
import { Separator } from '@/components/ui/separator';
import { CROP_OPTIONS } from '../components/onboarding-form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email(),
  phone: z.string().min(10, "Invalid phone number"),
  region: z.string(),
  farmSize: z.coerce.number().min(0, 'Farm size must be positive.'),
  crop1: z.string().optional(),
  crop2: z.string().optional(),
  crop3: z.string().optional(),
  crop4: z.string().optional(),
  crop5: z.string().optional(),
  prefs: z.object({
    push: z.boolean(),
    voice: z.boolean(),
  }),
}).refine(data => {
    return !!data.crop1 || !!data.crop2 || !!data.crop3 || !!data.crop4 || !!data.crop5;
}, {
    message: 'Please select at least one crop.',
    path: ['crop1'],
});

export default function ProfilePage() {
  const { user, logout, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      region: user?.region || '',
      farmSize: user?.farmSize || 0,
      crop1: user?.crops?.[0] || '',
      crop2: user?.crops?.[1] || '',
      crop3: user?.crops?.[2] || '',
      crop4: user?.crops?.[3] || '',
      crop5: user?.crops?.[4] || '',
      prefs: {
        push: user?.prefs.push || false,
        voice: user?.prefs.voice || false,
      }
    },
  });

  if (!user) {
    return null; // or a loading state
  }
  
  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    if (!user) return;
    const crops = [values.crop1, values.crop2, values.crop3, values.crop4, values.crop5].filter(Boolean) as string[];
    const updateData = { ...values, crops };
    
    // remove individual crop fields
    delete (updateData as any).crop1;
    delete (updateData as any).crop2;
    delete (updateData as any).crop3;
    delete (updateData as any).crop4;
    delete (updateData as any).crop5;

    updateUserProfile(user.id, updateData);
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}` : name.substring(0, 2);
  };


  return (
    <div className="pb-16 md:pb-0 animate-fade-in">
      <PageHeader
        title={t('profile.title')}
        description={t('profile.description')}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
                <div className='flex flex-col sm:flex-row items-center gap-6'>
                    <div className="relative">
                        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                            <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='text-center sm:text-left'>
                        <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
                        <CardDescription className="text-lg text-primary">{user.role}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">{t('profile.personalInfo')}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField name="name" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profile.fullName')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="email" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profile.email')}</FormLabel>
                        <FormControl><Input {...field} disabled /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="phone" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profile.phone')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField name="region" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('profile.region')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <Separator />
                
                <div>
                    <h3 className="text-lg font-medium mb-4">Farm Details</h3>
                    <div className="space-y-6">
                         <FormField name="farmSize" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Farm Size (in acres)</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div>
                            <FormLabel>Your Crops</FormLabel>
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <FormField
                                        key={i}
                                        control={form.control}
                                        name={`crop${i}` as 'crop1' | 'crop2' | 'crop3' | 'crop4' | 'crop5'}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-muted-foreground">Crop {i}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select crop" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {CROP_OPTIONS.map(option => (
                                                            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h3 className="text-lg font-medium mb-4">{t('profile.preferences')}</h3>
                    <div className="space-y-4">
                        <FormField name="prefs.push" control={form.control} render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-secondary/50 transition-colors">
                                <div className="space-y-0.5">
                                    <FormLabel>{t('profile.pushNotifications')}</FormLabel>
                                    <FormMessage />
                                </div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )} />
                        <FormField name="prefs.voice" control={form.control} render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 hover:bg-secondary/50 transition-colors">
                                <div className="space-y-0.5">
                                    <FormLabel>{t('profile.voiceIO')}</FormLabel>
                                    <FormMessage />
                                </div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )} />
                    </div>
                </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
            <Button variant="destructive" onClick={logout}>{t('profile.logout')}</Button>
            <Button type="submit">{t('profile.saveChanges')}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
