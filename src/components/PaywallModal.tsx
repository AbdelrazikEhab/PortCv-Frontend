import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: string;
    message?: string;
}

export function PaywallModal({ isOpen, onClose, feature, message }: PaywallModalProps) {
    const navigate = useNavigate();

    const handleUpgrade = () => {
        onClose();
        navigate('/pricing');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-2xl">
                        Unlock {feature}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {message || `This feature is available in our Pro and Enterprise plans.`}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold mb-1">Upgrade to Pro</p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>• Custom backgrounds & colors</li>
                                    <li>• Animations & custom fonts</li>
                                    <li>• 50 AI credits per month</li>
                                    <li>• 10 portfolios & resumes</li>
                                </ul>
                                <p className="text-sm font-semibold text-primary mt-2">
                                    Starting at $9.99/month
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Maybe Later
                        </Button>
                        <Button onClick={handleUpgrade} className="flex-1 bg-primary hover:bg-primary-glow">
                            View Plans
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
