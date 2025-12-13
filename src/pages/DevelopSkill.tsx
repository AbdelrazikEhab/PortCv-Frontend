import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
    ArrowLeft,
    Sparkles,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Target,
    Lightbulb,
    Award,
    AlertCircle
} from "lucide-react";

interface Resume {
    id: string;
    name: string;
    data: any;
}

interface CareerAnalysis {
    careerLevel: string;
    yearsExperience: number;
    strengths: Array<{
        area: string;
        description: string;
        score: number;
    }>;
    weaknesses: Array<{
        area: string;
        description: string;
        severity: string;
    }>;
    redFlags: Array<{
        issue: string;
        example: string;
        fix: string;
    }>;
    careerPath: {
        currentRole: string;
        nextRoles: string[];
        timeline: string;
        requirements: string[];
    };
    skillsToDevelop: Array<{
        skill: string;
        priority: string;
        reason: string;
    }>;
    actionableAdvice: string[];
}

export default function DevelopSkill() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const { t, i18n } = useTranslation();

    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResumeId, setSelectedResumeId] = useState<string>("");
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const { data } = await api.get('/resumes');
            setResumes(data);
            if (data.length > 0) {
                setSelectedResumeId(data[0].id);
            }
        } catch (error) {
            console.error('Error fetching resumes:', error);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedResumeId) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select a resume to analyze",
            });
            return;
        }

        setAnalyzing(true);
        try {
            const selectedResume = resumes.find(r => r.id === selectedResumeId);
            const { data } = await api.post('/ai/career-analysis', {
                resume: selectedResume?.data,
                language: i18n.language
            });

            if (data.success) {
                setAnalysis(data.data);
                toast({
                    title: "Analysis Complete!",
                    description: "Your career analysis is ready",
                });
            }
        } catch (error: any) {
            console.error('Error analyzing career:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.error || "Failed to analyze career",
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case 'low': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-muted-foreground bg-muted/10 border-border/20';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'destructive';
            case 'medium': return 'default';
            case 'low': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto">
                <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Button>

                <div className="mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
                        Career Analysis & Guidance
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Get AI-powered insights on your strengths, areas to improve, and personalized career development path.
                    </p>
                </div>

                {/* Resume Selector */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Analyze Your Career
                        </CardTitle>
                        <CardDescription>
                            Select a resume to get personalized career insights and development recommendations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {resumes.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No resumes found. Create one to get started!</p>
                                <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="text-sm font-medium mb-2 block">Select Resume</label>
                                        <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a resume" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {resumes.map((resume) => (
                                                    <SelectItem key={resume.id} value={resume.id}>
                                                        {resume.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={analyzing || !selectedResumeId}
                                        className="bg-gradient-to-r from-primary to-purple-600"
                                    >
                                        {analyzing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                Analyze Career
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Analysis Results */}
                {analysis && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Career Overview */}
                        <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{analysis.careerPath.currentRole}</h3>
                                        <p className="text-muted-foreground">
                                            {analysis.yearsExperience} years experience • {analysis.careerLevel} Level
                                        </p>
                                    </div>
                                    <Badge className="text-lg px-4 py-2">{analysis.careerLevel}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Strengths */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-500">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Your Strengths
                                </CardTitle>
                                <CardDescription>What you're doing well</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {analysis.strengths.map((strength, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{strength.area}</span>
                                            <span className="text-sm text-green-500 font-semibold">{strength.score}%</span>
                                        </div>
                                        <Progress value={strength.score} className="h-2" />
                                        <p className="text-sm text-muted-foreground">{strength.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Weaknesses */}
                        {analysis.weaknesses.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-orange-500">
                                        <AlertTriangle className="w-5 h-5" />
                                        Areas to Improve
                                    </CardTitle>
                                    <CardDescription>Skills and experience gaps to address</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {analysis.weaknesses.map((weakness, idx) => (
                                        <div key={idx} className={`p-4 rounded-lg border ${getSeverityColor(weakness.severity)}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="font-medium">{weakness.area}</span>
                                                <Badge variant="outline" className={getSeverityColor(weakness.severity)}>
                                                    {weakness.severity}
                                                </Badge>
                                            </div>
                                            <p className="text-sm">{weakness.description}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Red Flags */}
                        {analysis.redFlags.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-red-500">
                                        <AlertCircle className="w-5 h-5" />
                                        Red Flags & Mistakes
                                    </CardTitle>
                                    <CardDescription>Common issues found in your CV</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {analysis.redFlags.map((flag, idx) => (
                                        <div key={idx} className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                                            <h4 className="font-semibold text-red-500 mb-2">⚠️ {flag.issue}</h4>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium">Example:</span>
                                                    <p className="text-muted-foreground italic">"{flag.example}"</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-green-500">✓ How to fix:</span>
                                                    <p className="text-muted-foreground">{flag.fix}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Career Path */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-500">
                                    <Target className="w-5 h-5" />
                                    Your Career Path
                                </CardTitle>
                                <CardDescription>Recommended next steps in your career journey</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Next Roles</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.careerPath.nextRoles.map((role, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-sm">
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Timeline</h4>
                                    <p className="text-muted-foreground">{analysis.careerPath.timeline}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Requirements</h4>
                                    <ul className="space-y-1">
                                        {analysis.careerPath.requirements.map((req, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="text-primary mt-0.5">•</span>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills to Develop */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-purple-500">
                                    <TrendingUp className="w-5 h-5" />
                                    Skills to Develop
                                </CardTitle>
                                <CardDescription>Prioritized skills for your career growth</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {analysis.skillsToDevelop.map((skill, idx) => (
                                    <div key={idx} className="p-4 rounded-lg border border-border/50 bg-card/50">
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="font-medium">{skill.skill}</span>
                                            <Badge variant={getPriorityColor(skill.priority) as any}>
                                                {skill.priority} priority
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{skill.reason}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Actionable Advice */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-500">
                                    <Lightbulb className="w-5 h-5" />
                                    Actionable Advice
                                </CardTitle>
                                <CardDescription>Concrete steps to improve your profile</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-3">
                                    {analysis.actionableAdvice.map((advice, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm pt-0.5">{advice}</span>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
