import { AppShell } from '@/components/layout/app-shell';
import { redirect } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // In a real app, you would get the session from the server
  // and redirect if not authenticated.
  // For this demo, the AuthProvider on the client handles redirection.
  
  return <AppShell>{children}</AppShell>;
}
