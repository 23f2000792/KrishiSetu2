'use client';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/layout/user-nav';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/language-context';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { t, setLocale } = useLanguage();

  if (user?.role !== 'Admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-8">
        <Logo />
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                <Languages className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">{t('header.selectLanguage')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocale('en')}>{t('header.english')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale('hi')}>{t('header.hindi')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale('pa')}>{t('header.punjabi')}</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          <UserNav />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
