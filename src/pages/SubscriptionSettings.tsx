import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CreditCard,
    TrendingUp,
    AlertCircle,
    Zap,
    Crown,
    Sparkles,
    Check,
    Calendar,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';

export default function SubscriptionSettings() {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { subscription, usage, isLoading, cancelSubscription, isPro, isEnterprise } = useSubscription();

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading subscription details...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        navigate('/auth');
        return null;
    }

    const getPlanIcon = (plan: string) => {
        switch (plan) {
            case 'pro':
                return <Zap className="w-6 h-6" />;
            case 'enterprise':
                return <Crown className="w-6 h-6" />;
            default:
                return <Sparkles className="w-6 h-6" />;
        }
    };

    const getPlanGradient = (plan: string) => {
        switch (plan) {
            case 'pro':
                return 'from-primary to-purple-600';
            case 'enterprise':
                return 'from-amber-500 to-orange-600';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="PortCV" className="w-8 h-8" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            PortCV
                        </span>
                    </div>
                    <div className="w-32" />
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Page Title */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Subscription & Usage
                        </span>
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your subscription and monitor your usage
                    </p>
                </div>

                {/* Current Plan Card */}
                <div className="mb-8 p-8 rounded-3xl bg-card/50 border border-border/50 relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${getPlanGradient(subscription?.plan || 'free')} opacity-10 blur-3xl`} />

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getPlanGradient(subscription?.plan || 'free')} p-0.5`}>
                                    <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                                        {getPlanIcon(subscription?.plan || 'free')}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold capitalize">{subscription?.plan || 'Free'} Plan</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        {subscription?.status === 'trialing' && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                                Trial Active
                                            </span>
                                        )}
                                        {subscription?.status === 'active' && (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-500">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={() => navigate('/pricing')}
                                className={`gap-2 ${isPro || isEnterprise
                                        ? ''
                                        : 'bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/25'
                                    }`}
                                variant={isPro || isEnterprise ? 'outline' : 'default'}
                            >
                                {isPro || isEnterprise ? 'Change Plan' : 'Upgrade Now'}
                            </Button>
                        </div>

                        {/* Trial Notice */}
                        {subscription?.trialEndsAt && (
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-400">Trial Period Active</p>
                                        <p className="text-sm text-muted-foreground">
                                            Your trial ends on {new Date(subscription.trialEndsAt).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Next Billing */}
                        {subscription?.currentPeriodEnd && subscription.status !== 'trialing' && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Usage Stats */}
                <div className="mb-8 p-8 rounded-3xl bg-card/50 border border-border/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold">Usage Statistics</h2>
                    </div>

                    <div className="space-y-6">
                        {/* AI Credits */}
                        <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    <span className="font-medium">AI Credits</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {usage?.aiCredits.used || 0} / {usage?.aiCredits.limit || 0}
                                </span>
                            </div>
                            <Progress value={usage?.aiCredits.percentage || 0} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                                Used for ATS scoring, resume parsing, and AI features
                            </p>
                        </div>

                        {/* Portfolios */}
                        <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-sm bg-primary" />
                                    </div>
                                    <span className="font-medium">Portfolios</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {usage?.portfolios.used || 0} / {usage?.portfolios.limit || 0}
                                </span>
                            </div>
                            <Progress value={usage?.portfolios.percentage || 0} className="h-2" />
                        </div>

                        {/* Resumes */}
                        <div className="p-4 rounded-xl bg-background/50 border border-border/30">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-accent/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-sm bg-accent" />
                                    </div>
                                    <span className="font-medium">Resumes</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {usage?.resumes.used || 0} / {usage?.resumes.limit || 0}
                                </span>
                            </div>
                            <Progress value={usage?.resumes.percentage || 0} className="h-2" />
                        </div>
                    </div>

                    {/* Warning */}
                    {((usage?.aiCredits.percentage || 0) > 80 ||
                        (usage?.portfolios.percentage || 0) > 80 ||
                        (usage?.resumes.percentage || 0) > 80) && (
                            <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-amber-400">Approaching Limit</p>
                                        <p className="text-sm text-muted-foreground">
                                            You're running low on resources. Consider upgrading your plan for more capacity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>

                {/* Billing Management */}
                {(isPro || isEnterprise) && (
                    <div className="p-8 rounded-3xl bg-card/50 border border-border/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold">Billing & Payments</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Security Badge */}
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-emerald-500">Secure payments powered by Stripe</span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/30">
                                <div>
                                    <p className="font-medium">Cancel Subscription</p>
                                    <p className="text-sm text-muted-foreground">
                                        You'll retain access until the end of your billing period
                                    </p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
                                            cancelSubscription();
                                        }
                                    }}
                                >
                                    Cancel Subscription
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
