import { Header } from '@/components/layout/header';
import { Footer } from '@/components/landing/footer';

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight mb-6">Terms of Service</h1>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>
                Please read these terms of service carefully before using KrishiSetu application operated by us.
              </p>
              
              <h2 className="text-2xl font-headline font-semibold mt-8 mb-4">Conditions of Use</h2>
              <p>
                We will provide their services to you, which are subject to the conditions stated below in this document. Every time you visit this application, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.
              </p>

              <h2 className="text-2xl font-headline font-semibold mt-8 mb-4">Privacy Policy</h2>
              <p>
                Before you continue using our application, we advise you to read our privacy policy regarding our user data collection. It will help you better understand our practices.
              </p>
              
              <h2 className="text-2xl font-headline font-semibold mt-8 mb-4">Applicable Law</h2>
              <p>
                By visiting this application, you agree that the laws of the location of the company, without regard to principles of conflict laws, will govern these terms of service, or any dispute of any sort that might come between KrishiSetu and you, or its business partners and associates.
              </p>
              
              <h2 className="text-2xl font-headline font-semibold mt-8 mb-4">Disputes</h2>
              <p>
                Any dispute related in any way to your visit to this application or to products you purchase from us shall be arbitrated by state or federal court and you consent to exclusive jurisdiction and venue of such courts.
              </p>

              <h2 className="text-2xl font-headline font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have questions or comments about this policy, you may email us at support@krishisetu.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
