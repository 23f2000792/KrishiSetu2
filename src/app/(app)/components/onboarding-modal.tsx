
'use client';

import { useAuth } from "@/contexts/auth-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OnboardingForm } from "./onboarding-form";
import { useState } from "react";

export function OnboardingModal() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(true);

    const needsOnboarding = user && user.role === 'Farmer' && !user.farmSize;

    const handleClose = () => {
      // In a real app, you might want a "skip" option that sets a flag.
      // For now, we just close the dialog for the session.
      setIsOpen(false);
    }
    
    if (!needsOnboarding) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} hideCloseButton>
                <DialogHeader>
                    <DialogTitle>Welcome to KrishiSetu!</DialogTitle>
                    <DialogDescription>
                        Let's personalize your experience. Please tell us a bit about your farm.
                    </DialogDescription>
                </DialogHeader>
                <OnboardingForm onFinished={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
