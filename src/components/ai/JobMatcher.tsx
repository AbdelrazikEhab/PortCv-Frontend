import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface JobMatchResult {
    score: number;
    matchingKeywords: string[];
    missingKeywords: string[];
    advice: string;
}

export const JobMatcher = ({ resumeText }: { resumeText?: string }) => {
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<JobMatchResult | null>(null);
    const { toast } = useToast();

    const handleMatch = async () => {
        if (!jobDescription) {
            toast({
                variant: "destructive",
                title: "Required",
                description: "Please enter a job description",
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
            const { data } = await api.post('/ai/job-match', {
                resume: resumeText,
                jobDescription,
            });

            setResult(data);
        } catch (error) {
            console.error('Error matching job:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to analyze job match. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🌟 AI Job Match
                </CardTitle>
                <CardDescription>
                    Paste a job description to see how well your resume matches.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Job Description</Label>
                    <Textarea
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[150px]"
                    />
                </div>

                <Button
                    onClick={handleMatch}
                    disabled={loading || !jobDescription}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        "Analyze Match"
                    )}
                </Button>

                {result && (
                    <div className="space-y-6 animate-in fade-in-50">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Match Score</span>
                                <span>{result.score}%</span>
                            </div>
                            <Progress value={result.score} className="h-2" />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    Matching Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.matchingKeywords?.map((kw, i) => (
                                        <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium flex items-center gap-2 text-red-600">
                                    <XCircle className="h-4 w-4" />
                                    Missing Keywords
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords?.map((kw, i) => (
                                        <span key={i} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                            {kw}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted p-4 rounded-lg space-y-2">
                            <h4 className="font-medium flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                AI Advice
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {result.advice}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
