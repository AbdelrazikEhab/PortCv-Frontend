import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResumeList } from "@/contexts/ResumeListContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, FileText, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { RESUME_TEMPLATES } from "@/types/template";

export default function ResumeList() {
  const navigate = useNavigate();
  const { resumes, addResume, deleteResume, setCurrentResume } = useResumeList();
  const [newResumeName, setNewResumeName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateResume = () => {
    if (!newResumeName.trim()) {
      toast.error("Please enter a resume name");
      return;
    }
    const id = addResume(newResumeName.trim());
    setNewResumeName("");
    setIsDialogOpen(false);
    setCurrentResume(id);
    navigate("/edit-resume");
    toast.success("Resume created successfully!");
  };

  const handleEditResume = (id: string) => {
    setCurrentResume(id);
    navigate("/edit-resume");
  };

  const handleDeleteResume = (id: string, name: string) => {
    if (resumes.length === 1) {
      toast.error("You must have at least one resume");
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteResume(id);
      toast.success("Resume deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary-glow">
                <Plus className="w-4 h-4" />
                New Resume
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Resume</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Resume name (e.g., Software Engineer Resume)"
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleCreateResume()}
                />
                <Button onClick={handleCreateResume} className="w-full">
                  Create Resume
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">My Resumes</h1>
          <p className="text-muted-foreground">
            Manage your resumes with ATS-friendly templates and colors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => {
            const template = RESUME_TEMPLATES.find((t) => t.id === resume.template);
            return (
              <Card
                key={resume.id}
                className="p-6 hover:shadow-glow transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteResume(resume.id, resume.name)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">{resume.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>Template: {template?.name || "Classic"}</p>
                  <p className="text-xs">
                    Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <Button
                  onClick={() => handleEditResume(resume.id)}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Resume
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
