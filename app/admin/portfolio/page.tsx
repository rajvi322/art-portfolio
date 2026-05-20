"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Image as ImageIcon, Upload, Search, ChevronLeft, ChevronRight, X, AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { AdminHeader } from "@/components/ui/AdminHeader";

interface Artwork {
  _id: string;
  title: string;
  category: "watercolors" | "pencilcolors" | "acrylics" | "oil colors";
  year: string;
  coverImage: string;
  images: string[];
  description?: string;
  status: string;
}

const PortfolioAdmin = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "watercolors" as "watercolors" | "pencilcolors" | "acrylics" | "oil colors" | "",
    year: new Date().getFullYear().toString(),
    coverImage: "",
    images: [] as string[],
    description: "",
    status: "Published"
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [artworkToDelete, setArtworkToDelete] = useState<Artwork | null>(null);
  const [isDeletingArtwork, setIsDeletingArtwork] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);


  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/artworks?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });
      const data = await res.json();
      setArtworks(data);
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.title.trim()) newErrors.title = true;
    if (!formData.category) newErrors.category = true;
    if (!formData.coverImage) newErrors.coverImage = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isRequiredFieldsFilled || !validateForm()) {
      return;
    }

    if (editingArtwork && !isFormChanged()) {
      return;
    }

    const url = editingArtwork ? `/api/artworks/${editingArtwork._id}` : "/api/artworks";
    const method = editingArtwork ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEditingArtwork(null);
        setErrors({});
        setFormData({
          title: "",
          category: "watercolors",
          year: new Date().getFullYear().toString(),
          coverImage: "",
          images: [],
          description: "",
          status: "Published"
        });
        fetchArtworks();
      }
    } catch (error) {
      console.error("Error saving artwork:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!artworkToDelete) return;
    setIsDeletingArtwork(true);
    try {
      const res = await fetch(`/api/artworks/${artworkToDelete._id}`, { method: "DELETE" });
      if (res.ok) {
        fetchArtworks();
        setArtworkToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
    } finally {
      setIsDeletingArtwork(false);
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setFormData({
      title: artwork.title,
      category: artwork.category,
      year: artwork.year,
      coverImage: artwork.coverImage,
      images: artwork.images || [],
      description: artwork.description || "",
      status: artwork.status
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = async (file: File, isCover: boolean = true) => {
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.url) {
        if (isCover) {
          setFormData(prev => ({ ...prev, coverImage: result.url }));
          if (errors.coverImage) setErrors(prev => ({ ...prev, coverImage: false }));
        } else {
          setFormData(prev => ({ ...prev, images: [...prev.images, result.url] }));
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = true) => {
    if (e.target.files?.[0]) {
      handleFileUpload(e.target.files[0], isCover);
    }
  };

  const onDrop = (e: React.DragEvent, isCover: boolean = true) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0], isCover);
    }
  };

  const isRequiredFieldsFilled =
    formData.title.trim() !== "" &&
    formData.category !== "" &&
    formData.coverImage !== "";

  const isFormChanged = () => {
    if (!editingArtwork) return false;
    return (
      formData.title !== editingArtwork.title ||
      formData.category !== editingArtwork.category ||
      formData.year !== editingArtwork.year ||
      formData.coverImage !== editingArtwork.coverImage ||
      (formData.description || "") !== (editingArtwork.description || "") ||
      formData.status !== editingArtwork.status ||
      JSON.stringify(formData.images) !== JSON.stringify(editingArtwork.images || [])
    );
  };

  const filteredArtworks = artworks.filter(art =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredArtworks.length / ITEMS_PER_PAGE) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedArtworks = filteredArtworks.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );
  const rangeStart = filteredArtworks.length === 0 ? 0 : (activePage - 1) * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min(activePage * ITEMS_PER_PAGE, filteredArtworks.length);

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <AdminHeader
        title="Works Management"
        description="Manage your digital archive. Add new pieces to your portfolio or refine existing metadata."
      />

      {/* Creation/Edit Form Section */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="space-y-6">
          {/* Cover Image Upload */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, true)}
            className={`bg-white border ${errors.coverImage ? 'border-red-500' : 'border-border'} rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px] hover:border-accent transition-colors group cursor-pointer`}
            onClick={() => document.getElementById("coverInput")?.click()}
          >
            <input
              id="coverInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => onFileSelect(e, true)}
            />
            {formData.coverImage ? (
              <div className="relative w-full h-48 rounded overflow-hidden group/img">
                <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, coverImage: "" }); }}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
                >
                  <X size={12} />
                </button>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-[10px] text-white font-label uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full">Change Cover</span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center text-text-muted group-hover:text-accent transition-colors">
                  <Upload size={24} />
                </div>
                <div>
                  <h3 className="font-headline text-base font-medium mb-1">Set Cover Image</h3>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest">Main display piece</p>
                </div>
              </>
            )}
          </div>

          {/* Gallery Images Upload */}
          <div className="bg-white border border-border rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">Gallery Collection</label>
                <p className="text-[9px] text-text-muted mt-1 uppercase tracking-tighter">Additional detail shots and angles</p>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById("galleryInput")?.click()}
                className="flex items-center gap-2 px-3 py-1.5 border border-border rounded text-[10px] font-label uppercase tracking-widest text-text-header hover:bg-secondary/5 transition-colors"
              >
                <Upload size={12} />
                <span>Bulk Upload</span>
              </button>
              <input
                id="galleryInput"
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach(file => handleFileUpload(file, false));
                  }
                }}
              />
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files) {
                  Array.from(e.dataTransfer.files).forEach(file => handleFileUpload(file, false));
                }
              }}
              className="grid grid-cols-4 gap-3 min-h-[120px] p-4 border-2 border-dashed border-border rounded-lg group hover:border-accent/20 transition-colors"
            >
              {formData.images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded overflow-hidden border border-border group/item">
                  <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) })}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black transition-colors opacity-0 group-hover/item:opacity-100"
                  >
                    <X size={8} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => document.getElementById("galleryInput")?.click()}
                className="flex flex-col items-center justify-center border border-dashed border-border rounded aspect-square hover:bg-secondary/5 hover:border-accent/40 transition-all text-text-muted group-hover:text-accent"
              >
                <Plus size={16} />
                <span className="text-[8px] uppercase mt-1 tracking-tighter">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Metadata Area */}
        <div className="bg-white border border-border rounded-lg p-8 space-y-6">
          <h3 className="font-headline text-lg font-medium">Metadata Details</h3>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">Artwork Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: false });
                }}
                className={`w-full px-4 py-2.5 text-sm bg-secondary/10 border ${errors.title ? 'border-red-500' : 'border-border'} rounded focus:ring-1 focus:ring-accent outline-none transition-colors`}
                placeholder="e.g. Echoes of Silence"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">Category <span className="text-red-500">*</span></label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value as any });
                  if (errors.category) setErrors({ ...errors, category: false });
                }}
                className={`w-full px-4 py-2.5 text-sm bg-secondary/10 border ${errors.category ? 'border-red-500' : 'border-border'} rounded focus:ring-1 focus:ring-accent outline-none appearance-none capitalize transition-colors`}
              >
                <option value="">Select Category</option>
                <option value="watercolors">Watercolors</option>
                <option value="pencilcolors">Pencilcolors</option>
                <option value="acrylics">Acrylics</option>
                <option value="oil colors">Oil Colors</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-secondary/10 border border-border rounded focus:ring-1 focus:ring-accent outline-none min-h-[120px] resize-none"
              placeholder="Describe the concept, materials, and emotional intent..."
            />
          </div>

          <div className="flex items-center justify-end pt-4">
            <div className="flex flex-col items-end gap-2">
              {Object.keys(errors).length > 0 && (
                <p className="text-[10px] text-red-500 font-label uppercase tracking-widest italic animate-pulse">
                  Please complete all required fields
                </p>
              )}
              <div className="flex gap-4">
                {editingArtwork && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingArtwork(null);
                      setErrors({});
                      setFormData({
                        title: "",
                        category: "watercolors",
                        year: new Date().getFullYear().toString(),
                        coverImage: "",
                        images: [],
                        description: "",
                        status: "Published"
                      });
                    }}
                    className="px-6 py-2 border border-border rounded font-label text-xs font-semibold uppercase tracking-wider hover:bg-secondary/5 transition-all"
                  >
                    Cancel
                  </button>
                )}
                {isRequiredFieldsFilled && (
                  <button
                    type="submit"
                    disabled={editingArtwork ? !isFormChanged() : false}
                    className={`px-8 py-2.5 bg-accent text-primary rounded font-label text-xs font-semibold uppercase tracking-wider transition-all ${editingArtwork && !isFormChanged()
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-90"
                      }`}
                  >
                    {editingArtwork ? "Update Artwork" : "Publish Artwork"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Archive Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-headline text-lg font-medium">Existing Archive</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Filter works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs border border-border rounded focus:ring-1 focus:ring-accent outline-none w-64 bg-white"
              />
            </div>
            <button className="p-2 border border-border rounded hover:bg-white transition-colors">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1.5 h-1.5 bg-text-muted"></div>
                <div className="w-1.5 h-1.5 bg-text-muted"></div>
                <div className="w-1.5 h-1.5 bg-text-muted"></div>
                <div className="w-1.5 h-1.5 bg-text-muted"></div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[10px] font-label uppercase tracking-widest text-text-muted bg-secondary/5">
                  <th className="px-6 py-4 font-semibold">Thumbnail</th>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted text-xs font-label italic">
                      Retrieving collection...
                    </td>
                  </tr>
                ) : filteredArtworks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted text-xs font-label italic">
                      No matching works found.
                    </td>
                  </tr>
                ) : (
                  paginatedArtworks.map((art) => (
                    <tr key={art._id} className="group hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-16 h-10 rounded bg-secondary/30 overflow-hidden border border-border">
                          <img src={art.coverImage} alt={art.title} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-headline font-semibold text-text-header">
                            {art.title}
                          </p>
                          <p className="text-[10px] text-text-muted mt-0.5 uppercase tracking-tighter">ID-{art._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-text-header">{art.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(art)}
                            className="p-1.5 text-text-muted hover:text-accent transition-all"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setArtworkToDelete(art)}
                            className="p-1.5 text-text-muted hover:text-error transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <p className="text-[10px] text-text-muted font-label uppercase tracking-widest">
              Showing {rangeStart}–{rangeEnd} of {filteredArtworks.length} works
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={activePage === 1}
                  className="p-1 text-text-muted hover:text-text-header disabled:opacity-30 transition-all cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold rounded-sm transition-all cursor-pointer ${activePage === page
                        ? "bg-accent text-primary"
                        : "text-text-muted hover:bg-secondary/10"
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={activePage === totalPages}
                  className="p-1 text-text-muted hover:text-text-header disabled:opacity-30 transition-all cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-12 pb-8 flex flex-col items-center gap-4 border-t border-border">
        <div className="flex gap-8 text-[10px] font-label uppercase tracking-widest text-text-muted">
          <a href="#" className="hover:text-accent transition-colors">Instagram</a>
          <a href="#" className="hover:text-accent transition-colors">Youtube</a>
          <a href="#" className="hover:text-accent transition-colors">Pinterest</a>
        </div>
        <p className="text-[10px] text-text-muted uppercase tracking-widest">© 2024 Arté Portfolio. All Rights Reserved.</p>
      </div>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={artworkToDelete !== null}
        onClose={() => setArtworkToDelete(null)}
        title="Delete Artwork"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center text-center gap-4 py-2">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500">
              <AlertTriangle size={24} className="animate-bounce" style={{ animationDuration: "2s" }} />
            </div>
            <div className="space-y-2 max-w-sm">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Are you sure you want to permanently delete <strong className="font-semibold text-neutral-800 dark:text-neutral-200">"{artworkToDelete?.title}"</strong>? This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setArtworkToDelete(null)}
              disabled={isDeletingArtwork}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded font-label text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeletingArtwork}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded font-label text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm shadow-red-600/10 flex items-center gap-2 disabled:opacity-50"
            >
              {isDeletingArtwork ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Piece</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PortfolioAdmin;