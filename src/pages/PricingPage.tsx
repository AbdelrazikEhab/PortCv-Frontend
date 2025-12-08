import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Zap, Crown, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
    {
        name: 'free',
        displayName: 'Free',
        icon: Sparkles,
        price: { monthly: 0, yearly: 0 },
        description: 'Perfect for getting started',
        gradient: 'from-slate-500 to-slate-600',
        features: [
            '1 Resume',
            'Basic Templates',
            'PDF Download',
        ],
        notIncluded: [
            'No AI Features',
            'No Portfolio Website',
            'Custom Backgrounds',
            'Animations',
            'Custom Fonts',
            'Analytics',
        ],
    },
    {
        name: 'pro',
        displayName: 'Professional',
        icon: Zap,
        price: { monthly: 9.99, yearly: 99.99 },
        description: 'For serious job seekers',
        popular: true,
        gradient: 'from-primary to-purple-600',
        features: [
            '10 Portfolios',
            '10 Resumes',
            '50 AI Credits/month',
            'All Templates',
            'Custom Colors',
            'Custom Backgrounds',
            'Animations',
            'Custom Fonts',
            'Basic Analytics',
        ],
        notIncluded: [
            'Custom Domain',
            'Priority Support',
        ],
    },
    {
        name: 'enterprise',
        displayName: 'Enterprise',
        icon: Crown,
        price: { monthly: 29.99, yearly: 299.99 },
        description: 'For professionals & agencies',
        gradient: 'from-amber-500 to-orange-600',
        features: [
            'Unlimited Portfolios',
            'Unlimited Resumes',
            'Unlimited AI Credits',
            'All Templates',
            'Full Customization',
            'Advanced Analytics',
            'Custom Domain',
            'Priority Support',
            'White-label Option',
        ],
        notIncluded: [],
    },
];

export default function PricingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { subscription, createCheckoutSession } = useSubscription();
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleSelectPlan = async (planName: string) => {
        if (!user) {
            navigate('/auth');
            return;
        }

        if (planName === 'free') {
            navigate('/dashboard');
            return;
        }

        setLoadingPlan(planName);
        try {
            await createCheckoutSession(planName, billingPeriod);
        } finally {
            setLoadingPlan(null);
        }
    };

    const getSavingsPercentage = () => {
        return Math.round((1 - (99.99 / (9.99 * 12))) * 100);
    };

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-background/80">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="PortCV" className="w-8 h-8" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            PortCV
                        </span>
                    </div>
                    <div className="w-20" />
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Simple, transparent pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
                            Choose Your Plan
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Unlock premium features and take your portfolio to the next level
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center p-1.5 bg-card/50 border border-border/50 rounded-xl backdrop-blur-sm">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${billingPeriod === 'monthly'
                                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billingPeriod === 'yearly'
                                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/25'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Yearly
                            <span className={`text-xs px-2 py-0.5 rounded-full ${billingPeriod === 'yearly'
                                ? 'bg-white/20'
                                : 'bg-emerald-500/20 text-emerald-500'
                                }`}>
                                Save {getSavingsPercentage()}%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {plans.map((plan, index) => {
                        const Icon = plan.icon;
                        const isCurrentPlan = subscription?.plan === plan.name;
                        const price = billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly;
                        const isLoading = loadingPlan === plan.name;

                        return (
                            <div
                                key={plan.name}
                                className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                                        <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white text-sm font-semibold shadow-lg shadow-primary/25">
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className={`h-full p-8 rounded-3xl border transition-all duration-300 ${plan.popular
                                    ? 'bg-card/80 border-primary/50 shadow-xl shadow-primary/10'
                                    : 'bg-card/50 border-border/50 hover:border-primary/30 hover:shadow-lg'
                                    }`}>
                                    {/* Plan Header */}
                                    <div className="text-center mb-8">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} p-0.5 mx-auto mb-4`}>
                                            <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                                                <Icon className="w-7 h-7 text-foreground" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-1">{plan.displayName}</h3>
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center mb-8">
                                        <div className="flex items-end justify-center gap-1">
                                            <span className="text-5xl font-bold">${price}</span>
                                            {plan.name !== 'free' && (
                                                <span className="text-muted-foreground mb-2">
                                                    /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        onClick={() => handleSelectPlan(plan.name)}
                                        disabled={isCurrentPlan || isLoading}
                                        className={`w-full py-6 text-base font-medium transition-all ${plan.popular
                                            ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 hover:shadow-xl'
                                            : ''
                                            }`}
                                        variant={plan.popular ? 'default' : 'outline'}
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : isCurrentPlan ? (
                                            'Current Plan'
                                        ) : plan.name === 'free' ? (
                                            'Get Started'
                                        ) : (
                                            'Upgrade Now'
                                        )}
                                    </Button>

                                    {/* Features */}
                                    <div className="mt-8 space-y-3">
                                        {plan.features.map((feature) => (
                                            <div key={feature} className="flex items-start gap-3">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 text-emerald-500" />
                                                </div>
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((feature) => (
                                            <div key={feature} className="flex items-start gap-3 opacity-40">
                                                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <X className="w-3 h-3" />
                                                </div>
                                                <span className="text-sm line-through">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trust Badges */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-8 p-6 rounded-2xl bg-card/50 border border-border/50">
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm text-muted-foreground">Secure payment via Stripe</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-border" />
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm text-muted-foreground">Cancel anytime</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-border" />
                        <div className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm text-muted-foreground">14-day money back</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
