'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');
  const { t } = useLanguage();

  return (
    <section className="relative bg-background overflow-hidden">
       <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-fade-in" style={{animationDelay: '500ms'}} />
       <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl animate-fade-in" style={{animationDelay: '700ms'}}/>
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)] py-20 md:py-28">
          <div className="space-y-8 text-center lg:text-left animate-fade-in-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground tracking-tighter !leading-tight">
              {t('landing.heroTitle').split('\n').map((line, i) => (
                <span key={i} className={i === 1 ? 'text-primary' : ''}>
                  {line}
                  {i < t('landing.heroTitle').split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              {t('landing.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto transform-gpu transition-transform hover:scale-105 shadow-lg shadow-primary/20">
                <Link href="/auth/login">
                  {t('landing.tryDemo')} <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto text-muted-foreground hover:text-primary">
                <Link href="#">
                  <PlayCircle className="mr-2" />
                  {t('landing.watchVideo', 'Watch Video')}
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-80 md:h-auto lg:aspect-[5/4] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 animate-fade-in-left group">
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
             <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
