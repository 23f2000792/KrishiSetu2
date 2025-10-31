'use client';

import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { MobileNav } from './mobile-nav';
import { Header } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:flex md:flex-col md:border-r">
          <SidebarContent>
            <SidebarNav />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-8 pt-6 bg-secondary/50">
            {children}
          </main>
        </div>
      </div>
      {isMobile && <MobileNav />}
    </SidebarProvider>
  );
}
