'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Landmark,
  LayoutDashboard,
  Leaf,
  ScanLine,
  Settings,
  ShoppingBasket,
  Users,
  CalendarRange,
  BarChart,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useSidebar } from '../ui/sidebar';
import { useLanguage } from '@/contexts/language-context';

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { setOpenMobile } = useSidebar();
  const { t } = useLanguage();

  const navItems = [
    { href: '/dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { href: '/chat', label: t('sidebar.aiCopilot'), icon: Bot },
    { href: '/market', label: t('sidebar.marketPrices'), icon: ShoppingBasket },
    { href: '/growth-forecast', label: t('sidebar.growthForecast'), icon: CalendarRange },
    { href: '/scanner', label: t('sidebar.cropScanner'), icon: ScanLine },
    { href: '/soil-analyzer', label: t('sidebar.soilAnalyzer'), icon: Leaf },
    { href: '/yield-analytics', label: "Yield Analytics", icon: BarChart },
    { href: '/community', label: t('sidebar.community'), icon: Users },
    { href: '/profile', label: t('sidebar.profile'), icon: Landmark, gap: true },
    { href: '/settings', label: t('sidebar.settings'), icon: Settings },
  ];
  
  const adminNavItems = [
     { href: '/admin/dashboard', label: t('sidebar.adminPanel'), icon: LayoutDashboard },
  ];

  const itemsToDisplay = user?.role === 'Admin' ? adminNavItems : navItems;


  return (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className="px-4">
        <Link href={user?.role === 'Admin' ? '/admin/dashboard' : '/dashboard'} onClick={() => setOpenMobile(false)}>
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 px-2">
        <ul className="space-y-1">
          {itemsToDisplay.map((item) => (
            <li key={item.href} className={cn(item.gap && 'pt-4 mt-4 border-t')}>
              <Link
                href={item.href}
                onClick={() => setOpenMobile(false)}
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