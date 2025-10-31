'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  LayoutDashboard,
  Leaf,
  ScanLine,
  ShoppingBasket,
  Users,
  CalendarRange,
  BarChart,
  Book,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '../ui/sidebar';
import { useLanguage } from '@/contexts/language-context';

export function MobileNav() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { t } = useLanguage();
  
  const navItems = [
    { href: '/dashboard', label: t('mobileNav.home'), icon: LayoutDashboard },
    { href: '/chat', label: t('mobileNav.copilot'), icon: Bot },
    { href: '/scanner', label: t('mobileNav.scan'), icon: ScanLine },
    { href: '/crop-planner', label: t('mobileNav.planner'), icon: Book },
    { href: '/community', label: t('mobileNav.community'), icon: Users },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-background/80 border-t backdrop-blur-sm z-40">
      <nav className="h-full">
        <ul className="flex h-full items-center justify-around">
          {navItems.map((item) => (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                onClick={() => setOpenMobile(false)}
                className={cn(
                  'flex flex-col items-center gap-1 text-muted-foreground transition-colors w-16 py-2 rounded-lg',
                  pathname === item.href ? 'text-primary' : 'hover:text-primary'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
               {pathname === item.href && (
                <div className="absolute -top-1 left-1/2 -translate-x-2 w-8 h-1 bg-primary rounded-full" />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
