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

  // Inquiry form states
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryWebsite, setInquiryWebsite] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const categories = [
    "all",
    "watercolors",
    "pencilcolors",
    "acrylics",
    "oil colors",
    "sketches",
  ];

  useEffect(() => {
    fetchArtworks();
  }, []);

  // Reset inquiry form when lightbox state changes
  useEffect(() => {
    if (!selectedArtwork) {
      setShowInquiryForm(false);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryPhone("");
      setInquiryMessage("");
      setInquiryWebsite("");
      setSubmitStatus("idle");
    }
  }, [selectedArtwork]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtwork) return;

    setIsSending(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          subject: `Inquiry about "${selectedArtwork.title}"`,
          message: inquiryMessage,
          website_url: inquiryWebsite,
          artworkId: selectedArtwork._id,
        }),
      });

      if (res.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      setSubmitStatus("error");
    } finally {
      setIsSending(false);
    }
  };

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

  const filteredArtworks =
    activeCategory === "all"
      ? artworks
      : artworks.filter((art) => art.category === activeCategory);

  const allImages = selectedArtwork
    ? [selectedArtwork.coverImage, ...(selectedArtwork.images || [])]
    : [];

  const breakpointCols = {
    default: 3,
    1024: 3,
    768: 2,
  };

  return (
    <div className="space-y-12">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[10px] md:text-xs font-label uppercase tracking-[0.2em] transition-all pb-1 border-b-2 ${
              activeCategory === cat
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
          {["h-80", "h-96", "h-64", "h-72", "h-80", "h-64"].map((h, i) => (
            <div
              key={i}
              className={`w-full ${h} mb-6 bg-secondary/20 animate-pulse rounded-sm break-inside-avoid`}
            ></div>
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
                <h3 className="font-newsreader text-base text-text-header group-hover:text-accent transition-colors duration-300 font-semibold leading-snug">
                  {art.title}
                </h3>
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
        <div className="fixed inset-0 z-[100] bg-primary flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 overflow-y-auto md:overflow-hidden">
          <button
            onClick={() => setSelectedArtwork(null)}
            className="fixed md:absolute top-4 right-4 md:top-6 md:right-6 z-[110] p-2 bg-white/60 md:bg-transparent backdrop-blur-md md:backdrop-blur-none hover:bg-secondary/20 rounded-full transition-colors shadow-sm md:shadow-none"
          >
            <X size={24} className="text-text-header" />
          </button>

          {/* Image Display */}
          <div className="w-full min-h-[50vh] md:h-auto md:flex-1 relative flex items-center justify-center p-6 md:p-12 lg:p-20 bg-secondary/5">
            <img
              src={allImages[activeImageIndex]}
              alt={selectedArtwork.title}
              className="max-w-full max-h-full object-contain shadow-xl md:shadow-2xl rounded-sm"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === 0 ? allImages.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-2 md:left-4 p-2 text-text-header bg-white/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none hover:bg-secondary/20 rounded-full transition-colors shadow-sm md:shadow-none"
                >
                  <ChevronLeft size={24} className="md:w-8 md:h-8" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev === allImages.length - 1 ? 0 : prev + 1,
                    )
                  }
                  className="absolute right-2 md:right-4 p-2 text-text-header bg-white/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none hover:bg-secondary/20 rounded-full transition-colors shadow-sm md:shadow-none"
                >
                  <ChevronRight size={24} className="md:w-8 md:h-8" />
                </button>
              </>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="w-full md:w-[400px] bg-primary border-t md:border-t-0 md:border-l border-neutral/10 p-6 md:p-12 flex flex-col justify-start md:justify-center md:overflow-y-auto">
            {!showInquiryForm ? (
              <div className="space-y-5 md:space-y-8 animate-in fade-in duration-300 w-full">
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
                    {selectedArtwork.description ||
                      "No description provided for this piece."}
                  </p>
                </div>

                {/* Thumbnail Navigation */}
                {allImages.length > 1 && (
                  <div className="pt-3 md:pt-6 space-y-3">
                    <p className="text-[10px] font-label uppercase tracking-widest text-text-muted">
                      Collection Detail Views
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`aspect-square border-2 transition-all overflow-hidden ${
                            activeImageIndex === idx
                              ? "border-accent"
                              : "border-transparent opacity-50 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 md:pt-10">
                  <button
                    onClick={() => {
                      setShowInquiryForm(true);
                      setSubmitStatus("idle");
                    }}
                    className="w-full py-3.5 bg-text-header text-primary font-label text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
                  >
                    Inquire About Piece
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 md:space-y-6 animate-in slide-in-from-bottom-4 duration-300 w-full">
                {/* Back Button */}
                <button
                  onClick={() => setShowInquiryForm(false)}
                  className="flex items-center gap-1.5 text-[10px] text-text-muted hover:text-text-header font-label uppercase tracking-widest transition-colors mb-2"
                >
                  <span>← Back to details</span>
                </button>

                <div className="space-y-1">
                  <p className="text-[10px] font-label uppercase tracking-[0.2em] text-accent font-bold">
                    Inquiry
                  </p>
                  <h3 className="text-xl md:text-2xl font-newsreader text-text-header leading-tight">
                    {selectedArtwork.title}
                  </h3>
                </div>

                {submitStatus === "success" ? (
                  <div className="space-y-4 pt-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-6 h-6 animate-pulse"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-headline font-bold text-text-header text-base">
                        Message Sent!
                      </h4>
                      <p className="text-xs text-text-muted leading-relaxed font-body">
                        Thank you, {inquiryName}! Your message regarding this
                        piece has been successfully sent to Rajvi. We have also
                        sent a confirmation to {inquiryEmail}.
                      </p>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setShowInquiryForm(false);
                          setInquiryName("");
                          setInquiryEmail("");
                          setInquiryPhone("");
                          setInquiryMessage("");
                          setInquiryWebsite("");
                          setSubmitStatus("idle");
                        }}
                        className="w-full py-2.5 bg-text-header text-primary font-label text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-colors"
                      >
                        Back to Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleInquirySubmit}
                    className="space-y-4 pt-2"
                  >
                    {submitStatus === "error" && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-label border border-red-100">
                        Failed to submit inquiry. Please try again.
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[9px] font-label uppercase tracking-widest text-text-muted font-bold">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        disabled={isSending}
                        placeholder="John Doe"
                        className="w-full bg-secondary/20 border border-neutral/10 rounded-lg py-2 px-3 text-xs font-label outline-none focus:ring-1 focus:ring-accent/25 transition-all disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-label uppercase tracking-widest text-text-muted font-bold">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        disabled={isSending}
                        placeholder="john@example.com"
                        className="w-full bg-secondary/20 border border-neutral/10 rounded-lg py-2 px-3 text-xs font-label outline-none focus:ring-1 focus:ring-accent/25 transition-all disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-label uppercase tracking-widest text-text-muted font-bold">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        disabled={isSending}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-secondary/20 border border-neutral/10 rounded-lg py-2 px-3 text-xs font-label outline-none focus:ring-1 focus:ring-accent/25 transition-all disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-label uppercase tracking-widest text-text-muted font-bold">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        disabled={isSending}
                        placeholder="Write your note here about this piece..."
                        className="w-full bg-secondary/20 border border-neutral/10 rounded-lg py-2 px-3 text-xs font-label outline-none focus:ring-1 focus:ring-accent/25 transition-all resize-none disabled:opacity-50"
                      />
                    </div>
                    {/* Honeypot field */}
                    <div
                      className="absolute opacity-0 -z-50 h-0 w-0 overflow-hidden pointer-events-none"
                      aria-hidden="true"
                    >
                      <label>Website URL</label>
                      <input
                        type="text"
                        name="website_url"
                        value={inquiryWebsite}
                        onChange={(e) => setInquiryWebsite(e.target.value)}
                        tabIndex={-1}
                        autoComplete="nope"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={
                        isSending ||
                        !inquiryName.trim() ||
                        !inquiryEmail.trim() ||
                        !inquiryMessage.trim()
                      }
                      className="w-full py-3 bg-accent text-primary font-label text-[10px] uppercase tracking-[0.2em] hover:opacity-95 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Inquiry</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
