interface AboutProps {
  summary: string;
}

export const About = ({ summary }: AboutProps) => {
  return (
    <section id="about" className="section-container">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 gradient-text text-center">
          About Me
        </h2>
        <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-card hover:shadow-glow transition-all duration-500">
          <p className="text-foreground/90 leading-relaxed text-base sm:text-lg">
            {summary}
          </p>
        </div>
      </div>
    </section>
  );
};
