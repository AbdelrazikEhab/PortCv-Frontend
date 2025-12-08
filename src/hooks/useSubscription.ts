import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface Subscription {
    id: string;
    userId: string;
    plan: string;
    status: string;
    aiCreditsUsed: number;
    aiCreditsLimit: number;
    portfoliosUsed: number;
    portfoliosLimit: number;
    resumesUsed: number;
    resumesLimit: number;
    trialEndsAt?: string;
    currentPeriodEnd?: string;
}

interface Usage {
    aiCredits: { used: number; limit: number; percentage: number };
    portfolios: { used: number; limit: number; percentage: number };
    resumes: { used: number; limit: number; percentage: number };
}

export function useSubscription() {
    const queryClient = useQueryClient();

    const { data: subscription, isLoading } = useQuery<Subscription>({
        queryKey: ['subscription'],
        queryFn: async () => {
            const { data } = await api.get('/subscriptions/current');
            return data;
        },
    });

    const { data: usage } = useQuery<Usage>({
        queryKey: ['subscription-usage'],
        queryFn: async () => {
            const { data } = await api.get('/subscriptions/usage');
            return data;
        },
        enabled: !!subscription,
    });

    const cancelMutation = useMutation({
        mutationFn: async () => {
            const { data } = await api.post('/subscriptions/cancel');
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
        },
    });

    const createCheckoutSession = async (planName: string, billingPeriod: 'monthly' | 'yearly') => {
        const { data } = await api.post('/subscriptions/checkout', {
            planName,
            billingPeriod,
        });

        if (data.url) {
            window.location.href = data.url;
        }
    };

    const hasFeature = (featureName: string): boolean => {
        if (!subscription) return false;

        // Map plan to features
        const planFeatures: Record<string, string[]> = {
            free: [],
            pro: ['customColors', 'customBackground', 'animations', 'customFonts', 'analytics'],
            enterprise: ['customColors', 'customBackground', 'animations', 'customFonts', 'analytics', 'customDomain', 'prioritySupport', 'whiteLabel'],
        };

        return planFeatures[subscription.plan]?.includes(featureName) || false;
    };

    const canUseAI = (): boolean => {
        if (!subscription) return false;
        return subscription.aiCreditsUsed < subscription.aiCreditsLimit;
    };

    return {
        subscription,
        usage,
        isLoading,
        cancelSubscription: cancelMutation.mutate,
        createCheckoutSession,
        hasFeature,
        canUseAI,
        isPro: subscription?.plan === 'pro' || subscription?.plan === 'enterprise',
        isEnterprise: subscription?.plan === 'enterprise',
    };
}
