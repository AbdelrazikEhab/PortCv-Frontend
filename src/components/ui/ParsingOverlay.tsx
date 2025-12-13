import { FileText, Sparkles, Scan } from "lucide-react";
import { useEffect, useState } from "react";

interface ParsingOverlayProps {
    isVisible: boolean;
}

export const ParsingOverlay = ({ isVisible }: ParsingOverlayProps) => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
            <div className="relative flex flex-col items-center max-w-sm text-center p-8">

                {/* Animated Scanner Container */}
                <div className="relative w-32 h-40 mb-8 bg-card rounded-xl border border-border shadow-2xl flex items-center justify-center overflow-hidden">
                    {/* Document Icon */}
                    <FileText className="w-16 h-16 text-muted-foreground/50" />

                    {/* Scanning Beam */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/0 via-primary/20 to-primary/40 animate-[scan_2s_ease-in-out_infinite]" />

                    {/* Digital Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]" />

                    {/* Overlay Glow */}
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/20" />
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        <span className="text-lg">AI Analysis in Progress{dots}</span>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>

                    <p className="text-muted-foreground text-sm">
                        Our AI is reading your resume, extracting key skills, and structuring your profile for maximum impact.
                    </p>
                </div>

                {/* Status Indicators (Fake progress) */}
                <div className="mt-8 grid grid-cols-3 gap-2 w-full">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1 rounded-full bg-muted overflow-hidden">
                            <div
                                className="h-full bg-primary/80 animate-[progress_2s_ease-in-out_infinite]"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        </div>
                    ))}
                </div>

            </div>

            <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); opacity: 0; }
          50% { transform: translateY(100%); opacity: 1; }
        }
        @keyframes progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0); }
            100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
};
