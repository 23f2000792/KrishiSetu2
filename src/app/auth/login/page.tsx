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
import { Github, Languages, Tractor } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { demoCredentials } from '@/lib/data';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const { login } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you'd call an auth service here.
    // For the demo, we'll try to match against demo credentials.
    if (values.email === demoCredentials.farmer.email) {
      login(demoCredentials.farmer.email, 'Farmer');
    } else if (values.email === demoCredentials.admin.email) {
      login(demoCredentials.admin.email, 'Admin');
    } else {
      form.setError("root", { message: "Invalid credentials for demo." });
    }
  }

  const handleDemoLogin = (role: 'Farmer' | 'Admin') => {
    const creds = role === 'Farmer' ? demoCredentials.farmer : demoCredentials.admin;
    login(creds.email, role);
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Login to your KrishiSetu account to continue.
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="farmer@krish-demo.test" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <Link href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleDemoLogin('Farmer')}>
                <Tractor className="mr-2" /> Farmer Demo
            </Button>
            <Button variant="outline" onClick={() => handleDemoLogin('Admin')}>
                <Github className="mr-2" /> Admin Demo
            </Button>
        </div>
        <Separator />
        <div className="flex justify-center items-center text-sm text-muted-foreground">
            <Languages className="mr-2 h-4 w-4" />
            <span>English</span>
            <Separator orientation="vertical" className="h-4 mx-2" />
            <span>हिन्दी</span>
            <Separator orientation="vertical" className="h-4 mx-2" />
            <span>ਪੰਜਾਬੀ</span>
        </div>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground justify-center">
          Don&apos;t have an account?&nbsp;
          <Link href="/auth/signup" className="text-primary hover:underline">
            Sign up
          </Link>
      </CardFooter>
    </>
  );
}
