import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreHorizontal, Search, Trash2, Gift, Shield, Crown } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [creditsDialogOpen, setCreditsDialogOpen] = useState(false);
    const [creditsForm, setCreditsForm] = useState({ used: 0, limit: 0 });
    const [proDialogOpen, setProDialogOpen] = useState(false);
    const [proForm, setProForm] = useState({ plan: 'pro', days: 30, reason: '' });

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/admin/users?page=${page}&search=${search}`);
            setUsers(data.users);
            setTotalPages(data.pagination.pages);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch users",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

        try {
            await api.delete(`/admin/users/${userId}`);
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete user",
            });
        }
    };

    const handleOpenCreditsDialog = (user: any) => {
        setSelectedUser(user);
        const sub = user.subscriptions?.[0];
        setCreditsForm({
            used: sub?.aiCreditsUsed || 0,
            limit: sub?.aiCreditsLimit || 0,
        });
        setCreditsDialogOpen(true);
    };

    const handleUpdateCredits = async () => {
        if (!selectedUser) return;

        try {
            await api.put(`/admin/users/${selectedUser.id}/credits`, {
                aiCreditsUsed: Number(creditsForm.used),
                aiCreditsLimit: Number(creditsForm.limit),
            });
            toast({
                title: "Success",
                description: "Credits updated successfully",
            });
            setCreditsDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error updating credits:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update credits",
            });
        }
    };

    const handleOpenProDialog = (user: any) => {
        setSelectedUser(user);
        setProForm({ plan: 'pro', days: 30, reason: '' });
        setProDialogOpen(true);
    };

    const handleMakePro = async () => {
        if (!selectedUser) return;

        try {
            await api.post(`/admin/users/${selectedUser.id}/gift-access`, {
                plan: proForm.plan,
                days: Number(proForm.days),
                reason: proForm.reason || 'Admin upgrade',
            });
            toast({
                title: "Success",
                description: `User upgraded to ${proForm.plan} successfully`,
            });
            setProDialogOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error upgrading user:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to upgrade user",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground">View and manage users</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Credits (Used/Limit)</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.fullName || "N/A"}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {user.subscriptions?.[0]?.plan || "Free"}
                                        </TableCell>
                                        <TableCell>
                                            {user.subscriptions?.[0]?.aiCreditsUsed || 0} / {user.subscriptions?.[0]?.aiCreditsLimit || 0}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                                    <DropdownMenuItem onClick={() => handleOpenProDialog(user)}>
                                                        <Crown className="mr-2 h-4 w-4" />
                                                        Make Pro
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleOpenCreditsDialog(user)}>
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        Manage Credits
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </Button>
                </div>



                {/* Credits Dialog */}
                <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Manage AI Credits</DialogTitle>
                            <DialogDescription>
                                Update credit limits for {selectedUser?.email}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Credits Used</label>
                                    <Input
                                        type="number"
                                        value={creditsForm.used}
                                        onChange={(e) => setCreditsForm({ ...creditsForm, used: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Credit Limit</label>
                                    <Input
                                        type="number"
                                        value={creditsForm.limit}
                                        onChange={(e) => setCreditsForm({ ...creditsForm, limit: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCreditsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleUpdateCredits}>Update Credits</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Make Pro Dialog */}
                <Dialog open={proDialogOpen} onOpenChange={setProDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upgrade User to Pro</DialogTitle>
                            <DialogDescription>
                                Grant premium access to {selectedUser?.email}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Plan</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    value={proForm.plan}
                                    onChange={(e) => setProForm({ ...proForm, plan: e.target.value })}
                                >
                                    <option value="pro">Pro</option>
                                    <option value="enterprise">Enterprise</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Duration (days)</label>
                                <Input
                                    type="number"
                                    value={proForm.days}
                                    onChange={(e) => setProForm({ ...proForm, days: Number(e.target.value) })}
                                    placeholder="30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reason (optional)</label>
                                <Input
                                    value={proForm.reason}
                                    onChange={(e) => setProForm({ ...proForm, reason: e.target.value })}
                                    placeholder="e.g., Beta tester, Special promotion"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setProDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleMakePro} className="bg-gradient-to-r from-purple-600 to-blue-600">
                                <Crown className="w-4 h-4 mr-2" />
                                Upgrade User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default UserManagement;
