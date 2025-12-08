import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, CreditCard, Webhook, TestTube, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentSettings = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        stripeEnabled: true,
        testMode: true,
        stripePublishableKey: "",
        stripeSecretKey: "",
        webhookSecret: "",
        monthlyProPrice: 9.99,
        monthlyEnterprisePrice: 29.99,
        yearlyProPrice: 99.99,
        yearlyEnterprisePrice: 299.99,
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            // In production, save to backend
            toast({
                title: "Success",
                description: "Payment settings saved successfully",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save settings",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Payment Gateway</h1>
                            <p className="text-muted-foreground">Configure Stripe payment settings</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="gap-2">
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </div>

                {/* Status Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Payment Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Enable Payments</h3>
                                <p className="text-sm text-muted-foreground">Accept payments from users</p>
                            </div>
                            <Switch
                                checked={settings.stripeEnabled}
                                onCheckedChange={(checked) => setSettings({ ...settings, stripeEnabled: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium flex items-center gap-2">
                                    <TestTube className="w-4 h-4 text-yellow-500" />
                                    Test Mode
                                </h3>
                                <p className="text-sm text-muted-foreground">Use Stripe test keys (no real charges)</p>
                            </div>
                            <Switch
                                checked={settings.testMode}
                                onCheckedChange={(checked) => setSettings({ ...settings, testMode: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* API Keys */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Stripe API Keys
                        </CardTitle>
                        <CardDescription>
                            {settings.testMode ? "Using test keys" : "Using live keys - real charges will occur"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Publishable Key</label>
                            <Input
                                type="password"
                                value={settings.stripePublishableKey}
                                onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })}
                                placeholder={settings.testMode ? "pk_test_..." : "pk_live_..."}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Secret Key</label>
                            <Input
                                type="password"
                                value={settings.stripeSecretKey}
                                onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                                placeholder={settings.testMode ? "sk_test_..." : "sk_live_..."}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Webhook */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Webhook className="w-5 h-5" />
                            Webhook Configuration
                        </CardTitle>
                        <CardDescription>
                            Configure Stripe webhooks for payment events
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm font-medium">Webhook URL</p>
                            <code className="text-xs text-muted-foreground">
                                {window.location.origin}/api/subscriptions/webhook
                            </code>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Webhook Secret</label>
                            <Input
                                type="password"
                                value={settings.webhookSecret}
                                onChange={(e) => setSettings({ ...settings, webhookSecret: e.target.value })}
                                placeholder="whsec_..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing Configuration</CardTitle>
                        <CardDescription>Set prices for subscription plans</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-medium">Monthly Plans</h3>
                                <div className="space-y-2">
                                    <label className="text-sm">Pro Monthly ($)</label>
                                    <Input
                                        type="number"
                                        value={settings.monthlyProPrice}
                                        onChange={(e) => setSettings({ ...settings, monthlyProPrice: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm">Enterprise Monthly ($)</label>
                                    <Input
                                        type="number"
                                        value={settings.monthlyEnterprisePrice}
                                        onChange={(e) => setSettings({ ...settings, monthlyEnterprisePrice: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-medium">Yearly Plans</h3>
                                <div className="space-y-2">
                                    <label className="text-sm">Pro Yearly ($)</label>
                                    <Input
                                        type="number"
                                        value={settings.yearlyProPrice}
                                        onChange={(e) => setSettings({ ...settings, yearlyProPrice: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm">Enterprise Yearly ($)</label>
                                    <Input
                                        type="number"
                                        value={settings.yearlyEnterprisePrice}
                                        onChange={(e) => setSettings({ ...settings, yearlyEnterprisePrice: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSettings;
