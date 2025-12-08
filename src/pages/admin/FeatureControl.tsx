import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeatureConfig {
    name: string;
    description: string;
    requiresPayment: boolean;
    category: string;
}

const FeatureControl = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [features, setFeatures] = useState<FeatureConfig[]>([
        {
            name: "AI Resume Parser",
            description: "Parse PDF resumes using AI",
            requiresPayment: false,
            category: "AI Features"
        },
        {
            name: "Job Matcher",
            description: "AI-powered job matching",
            requiresPayment: false,
            category: "AI Features"
        },
        {
            name: "CV Rewriter",
            description: "AI resume optimization",
            requiresPayment: false,
            category: "AI Features"
        },
        {
            name: "Cover Letter Generator",
            description: "Generate cover letters with AI",
            requiresPayment: false,
            category: "AI Features"
        },
        {
            name: "Interview Prep",
            description: "AI interview preparation",
            requiresPayment: false,
            category: "AI Features"
        },
        {
            name: "Multiple Resumes",
            description: "Create more than 1 resume",
            requiresPayment: true,
            category: "Resume Features"
        },
        {
            name: "Portfolio Customization",
            description: "Advanced portfolio customization",
            requiresPayment: false,
            category: "Portfolio Features"
        },
        {
            name: "Custom Domain",
            description: "Use custom domain for portfolio",
            requiresPayment: true,
            category: "Portfolio Features"
        },
        {
            name: "Analytics",
            description: "View portfolio analytics",
            requiresPayment: true,
            category: "Portfolio Features"
        },
        {
            name: "Skills Development",
            description: "Career growth recommendations",
            requiresPayment: false,
            category: "Career Tools"
        },
    ]);

    const toggleFeature = (index: number) => {
        const newFeatures = [...features];
        newFeatures[index].requiresPayment = !newFeatures[index].requiresPayment;
        setFeatures(newFeatures);
    };

    const handleSave = () => {
        // In a real implementation, this would save to backend
        toast({
            title: "Success",
            description: "Feature configuration saved successfully",
        });
    };

    const groupedFeatures = features.reduce((acc, feature) => {
        if (!acc[feature.category]) {
            acc[feature.category] = [];
        }
        acc[feature.category].push(feature);
        return acc;
    }, {} as Record<string, FeatureConfig[]>);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Feature Control</h1>
                            <p className="text-muted-foreground">Configure which features require payment</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>

                <div className="space-y-6">
                    {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                        <Card key={category}>
                            <CardHeader>
                                <CardTitle>{category}</CardTitle>
                                <CardDescription>
                                    Control payment requirements for {category.toLowerCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {categoryFeatures.map((feature, index) => {
                                    const globalIndex = features.findIndex(f => f.name === feature.name);
                                    return (
                                        <div
                                            key={feature.name}
                                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                {feature.requiresPayment ? (
                                                    <Lock className="w-5 h-5 text-amber-500" />
                                                ) : (
                                                    <Unlock className="w-5 h-5 text-green-500" />
                                                )}
                                                <div>
                                                    <h3 className="font-medium">{feature.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-muted-foreground">
                                                    {feature.requiresPayment ? "Paid" : "Free"}
                                                </span>
                                                <Switch
                                                    checked={feature.requiresPayment}
                                                    onCheckedChange={() => toggleFeature(globalIndex)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-amber-500/50 bg-amber-500/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-amber-500" />
                            Payment Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Free Plan:</strong> Users get 1 resume, 1 portfolio, 5 AI credits</p>
                        <p><strong>Pro Plan:</strong> 10 resumes, 3 portfolios, 100 AI credits/month</p>
                        <p><strong>Enterprise Plan:</strong> Unlimited resumes, portfolios, and AI credits</p>
                        <p className="text-muted-foreground mt-4">
                            Toggle features above to control which require payment. Features marked as "Paid" will only be available to Pro/Enterprise users.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FeatureControl;
