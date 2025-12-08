import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, Shield, Activity, FolderKanban, Lock, Database, CreditCard } from "lucide-react";
import api from "@/lib/api";

const MasterDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // For now, we'll just fetch users count from the users endpoint
            // In a real app, you'd have a dedicated stats endpoint
            const { data } = await api.get('/admin/users?limit=1');
            setStats({
                totalUsers: data.pagination.total,
                activeSubscriptions: 0, // Placeholder
                totalRevenue: 0, // Placeholder
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Master Admin Dashboard</h1>
                        <p className="text-muted-foreground">System overview and management</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/dashboard")}>
                        Back to App
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : stats.activeSubscriptions}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${loading ? "..." : stats.totalRevenue}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/admin/users")}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                User Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Manage users, roles, credits, and subscriptions.</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/admin/settings")}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                System Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Configure global settings, pricing, and feature flags.</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/admin/projects")}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderKanban className="h-5 w-5" />
                                Project Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Manage user projects, portfolios, and content.</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/admin/features")}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Feature Control
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Configure payment requirements for features.</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/admin/database")}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Database
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Manage database and clear data.</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:bg-accent/50 transition-colors cursor-pointer" onClick={() => navigate("/admin/payments")}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Gateway
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Configure Stripe and pricing.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MasterDashboard;
