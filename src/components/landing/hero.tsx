'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export function Hero() {
  const { t } = useLanguage();
  const heroImages = [
    PlaceHolderImages.find((p) => p.id === 'hero'),
    PlaceHolderImages.find((p) => p.id === 'feature_scanner'),
    PlaceHolderImages.find((p) => p.id === 'feature_market'),
    PlaceHolderImages.find((p) => p.id === 'vegetables'),
    PlaceHolderImages.find((p) => p.id === 'rice_harvest'),
  ].filter(Boolean) as any[];

  return (
    <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden">
      <div className="absolute inset-0 h-full w-full">
        <div className="relative h-full w-full">
          {heroImages.map((image, index) => (
            <Image
              key={image.id}
              src={image.imageUrl}
              alt={image.description}
              fill
              className="object-cover animate-fade-in"
              style={{
                animationDelay: `${index * 5}s`,
                animationDuration: '5s',
                opacity: index === 0 ? 1 : 0,
                zIndex: index,
              }}
              priority={index === 0}
              data-ai-hint={image.imageHint}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className="container relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
        <div className="max-w-3xl space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tighter !leading-tight">
            {t('landing.heroTitle').split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            {t('landing.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto transform-gpu transition-transform hover:scale-105 shadow-lg">
              <Link href="/auth/signup">
                {t('landing.getStartedFree')} <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href="/#features">
                {t('landing.learnMore')}
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-white/80 pt-4">
            <div className="flex items-center gap-2"><Check size={16} /> Free to start</div>
            <div className="flex items-center gap-2"><Check size={16} /> AI-Powered Insights</div>
          </div>
        </div>
      </div>
    </section>
  );
}
