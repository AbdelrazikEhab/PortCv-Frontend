import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Database, Trash2, Download, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DatabaseManagement = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [stats, setStats] = useState({
        users: 0,
        resumes: 0,
        portfolios: 0,
        transactions: 0,
    });
    const [loading, setLoading] = useState(true);
    const [confirmText, setConfirmText] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteType, setDeleteType] = useState<string>("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/database/stats');
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch database statistics",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClearData = async (type: string) => {
        if (confirmText !== "DELETE") {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please type DELETE to confirm",
            });
            return;
        }

        try {
            await api.delete(`/admin/database/clear/${type}`);
            toast({
                title: "Success",
                description: `${type} data cleared successfully`,
            });
            setDeleteDialogOpen(false);
            setConfirmText("");
            fetchStats();
        } catch (error) {
            console.error("Error clearing data:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to clear data",
            });
        }
    };

    const handleExportData = async () => {
        try {
            const { data } = await api.get('/admin/database/export');
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `database-export-${new Date().toISOString()}.json`;
            a.click();
            toast({
                title: "Success",
                description: "Database exported successfully",
            });
        } catch (error) {
            console.error("Error exporting data:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to export data",
            });
        }
    };

    const openDeleteDialog = (type: string) => {
        setDeleteType(type);
        setConfirmText("");
        setDeleteDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Database Management</h1>
                            <p className="text-muted-foreground">Manage database and clear data</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={fetchStats} variant="outline" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                        <Button onClick={handleExportData} variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{loading ? "..." : stats.users}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Resumes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{loading ? "..." : stats.resumes}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Portfolios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{loading ? "..." : stats.portfolios}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{loading ? "..." : stats.transactions}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Danger Zone */}
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Irreversible actions. Use with extreme caution.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                            <div>
                                <h3 className="font-medium">Clear All Resumes</h3>
                                <p className="text-sm text-muted-foreground">Delete all resume data from the database</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => openDeleteDialog("resumes")}
                                className="gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear Resumes
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                            <div>
                                <h3 className="font-medium">Clear All Portfolios</h3>
                                <p className="text-sm text-muted-foreground">Delete all portfolio data from the database</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => openDeleteDialog("portfolios")}
                                className="gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear Portfolios
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                            <div>
                                <h3 className="font-medium">Clear All Transactions</h3>
                                <p className="text-sm text-muted-foreground">Delete all transaction history</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => openDeleteDialog("transactions")}
                                className="gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear Transactions
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                            <div>
                                <h3 className="font-medium">Clear All Data</h3>
                                <p className="text-sm text-muted-foreground">Delete everything except users and subscriptions</p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => openDeleteDialog("all")}
                                className="gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear All
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="w-5 h-5" />
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete all {deleteType} data from the database.
                                <div className="mt-4 space-y-2">
                                    <p className="font-medium">Type <span className="font-mono bg-destructive/10 px-1">DELETE</span> to confirm:</p>
                                    <Input
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        placeholder="DELETE"
                                        className="font-mono"
                                    />
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => handleClearData(deleteType)}
                                disabled={confirmText !== "DELETE"}
                                className="bg-destructive hover:bg-destructive/90"
                            >
                                Delete {deleteType}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default DatabaseManagement;
