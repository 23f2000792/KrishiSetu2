'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Github, Languages, Tractor, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';


const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const { login, handleDemoLogin } = useAuth();
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    login(values.email, values.password);
  }

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">{t('login.welcome')}</CardTitle>
        <CardDescription>
          {t('login.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('login.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('login.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>{t('login.passwordLabel')}</FormLabel>
                    <Link href="#" className="text-sm text-primary hover:underline">
                        {t('login.forgotPassword')}
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder={t('login.passwordPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}
            <Button type="submit" className="w-full">
              {t('login.loginButton')}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t('login.orContinueWith')}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" onClick={() => handleDemoLogin('Admin')}>
                <ShieldCheck className="mr-2" /> {t('login.adminDemo')}
            </Button>
        </div>
        <Separator />
        <div className="flex justify-center items-center text-sm text-muted-foreground">
            <Languages className="mr-2 h-4 w-4" />
            <span>{t('header.english')}</span>
            <Separator orientation="vertical" className="h-4 mx-2" />
            <span>{t('header.hindi')}</span>
            <Separator orientation="vertical" className="h-4 mx-2" />
            <span>{t('header.punjabi')}</span>
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground justify-center">
          {t('login.noAccount')}&nbsp;
          <Link href="/auth/signup" className="text-primary hover:underline">
            {t('login.signUp')}
          </Link>
      </CardFooter>
    </>
  );
}
