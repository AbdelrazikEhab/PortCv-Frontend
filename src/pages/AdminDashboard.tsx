import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Loader2,
    Search,
    Gift,
    Settings,
    Users,
    CreditCard,
    ArrowLeft,
    Crown,
    Zap,
    Sparkles,
    TrendingUp,
    DollarSign,
    BarChart3
} from "lucide-react";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Gift Access State
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [giftPlan, setGiftPlan] = useState("pro");
    const [giftDays, setGiftDays] = useState("30");
    const [giftReason, setGiftReason] = useState("");
    const [giftDialogOpen, setGiftDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchPlans();
        fetchSettings();
    }, [page, search]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/admin/users?page=${page}&limit=10&search=${search}`);
            setUsers(data.users);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const { data } = await api.get("/admin/pricing/plans");
            setPlans(data);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const { data } = await api.get("/admin/pricing/settings");
            setSettings(data);
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    const handleGiftAccess = async () => {
        if (!selectedUser) return;

        try {
            await api.post(`/admin/users/${selectedUser.id}/gift-access`, {
                plan: giftPlan,
                days: parseInt(giftDays),
                reason: giftReason,
            });
            toast.success(`Access gifted to ${selectedUser.fullName || selectedUser.email}`);
            setGiftDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error gifting access:", error);
            toast.error("Failed to gift access");
        }
    };

    // Stats
    const totalUsers = users.length;
    const proUsers = users.filter(u => u.subscriptions?.[0]?.plan === 'pro').length;
    const enterpriseUsers = users.filter(u => u.subscriptions?.[0]?.plan === 'enterprise').length;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                <Crown className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Admin Panel</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="hidden sm:inline">{user?.email}</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">{totalUsers}</p>
                                <p className="text-sm text-muted-foreground">Total Users</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">{proUsers}</p>
                                <p className="text-sm text-muted-foreground">Pro Users</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">{enterpriseUsers}</p>
                                <p className="text-sm text-muted-foreground">Enterprise</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Crown className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/50 border border-border/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-2xl font-bold">$0</p>
                                <p className="text-sm text-muted-foreground">Revenue</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md p-1 bg-card/50 border border-border/50 rounded-xl mb-8">
                        <TabsTrigger value="users" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">Users</span>
                        </TabsTrigger>
                        <TabsTrigger value="plans" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <CreditCard className="w-4 h-4" />
                            <span className="hidden sm:inline">Plans</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="space-y-6">
                        {/* Search */}
                        <div className="flex justify-between items-center gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Search users..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-11 bg-card/50 border-border/50"
                                />
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="rounded-2xl bg-card/50 border border-border/50 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/50 hover:bg-transparent">
                                        <TableHead className="text-muted-foreground">User</TableHead>
                                        <TableHead className="text-muted-foreground">Status</TableHead>
                                        <TableHead className="text-muted-foreground">Plan</TableHead>
                                        <TableHead className="text-muted-foreground">Joined</TableHead>
                                        <TableHead className="text-muted-foreground">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                                    <p className="text-muted-foreground">Loading users...</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Users className="w-8 h-8 text-muted-foreground" />
                                                    <p className="text-muted-foreground">No users found</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((u) => (
                                            <TableRow key={u.id} className="border-border/50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium">
                                                            {(u.fullName?.[0] || u.email?.[0] || '?').toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{u.fullName || "N/A"}</p>
                                                            <p className="text-xs text-muted-foreground">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.subscriptions?.[0]?.status === 'active'
                                                            ? 'bg-emerald-500/10 text-emerald-500'
                                                            : u.subscriptions?.[0]?.status === 'trialing'
                                                                ? 'bg-blue-500/10 text-blue-500'
                                                                : 'bg-muted text-muted-foreground'
                                                        }`}>
                                                        {u.subscriptions?.[0]?.status || 'Free'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {u.subscriptions?.[0]?.plan === 'pro' && <Zap className="w-4 h-4 text-purple-500" />}
                                                        {u.subscriptions?.[0]?.plan === 'enterprise' && <Crown className="w-4 h-4 text-amber-500" />}
                                                        {!u.subscriptions?.[0]?.plan && <Sparkles className="w-4 h-4 text-muted-foreground" />}
                                                        <span className="capitalize">{u.subscriptions?.[0]?.plan || 'Free'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog open={giftDialogOpen} onOpenChange={setGiftDialogOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="gap-2 border-border/50 hover:border-primary/30"
                                                                onClick={() => setSelectedUser(u)}
                                                            >
                                                                <Gift className="w-4 h-4" />
                                                                <span className="hidden sm:inline">Gift</span>
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Gift Premium Access</DialogTitle>
                                                                <DialogDescription>
                                                                    Grant temporary premium access to {selectedUser?.fullName || selectedUser?.email}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="space-y-2">
                                                                    <Label>Plan</Label>
                                                                    <Select value={giftPlan} onValueChange={setGiftPlan}>
                                                                        <SelectTrigger className="bg-muted/50">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {plans.map((p) => (
                                                                                <SelectItem key={p.name} value={p.name}>
                                                                                    {p.displayName}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Duration</Label>
                                                                    <Select value={giftDays} onValueChange={setGiftDays}>
                                                                        <SelectTrigger className="bg-muted/50">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="7">7 Days</SelectItem>
                                                                            <SelectItem value="14">14 Days</SelectItem>
                                                                            <SelectItem value="30">30 Days</SelectItem>
                                                                            <SelectItem value="90">3 Months</SelectItem>
                                                                            <SelectItem value="365">1 Year</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Reason (optional)</Label>
                                                                    <Input
                                                                        placeholder="e.g., Customer support compensation"
                                                                        value={giftReason}
                                                                        onChange={(e) => setGiftReason(e.target.value)}
                                                                        className="bg-muted/50"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button variant="outline" onClick={() => setGiftDialogOpen(false)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={handleGiftAccess} className="bg-gradient-to-r from-primary to-purple-600">
                                                                    Grant Access
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-4 text-sm text-muted-foreground">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="plans">
                        <div className="p-8 rounded-2xl bg-card/50 border border-border/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Pricing Plans</h3>
                                    <p className="text-sm text-muted-foreground">Manage subscription tiers</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-3 gap-4">
                                {plans.map((plan) => (
                                    <div key={plan.name} className="p-6 rounded-xl border border-border/50 bg-background/50">
                                        <h4 className="font-bold mb-2">{plan.displayName}</h4>
                                        <p className="text-2xl font-bold mb-4">
                                            ${plan.price?.monthly || 0}
                                            <span className="text-sm text-muted-foreground">/mo</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings">
                        <div className="p-8 rounded-2xl bg-card/50 border border-border/50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">System Settings</h3>
                                    <p className="text-sm text-muted-foreground">Configure pricing and features</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-xl border border-border/50 bg-background/50">
                                    <Label className="text-sm text-muted-foreground">Resume Parse Price</Label>
                                    <p className="text-2xl font-bold mt-1">${settings?.resumeParsePrice || 0}</p>
                                </div>
                                <div className="p-6 rounded-xl border border-border/50 bg-background/50">
                                    <Label className="text-sm text-muted-foreground">ATS Score Price</Label>
                                    <p className="text-2xl font-bold mt-1">${settings?.atsScorePrice || 0}</p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
