'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Landmark,
  LayoutDashboard,
  ScanLine,
  Settings,
  Shield,
  ShoppingBasket,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/chat', label: 'AI Copilot', icon: Bot },
    { href: '/market', label: 'Market Prices', icon: ShoppingBasket },
    { href: '/scanner', label: 'Leaf Scanner', icon: ScanLine },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/profile', label: 'Profile', icon: Landmark, gap: true },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];
  
  const adminNavItems = [
    { href: '/admin', label: 'Admin Panel', icon: Shield },
  ];

  const allNavItems = user?.role === 'Admin' ? [...navItems, ...adminNavItems] : navItems;

  return (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className="px-4">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {allNavItems.map((item) => (
            <li key={item.href} className={cn(item.gap && 'pt-4 mt-4 border-t')}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                  pathname === item.href && 'bg-primary/10 font-medium text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
