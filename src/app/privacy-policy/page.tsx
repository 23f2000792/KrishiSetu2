import { Header } from '@/components/layout/header';
import { Footer } from '@/components/landing/footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight mb-6">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>
                Welcome to KrishiSetu. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
              </p>
              
              <h2 className="text-2xl font-headline font-semibold mt-8 mb-4">Information We Collect</h2>
              <p>
                We may collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application or otherwise when you contact us.
              </p>
              <p>
                The personal information that we collect depends on the context of your interactions with us and the application, the choices you make and the products and features you use. The personal information we collect may include the following: name, email address, phone number, and location data.
              </p>

              <h2 className="text-2xl font-headline font-semibold mt-8 mb-4">How We Use Your Information</h2>
              <p>
                We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>
              <ul>
                <li>To facilitate account creation and logon process.</li>
                <li>To post testimonials on our application with your consent.</li>
                <li>To manage user accounts and keep our application in working order.</li>
                <li>To send administrative information to you.</li>
                <li>To protect our Services.</li>
                <li>To respond to user inquiries and offer support to users.</li>
              </ul>

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
