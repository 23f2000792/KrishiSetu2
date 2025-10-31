'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');
  const { t } = useLanguage();

  return (
    <section className="relative bg-background overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background"></div>
       <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-fade-in" style={{animationDelay: '500ms'}} />
       <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl animate-fade-in" style={{animationDelay: '700ms'}}/>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left animate-fade-in-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground tracking-tighter !leading-tight">
              {t('landing.heroTitle').split('\n').map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? <span className="text-primary">{line}</span> : line}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              {t('landing.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto transform-gpu transition-transform hover:scale-105 shadow-lg shadow-primary/20">
                <Link href="/auth/signup">
                  {t('landing.getStartedFree')} <ArrowRight className="ml-2" />
                </Link>
              </Button>
               <Button asChild size="lg" variant="ghost" className="w-full sm:w-auto">
                <Link href="/#features">
                  {t('landing.learnMore')}
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground pt-4">
                <div className='flex items-center gap-2'><Check size={16} className='text-primary'/> Free to start</div>
                <div className='flex items-center gap-2'><Check size={16} className='text-primary'/> AI-Powered Insights</div>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 animate-fade-in-left group border-8 border-card">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            )}
             <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
