'use client';
import { AppShell } from '@/components/layout/app-shell';
import { useAuth } from '@/contexts/auth-context';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (user?.role !== 'Admin') {
    redirect('/dashboard');
  }

  return <AppShell>{children}</AppShell>;
}
