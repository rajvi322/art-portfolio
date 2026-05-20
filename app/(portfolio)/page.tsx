import Gallery from "@/components/Gallery";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-primary font-inter text-text-header">
      {/* Hero Section */}
      <section className="pt-12 md:pt-24 pb-16 md:pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-newsreader font-medium tracking-tight leading-[1.1]">
              Colors, Calm & <br />
              <span className="italic text-accent">Creativity</span>
            </h1>
            <p className="max-w-2xl mx-auto text-text-muted text-xs md:text-sm font-label uppercase tracking-[0.2em] pt-2">
              A small collection of artworks, sketches, and creative moments
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="px-6 pb-16 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <Gallery />
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-12 md:py-20 px-6 bg-primary">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl font-newsreader font-bold tracking-tight">
              RS Artelier
            </h2>
            <p className="text-[10px] font-label uppercase tracking-widest text-text-muted max-w-xs leading-loose">
              Art, colors, and creativity from my little corner.
            </p>
          </div>

          <div className="flex gap-6 md:gap-12 text-[10px] font-label uppercase tracking-[0.3em] text-text-muted flex-wrap justify-center md:justify-end">
            <a
              href="https://www.instagram.com/rs.artelier"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://youtube.com/@rsartelier?si=dm6fW_vYEbb6sjMS"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://pin.it/4VZ7pX357"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              Pinterest
            </a>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-label uppercase tracking-widest text-text-muted">
              © {new Date().getFullYear()} RS Artelier
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
