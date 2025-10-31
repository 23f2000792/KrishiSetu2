import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Footer } from "@/components/landing/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-secondary/50">
        <div className="flex-grow flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md space-y-6">
                <Link href="/" className="flex justify-center">
                    <Logo />
                </Link>
                <Card className="shadow-xl">
                    {children}
                </Card>
            </div>
        </div>
        <Footer />
    </div>
  );
}
