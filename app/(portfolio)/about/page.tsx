import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-primary font-body">
      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden">
        <Image
          src="/images/about-hero.png"
          alt="Artist Studio"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-headline text-white drop-shadow-lg">
              Hi, I’m Rajvi
            </h1>
            <p className="text-white/95 font-label tracking-widest uppercase text-xs md:text-sm">
              I create art to slow down, explore ideas, and enjoy the creative process.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-16 md:space-y-32">
        {/* Statement Section */}
        <section className="text-center space-y-6 md:space-y-8">
          <h2 className="text-2xl md:text-4xl font-headline text-accent italic">
            "Art lets me slow down and enjoy the little details."
          </h2>
          <div className="h-px w-24 bg-neutral/20 mx-auto"></div>
          <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
            I’m someone who enjoys experimenting with colors, sketching ideas, and turning simple moments into art. This space is a collection of my creative journey, where I share paintings and sketches I genuinely enjoy making.
          </p>
        </section>

        {/* Biography Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div className="space-y-6">
            <h3 className="text-sm font-label uppercase tracking-widest text-neutral font-semibold">My Story</h3>
            <div className="space-y-4 text-accent/80 leading-relaxed">
              <p>
                Hi, I’m Rajvi — a developer, creative enthusiast, and someone who genuinely enjoys expressing ideas through art. Painting and sketching started as a simple hobby for me, but over time it became one of my favorite ways to relax, experiment, and bring imagination to life.
              </p>
              <p>
                I enjoy working with colors, trying different styles, and creating pieces inspired by everyday moments, aesthetics, and emotions. Whether it’s watercolor, pencil colors, or digital inspiration, I love exploring art without limiting myself to one style or technique.
              </p>
              <p>
                This website is a small window into my creative corner — a space where I share artworks, experiments, and pieces I’ve enjoyed making along the way. I’m still learning, growing, and discovering new ideas, and that’s what makes the process so exciting.
              </p>
            </div>
          </div>

          <div className="bg-secondary p-8 rounded-2xl border border-neutral/10 space-y-8">
            <div>
              <h4 className="text-xs font-label uppercase tracking-widest text-neutral mb-4 font-semibold">My Creative escapes</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-neutral/5 pb-2">
                  <span className="text-text-muted">Watercolors & Washes</span>
                  <span className="text-neutral text-xs">Soft & Calm</span>
                </li>
                <li className="flex justify-between border-b border-neutral/5 pb-2">
                  <span className="text-text-muted">Pencil Sketching</span>
                  <span className="text-neutral text-xs">Details & Textures</span>
                </li>
                <li className="flex justify-between border-b border-neutral/5 pb-2">
                  <span className="text-text-muted">Creative Coding & UI</span>
                  <span className="text-neutral text-xs">Tech & Art</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-label uppercase tracking-widest text-neutral mb-4 font-semibold">My Vibe</h4>
              <p className="text-sm text-text-muted leading-relaxed">
                I believe that art is less about perfection and more about enjoying the process. Every sketch and paint stroke in this collection is filled with curiosity, growth, and simply the joy of creating from imagination.
              </p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="text-center pt-16 border-t border-neutral/10">
          <p className="font-label text-sm text-neutral mb-6 tracking-widest uppercase font-semibold">
            Want to chat about art or collaborate on something creative?
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-accent text-primary px-10 py-4 rounded-full font-label hover:opacity-90 transition-all duration-300 shadow-sm"
          >
            Let’s Connect
          </a>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;