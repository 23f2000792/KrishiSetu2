'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  LayoutDashboard,
  ScanLine,
  ShoppingBasket,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const navItems = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: '/chat', label: 'Copilot', icon: Bot },
    { href: '/scanner', label: 'Scan', icon: ScanLine },
    { href: '/market', label: 'Market', icon: ShoppingBasket },
    { href: '/community', label: 'Community', icon: Users },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-40">
      <nav className="h-full">
        <ul className="flex h-full items-center justify-around">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 text-muted-foreground transition-colors w-16',
                  pathname === item.href ? 'text-primary' : 'hover:text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
