'use client';
import { Bot, LineChart, ScanLine } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/contexts/language-context';
import { Badge } from '../ui/badge';

export function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <ScanLine className="h-8 w-8" />,
      title: t('landing.featureScannerTitle'),
      description: t('landing.featureScannerDesc'),
      image_id: 'feature_scanner',
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: t('landing.featureCopilotTitle'),
      description: t('landing.featureCopilotDesc'),
      image_id: 'feature_copilot',
    },
    {
      icon: <LineChart className="h-8 w-8" />,
      title: t('landing.featureMarketTitle'),
      description: t('landing.featureMarketDesc'),
      image_id: 'feature_market',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="outline" className='text-sm mb-4 border-primary/50 text-primary font-medium'>{t('landing.keyFeatures', 'Key Features')}</Badge>
          <h2 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">
            {t('landing.featuresTitle')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('landing.featuresSubtitle')}
          </p>
        </div>
        <div className="mt-20 space-y-24">
          {features.map((feature, index) => {
            const featureImage = PlaceHolderImages.find((p) => p.id === feature.image_id);
            const isReversed = index % 2 !== 0;

            return (
              <div key={feature.title} className="grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
                <div className={`space-y-4 ${isReversed ? 'md:order-2' : ''}`}>
                    <div className="inline-flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-headline font-bold">{feature.title}</h3>
                    </div>
                  <p className="text-lg text-muted-foreground">{feature.description}</p>
                </div>
                {featureImage && (
                  <div className={`relative aspect-video rounded-xl overflow-hidden shadow-lg border ${isReversed ? 'md:order-1' : ''}`}>
                    <Image
                      src={featureImage.imageUrl}
                      alt={featureImage.description}
                      fill
                      className="object-cover"
                      data-ai-hint={featureImage.imageHint}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
