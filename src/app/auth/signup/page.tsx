'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
import { Github, Tractor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
        title: "Account Created (Demo)",
        description: "In a real app, you would be logged in. Redirecting to login.",
    });
    router.push('/auth/login');
  }

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">{t('signup.createAccount')}</CardTitle>
        <CardDescription>
          {t('signup.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('signup.nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('signup.namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('signup.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('signup.emailPlaceholder')} {...field} />
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
                  <FormLabel>{t('signup.passwordLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t('signup.passwordPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {t('signup.signupButton')}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {t('signup.orSignUpWith')}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
                <Tractor className="mr-2" /> {t('signup.google')}
            </Button>
            <Button variant="outline">
                <Github className="mr-2" /> {t('signup.github')}
            </Button>
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground justify-center">
          {t('signup.hasAccount')}&nbsp;
          <Link href="/auth/login" className="text-primary hover:underline">
            {t('signup.login')}
          </Link>
      </CardFooter>
    </>
  );
}
