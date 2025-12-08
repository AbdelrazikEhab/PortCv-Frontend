import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        atsScorePrice: 0.10,
        resumeParsePrice: 0.05,
        defaultTrialDays: 7,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/admin/system');
            setSettings(data);
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch system settings",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await api.put('/admin/system', settings);
            setSettings(data);
            toast({
                title: "Success",
                description: "System settings updated successfully",
            });
        } catch (error) {
            console.error("Error updating settings:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update system settings",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading settings...</div>;
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                            <p className="text-muted-foreground">Configure global application settings</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>General Configuration</CardTitle>
                            <CardDescription>Manage global system behavior</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Maintenance Mode</span>
                                        {settings.maintenanceMode && (
                                            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3" /> Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Disable access for non-admin users
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.maintenanceMode}
                                    onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Default Trial Days</label>
                                <Input
                                    type="number"
                                    value={settings.defaultTrialDays}
                                    onChange={(e) => setSettings({ ...settings, defaultTrialDays: Number(e.target.value) })}
                                />
                                <p className="text-xs text-muted-foreground">Number of days for new trial accounts</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Pricing</CardTitle>
                            <CardDescription>Set base costs for pay-per-use features</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">ATS Score Check ($)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={settings.atsScorePrice}
                                        onChange={(e) => setSettings({ ...settings, atsScorePrice: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Resume Parse ($)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={settings.resumeParsePrice}
                                        onChange={(e) => setSettings({ ...settings, resumeParsePrice: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
