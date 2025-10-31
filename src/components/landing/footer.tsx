'use client';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export function Footer() {
    const { t } = useLanguage();

    const footerNav = [
        { name: t('landing.home'), href: '/' },
        { name: t('landing.features'), href: '/#features' },
        { name: t('landing.login'), href: '/auth/login' },
        { name: t('landing.signUp'), href: '/auth/signup' },
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
              {t('landing.footerSlogan')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 col-span-2">
            <div>
              <h3 className="font-headline font-semibold text-foreground">{t('landing.quickLinks')}</h3>
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
                <h3 className="font-headline font-semibold text-foreground">{t('landing.legal')}</h3>
                <ul className="mt-4 space-y-2">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('landing.privacyPolicy')}</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('landing.termsOfService')}</Link></li>
                </ul>
            </div>
            <div>
                <h3 className="font-headline font-semibold text-foreground">{t('landing.contact')}</h3>
                <ul className="mt-4 space-y-2">
                    <li><a href="mailto:support@krishisetu.com" className="text-muted-foreground hover:text-primary transition-colors">support@krishisetu.com</a></li>
                </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">{t('landing.copyright').replace('{year}', new Date().getFullYear().toString())}</p>
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
