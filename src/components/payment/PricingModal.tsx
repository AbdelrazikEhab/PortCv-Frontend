import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import api from "@/lib/api";
import { Loader2, Check, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PricingModalProps {
    triggerId?: string;
}

export const PricingModal = ({ triggerId }: PricingModalProps = {}) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSubscribe = async (priceId: string) => {
        setLoading(true);
        try {
            const { data } = await api.post('/payment/create-checkout-session', {
                priceId,
                successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}/dashboard`,
            });

            if (data?.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to start checkout. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Replace with your actual Stripe Price IDs
    const PRO_PRICE_ID = "price_1234567890";

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    id={triggerId}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">Unlock Full Potential</DialogTitle>
                    <DialogDescription className="text-center">
                        Choose the plan that fits your career goals.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 py-6">
                    {/* Free Plan */}
                    <div className="border rounded-xl p-6 space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-bold text-xl">Free</h3>
                            <p className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                            <p className="text-muted-foreground text-sm">Perfect for getting started</p>
                        </div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 1 Resume</li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Basic Templates</li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> PDF Download</li>
                            <li className="flex items-center text-muted-foreground"><Check className="w-4 h-4 mr-2 opacity-50" /> No AI Features</li>
                            <li className="flex items-center text-muted-foreground"><Check className="w-4 h-4 mr-2 opacity-50" /> No Portfolio Website</li>
                        </ul>
                        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="border-2 border-purple-600 rounded-xl p-6 space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                            POPULAR
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-xl text-purple-600">Pro</h3>
                            <p className="text-3xl font-bold">$19<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                            <p className="text-muted-foreground text-sm">Everything you need to land the job</p>
                        </div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Unlimited Resumes</li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Premium Templates</li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> <strong>AI Job Match & Rewrite</strong></li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> <strong>AI Cover Letter & Interview Prep</strong></li>
                            <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> <strong>Personal Portfolio Website</strong></li>
                        </ul>
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => handleSubscribe(PRO_PRICE_ID)}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upgrade Now"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
