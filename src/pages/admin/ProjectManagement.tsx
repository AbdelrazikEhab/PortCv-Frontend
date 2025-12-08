import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Trash2, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Project {
    id: string;
    name: string;
    url?: string;
    userId: string;
    user?: {
        email: string;
        fullName?: string;
    };
    createdAt: string;
}

const ProjectManagement = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/projects');
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch projects",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete project "${name}"?`)) return;

        try {
            await api.delete(`/admin/projects/${id}`);
            toast({
                title: "Success",
                description: "Project deleted successfully",
            });
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete project",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
                        <p className="text-muted-foreground">Manage all user projects and portfolios</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={fetchProjects}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/admin")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No projects found
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project Name</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">{project.name}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{project.user?.fullName || "N/A"}</div>
                                                    <div className="text-sm text-muted-foreground">{project.user?.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {project.url ? (
                                                    <a
                                                        href={project.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        View <Eye className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{format(new Date(project.createdAt), "MMM d, yyyy")}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteProject(project.id, project.name)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProjectManagement;
