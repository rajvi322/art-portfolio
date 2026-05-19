"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

import Masonry from "react-masonry-css";

interface Artwork {
  _id: string;
  title: string;
  category: string;
  year: string;
  coverImage: string;
  images: string[];
  description?: string;
}

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["all", "watercolors", "pencilcolors", "acrylics", "oil colors"];

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/artworks");
      const data = await res.json();
      setArtworks(data);
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArtworks = activeCategory === "all"
    ? artworks
    : artworks.filter(art => art.category === activeCategory);

  const allImages = selectedArtwork ? [selectedArtwork.coverImage, ...(selectedArtwork.images || [])] : [];

  const breakpointCols = {
    default: 3,
    1024: 3,
    768: 2
  };

  return (
    <div className="space-y-12">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[10px] md:text-xs font-label uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${activeCategory === cat
              ? "text-text-header border-accent"
              : "text-text-muted border-transparent hover:text-text-header"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="columns-2 md:columns-3 gap-6 lg:gap-8 space-y-6 md:space-y-0">
          {[
            "h-80",
            "h-96",
            "h-64",
            "h-72",
            "h-80",
            "h-64"
          ].map((h, i) => (
            <div key={i} className={`w-full ${h} mb-6 bg-secondary/20 animate-pulse rounded-sm break-inside-avoid`}></div>
          ))}
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointCols}
          className="flex -ml-4 lg:-ml-6 w-auto"
          columnClassName="pl-4 lg:pl-6 bg-clip-padding"
        >
          {filteredArtworks.map((art) => (
            <div
              key={art._id}
              className="mb-4 lg:mb-6 group cursor-pointer bg-white border border-border rounded-xl shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
              onClick={() => {
                setSelectedArtwork(art);
                setActiveImageIndex(0);
              }}
            >
              <div className="relative overflow-hidden bg-secondary/10 rounded-t-xl">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 rounded-t-xl"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-text-header shadow-sm">
                    <Maximize2 size={16} />
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-3 px-3 pb-3">
                <h3 className="font-newsreader text-base text-text-header group-hover:text-accent transition-colors duration-300 font-semibold leading-snug">{art.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-label uppercase tracking-widest text-text-muted bg-secondary/35 px-2.5 py-0.5 rounded-md">
                    {art.category}
                  </span>
                  <span className="text-[10px] font-label text-text-muted">
                    {art.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Masonry>
      )}

      {/* Lightbox */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-[100] bg-primary flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">
          <button
            onClick={() => setSelectedArtwork(null)}
            className="absolute top-6 right-6 z-[110] p-2 hover:bg-secondary/10 rounded-full transition-colors"
          >
            <X size={24} className="text-text-header" />
          </button>

          {/* Image Display */}
          <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 lg:p-20 bg-secondary/5">
            <img
              src={allImages[activeImageIndex]}
              alt={selectedArtwork.title}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  className="absolute left-4 p-2 text-text-header hover:bg-secondary/10 rounded-full transition-colors"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 p-2 text-text-header hover:bg-secondary/10 rounded-full transition-colors"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="w-full md:w-[400px] bg-primary border-l border-neutral/10 p-6 md:p-12 flex flex-col justify-start md:justify-center space-y-5 md:space-y-8">
            <div className="space-y-2 md:space-y-3">
              <p className="text-[10px] font-label uppercase tracking-[0.3em] text-accent font-bold">
                {selectedArtwork.category}
              </p>
              <h2 className="text-2xl md:text-4xl font-newsreader text-text-header leading-tight">
                {selectedArtwork.title}
              </h2>
              <p className="text-xs md:text-sm font-label text-text-muted">
                Executed in {selectedArtwork.year}
              </p>
            </div>

            <div className="h-px w-12 bg-neutral/20"></div>

            <div className="space-y-2">
              <p className="text-xs md:text-sm leading-relaxed text-text-muted font-inter">
                {selectedArtwork.description || "No description provided for this piece."}
              </p>
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="pt-3 md:pt-6 space-y-3">
                <p className="text-[10px] font-label uppercase tracking-widest text-text-muted">Collection Detail Views</p>
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-square border-2 transition-all overflow-hidden ${
                        activeImageIndex === idx ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 md:pt-10">
              <button className="w-full py-3.5 bg-text-header text-primary font-label text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors">
                Inquire About Piece
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
