import { Header } from '@/components/layout/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
      <Header />
      <main className="flex-1 py-16 md:py-24 animate-fade-in">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl md:text-4xl font-headline font-bold tracking-tight">Terms of Service</CardTitle>
              <CardDescription>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="prose prose-lg max-w-none text-muted-foreground mx-auto">
                <p>
                    Please read these terms of service carefully before using KrishiSetu application operated by us.
                </p>
                
                <h2 className="text-2xl font-headline font-semibold mt-8 mb-4 text-foreground">Conditions of Use</h2>
                <p>
                    We will provide their services to you, which are subject to the conditions stated below in this document. Every time you visit this application, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.
                </p>

                <h2 className="text-2xl font-headline font-semibold mt-8 mb-4 text-foreground">Privacy Policy</h2>
                <p>
                    Before you continue using our application, we advise you to read our <a href="/privacy-policy" className="text-primary hover:underline">privacy policy</a> regarding our user data collection. It will help you better understand our practices.
                </p>
                
                <h2 className="text-2xl font-headline font-semibold mt-8 mb-4 text-foreground">Applicable Law</h2>
                <p>
                    By visiting this application, you agree that the laws of the location of the company, without regard to principles of conflict laws, will govern these terms of service, or any dispute of any sort that might come between KrishiSetu and you, or its business partners and associates.
                </p>
                
                <h2 className="text-2xl font-headline font-semibold mt-8 mb-4 text-foreground">Disputes</h2>
                <p>
                    Any dispute related in any way to your visit to this application or to products you purchase from us shall be arbitrated by state or federal court and you consent to exclusive jurisdiction and venue of such courts.
                </p>

                <h2 className="text-2xl font-headline font-semibold mt-8 mb-4 text-foreground">Contact Us</h2>
                <p>
                    If you have questions or comments about this policy, you may email us at <a href="mailto:support@krishisetu.com" className="text-primary hover:underline">support@krishisetu.com</a>.
                </p>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
