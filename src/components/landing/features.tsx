'use client';
import {
  Bot,
  LineChart,
  ScanLine,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI Copilot',
    description: 'Get instant, expert advice for your farming questions 24/7. From pest control to irrigation schedules, our AI is here to help.',
    image_id: 'feature_copilot'
  },
  {
    icon: <LineChart className="h-8 w-8 text-primary" />,
    title: 'Market Predictor',
    description: 'Make informed decisions with AI-powered market price forecasts. Know the best time to sell your produce for maximum profit.',
    image_id: 'feature_market'
  },
  {
    icon: <ScanLine className="h-8 w-8 text-primary" />,
    title: 'Leaf Scanner',
    description: 'Quickly diagnose crop diseases and nutrient deficiencies. Just snap a photo of a leaf to get an instant analysis and solution.',
    image_id: 'feature_scanner'
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            A New Era of Digital Agriculture
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            KrishiSetu integrates cutting-edge AI to provide you with the tools you need for a successful harvest.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
             const featureImage = PlaceHolderImages.find((p) => p.id === feature.image_id);
            return (
            <Card 
                key={feature.title} 
                className="text-center transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    {feature.icon}
                </div>
                <CardTitle className="font-headline text-2xl pt-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
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
