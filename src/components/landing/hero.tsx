import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find((p) => p.id === 'hero');

  return (
    <section className="relative bg-background overflow-hidden">
       <div className="absolute -bottom-1/3 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
       <div className="absolute -top-1/3 -right-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)] py-20 md:py-28">
          <div className="space-y-6 text-center lg:text-left animate-fade-in-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground tracking-tight">
              Smarter Farming,
              <br />
              <span className="text-primary">Brighter Future</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              KrishiSetu is your AI-powered partner in agriculture, providing
              real-time advice, market insights, and crop health analysis to
              boost your yield and profitability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto transform-gpu transition-transform hover:scale-105">
                <Link href="/auth/login">
                  Try Demo <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 lg:h-auto lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 animate-fade-in-left">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            )}
             <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-background/5 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
