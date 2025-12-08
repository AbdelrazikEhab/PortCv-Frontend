import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { Loader2, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const InterviewPrep = ({ resumeText }: { resumeText?: string }) => {
    const [jobDescription, setJobDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<string>("");
    const { toast } = useToast();

    const handleGenerate = async () => {
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
            const { data } = await api.post('/ai/interview-prep', {
                resume: resumeText,
                jobDescription,
            });

            // Format the questions for display
            const questionsList = data.questions || [];
            if (!Array.isArray(questionsList)) {
                throw new Error('Invalid response format');
            }

            const formattedQuestions = questionsList.map((q: any, i: number) =>
                `Q${i + 1}: ${q.question}\n\nTips: ${q.answerTips}\n\n`
            ).join('---\n\n');

            setQuestions(formattedQuestions);
        } catch (error) {
            console.error('Error generating interview questions:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate questions. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-orange-600" />
                    AI Interview Prep
                </CardTitle>
                <CardDescription>
                    Get predicted questions and suggested answers.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Job Description</Label>
                    <Textarea
                        placeholder="Paste the job description..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={loading || !jobDescription}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Questions...
                        </>
                    ) : (
                        "Start Prep"
                    )}
                </Button>

                {questions && (
                    <div className="space-y-4 animate-in fade-in-50">
                        <div className="min-h-[300px] p-4 rounded-md border bg-muted/50 whitespace-pre-wrap text-sm leading-relaxed">
                            {questions}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
