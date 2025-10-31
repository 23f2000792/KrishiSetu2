'use client';
import { AppShell } from '@/components/layout/app-shell';
import { useAuth } from '@/contexts/auth-context';
import { redirect, usePathname } from 'next/navigation';
import { OnboardingModal } from './components/onboarding-modal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  // If user is an Admin and trying to access farmer pages, redirect to /admin/dashboard
  if (user?.role === 'Admin' && !pathname.startsWith('/admin')) {
    redirect('/admin/dashboard');
  }

  // If user is a Farmer and trying to access admin pages, redirect to /dashboard
  if (user?.role === 'Farmer' && pathname.startsWith('/admin')) {
    redirect('/dashboard');
  }

  // Admin users should not use the AppShell, they have their own layout.
  if (user?.role === 'Admin') {
    return <>{children}</>;
  }
  
  return (
    <AppShell>
      <OnboardingModal />
      {children}
    </AppShell>
  );
}
