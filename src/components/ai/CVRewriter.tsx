import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import { Loader2, Wand2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CVRewriter = ({ initialText = "" }: { initialText?: string }) => {
    const [text, setText] = useState(initialText);
    const [section, setSection] = useState("summary");
    const [rewrittenText, setRewrittenText] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleRewrite = async () => {
        if (!text) {
            toast({
                variant: "destructive",
                title: "Required",
                description: "Please enter text to rewrite",
            });
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/ai/rewrite', {
                text,
                type: section,
                instructions: `Rewrite this ${section} to be more professional and impactful.`,
            });

            setRewrittenText(data.content);
        } catch (error) {
            console.error('Error rewriting text:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to rewrite text. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(rewrittenText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: "Copied",
            description: "Rewritten text copied to clipboard",
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-purple-600" />
                    AI CV Rewriter
                </CardTitle>
                <CardDescription>
                    Polish your professional summary, experience, or skills with AI.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Select value={section} onValueChange={setSection}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="summary">Professional Summary</SelectItem>
                            <SelectItem value="experience">Experience Bullet Point</SelectItem>
                            <SelectItem value="skills">Skills Description</SelectItem>
                            <SelectItem value="cover_letter">Cover Letter Paragraph</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Original Text</label>
                        <Textarea
                            placeholder="Paste your text here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="min-h-[200px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium flex justify-between items-center">
                            Rewritten Version
                            {rewrittenText && (
                                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            )}
                        </label>
                        <div className="min-h-[200px] p-3 rounded-md border bg-muted/50 whitespace-pre-wrap text-sm">
                            {rewrittenText || <span className="text-muted-foreground italic">AI output will appear here...</span>}
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleRewrite}
                    disabled={loading || !text}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Rewriting...
                        </>
                    ) : (
                        "Rewrite with AI"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
};
