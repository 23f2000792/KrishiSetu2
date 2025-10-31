'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { MobileNav } from './mobile-nav';
import { Header } from './header';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar className="hidden md:flex md:flex-col md:border-r">
            <SidebarContent>
              <SidebarNav />
            </SidebarContent>
          </Sidebar>
          <main className={cn("flex-1 p-4 md:p-8 pt-6 bg-secondary/50", isMobile && 'pb-24')}>
            {children}
          </main>
        </div>
      </div>
      {isMobile && <MobileNav />}
    </SidebarProvider>
  );
}
