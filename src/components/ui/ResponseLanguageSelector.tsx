import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

interface ResponseLanguageSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
}

export const ResponseLanguageSelector = ({ value, onValueChange }: ResponseLanguageSelectorProps) => {
    return (
        <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium hidden sm:inline text-muted-foreground">AI Response:</span>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-[110px] h-8 text-xs">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};
