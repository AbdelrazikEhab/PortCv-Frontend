import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Loader2, PenTool, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CoverLetterGen = ({ resumeText }: { resumeText?: string }) => {
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!jobTitle) {
            toast({
                variant: "destructive",
                title: "Required",
                description: "Please enter a job title",
            });
            return;
        }

        if (!resumeText) {
            toast({
                variant: "destructive",
                title: "Required",
                description: "Please upload or select a resume first",
            });
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/ai/cover-letter', {
                resume: resumeText,
                jobDescription: `Job Title: ${jobTitle}\n\n${jobDescription}`,
            });

            setCoverLetter(data.content);
        } catch (error) {
            console.error('Error generating cover letter:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate cover letter. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: "Copied",
            description: "Cover letter copied to clipboard",
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-blue-600" />
                    AI Cover Letter Generator
                </CardTitle>
                <CardDescription>
                    Generate a tailored cover letter in seconds.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                        placeholder="e.g. Senior Frontend Developer"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Job Description (Optional)</Label>
                    <Textarea
                        placeholder="Paste the job description for better personalization..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !jobTitle}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        "Generate Cover Letter"
                    )}
                </Button>

                {coverLetter && (
                    <div className="space-y-2 animate-in fade-in-50">
                        <label className="text-sm font-medium flex justify-between items-center">
                            Generated Letter
                            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </label>
                        <div className="min-h-[300px] p-4 rounded-md border bg-muted/50 whitespace-pre-wrap text-sm leading-relaxed">
                            {coverLetter}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
