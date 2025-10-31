'use client';

import Link from 'next/link';
import {
  Bell,
  Languages,
  Menu,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from './user-nav';
import { SidebarNav } from './sidebar-nav';
import { Logo } from '../logo';
import { useAuth } from '@/contexts/auth-context';

export function Header() {
  const { isAuthenticated } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-8">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0 w-72">
            <SidebarNav />
          </SheetContent>
        </Sheet>
      </div>

      <div className="w-full flex-1">
        {/* Can add breadcrumbs or page title here */}
      </div>

      {!isAuthenticated && (
         <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
            </Button>
         </div>
      )}

      {isAuthenticated && (
        <div className="flex items-center gap-4">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                <Languages className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Select Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>हिन्दी</DropdownMenuItem>
                <DropdownMenuItem>ਪੰਜਾਬੀ</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="icon" className="relative">
            <Bell className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle notifications</span>
            <span className="absolute top-0 right-0 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            </Button>
            <UserNav />
        </div>
      )}
    </header>
  );
}
