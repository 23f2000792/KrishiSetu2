'use client';
import { Bot, LineChart, ScanLine } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <ScanLine className="h-8 w-8 text-primary" />,
      title: t('landing.featureScannerTitle'),
      description: t('landing.featureScannerDesc'),
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: t('landing.featureCopilotTitle'),
      description: t('landing.featureCopilotDesc'),
    },
    {
      icon: <LineChart className="h-8 w-8 text-primary" />,
      title: t('landing.featureMarketTitle'),
      description: t('landing.featureMarketDesc'),
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
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={feature.title} className="text-center animate-fade-in-up transform-gpu transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2" style={{ animationDelay: `${index * 150}ms`}}>
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full w-fit">
                    {feature.icon}
                </div>
                <CardTitle className="pt-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
