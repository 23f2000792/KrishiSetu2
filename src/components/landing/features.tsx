'use client';
import {
  Bot,
  LineChart,
  ScanLine,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/contexts/language-context';

export function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: t('landing.featureCopilotTitle'),
      description: t('landing.featureCopilotDesc'),
      image_id: 'feature_copilot'
    },
    {
      icon: <LineChart className="h-8 w-8 text-primary" />,
      title: t('landing.featureMarketTitle'),
      description: t('landing.featureMarketDesc'),
      image_id: 'feature_market'
    },
    {
      icon: <ScanLine className="h-8 w-8 text-primary" />,
      title: t('landing.featureScannerTitle'),
      description: t('landing.featureScannerDesc'),
      image_id: 'feature_scanner'
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            {t('landing.featuresTitle')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('landing.featuresSubtitle')}
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
             const featureImage = PlaceHolderImages.find((p) => p.id === feature.image_id);
            return (
            <Card 
                key={feature.title} 
                className="text-center transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up group"
                style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {feature.icon}
                </div>
                <CardTitle className="font-headline text-2xl pt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col flex-grow'>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
                 {featureImage && (
                    <div className="mt-6 aspect-video relative rounded-lg overflow-hidden border">
                        <Image
                            src={featureImage.imageUrl}
                            alt={featureImage.description}
                            fill
                            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                            data-ai-hint={featureImage.imageHint}
                        />
                    </div>
                )}
              </CardContent>
            </Card>
          )})}
        </div>
      </div>
    </section>
  );
}
