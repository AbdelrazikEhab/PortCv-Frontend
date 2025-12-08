import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Loader2, Upload, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ResumeUploader = ({ onUploadComplete }: { onUploadComplete: () => void }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            // Parse resume using new API endpoint
            const { data } = await api.post('/resumes/parse', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Create new resume with parsed data
            await api.post('/resumes', {
                name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                template: 'classic',
                data: data.data, // The parsed data from AI
            });

            toast({
                title: "Success",
                description: "Resume uploaded and parsed successfully!",
            });
            setOpen(false);
            onUploadComplete();
        } catch (error) {
            console.error('Error uploading resume:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to parse resume. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Resume / LinkedIn PDF
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Resume</DialogTitle>
                    <DialogDescription>
                        Upload your existing resume (PDF/Word) or LinkedIn Profile PDF.
                        Our AI will extract your details automatically.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="resume-file">Resume File</Label>
                        <Input
                            id="resume-file"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={loading || !file}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Parsing...
                            </>
                        ) : (
                            "Upload & Parse"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
