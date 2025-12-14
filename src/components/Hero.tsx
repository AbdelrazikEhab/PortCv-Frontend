import { ContactInfo } from "@/types/resume";
import { Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  contact: ContactInfo;
  profileImage?: string;
}

export const Hero = ({ contact, profileImage }: HeroProps) => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-10 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_70%)]"></div>

      <div className="section-container text-center relative z-10">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {profileImage && (
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <img
                  src={profileImage}
                  alt={contact.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/30 shadow-xl transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full ring-4 ring-primary/20 ring-offset-4 ring-offset-background transition-all duration-500 group-hover:ring-primary/40"></div>
              </div>
            </div>
          )}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold gradient-text glow-effect">
            {contact.name}
          </h1>
          <p className="text-2xl sm:text-3xl text-accent font-semibold">
            {contact.title}
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span>{contact.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" />
              <a href={`mailto:${contact.email}`} className="hover:text-accent transition-colors">
                {contact.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-accent" />
              <span>{contact.phone[0]}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button asChild variant="default" size="lg" className="bg-primary hover:bg-primary-glow transition-all shadow-glow">
              <a href={`https://github.com/${contact.github}`} target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all">
              <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
