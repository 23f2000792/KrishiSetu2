import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    const footerNav = [
        { name: 'Home', href: '/' },
        { name: 'Features', href: '/#features' },
        { name: 'Login', href: '/auth/login' },
        { name: 'Sign Up', href: '/auth/signup' },
    ];
    const socialLinks = [
        { icon: <Twitter size={20} />, href: '#', name: 'Twitter' },
        { icon: <Github size={20} />, href: '#', name: 'Github' },
        { icon: <Linkedin size={20} />, href: '#', name: 'LinkedIn' },
    ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground max-w-xs">
              Empowering farmers with AI for a sustainable and profitable future.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 col-span-2">
            <div>
              <h3 className="font-headline font-semibold text-foreground">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                {footerNav.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                        {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
                <h3 className="font-headline font-semibold text-foreground">Legal</h3>
                <ul className="mt-4 space-y-2">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="font-headline font-semibold text-foreground">Contact</h3>
                <ul className="mt-4 space-y-2">
                    <li><a href="mailto:support@krishisetu.com" className="text-muted-foreground hover:text-primary transition-colors">support@krishisetu.com</a></li>
                </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} KrishiSetu. All rights reserved.</p>
          <div className="flex gap-2">
            {socialLinks.map((link) => (
              <Button key={link.name} variant="ghost" size="icon" asChild>
                <a href={link.href} aria-label={link.name}>
                  {link.icon}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
