"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Mail,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Trash2,
  Clock,
  Star,
  Calendar,
  ArrowUpDown,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { AdminHeader } from "@/components/ui/AdminHeader";
import { Modal } from "@/components/ui/Modal";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  isStarred: boolean;
  status: "New" | "Read" | "Replied" | "Archived";
  createdAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [starredCount, setStarredCount] = useState(0);
  const [allCount, setAllCount] = useState(0);

  // Search & Filter parameters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "starred">("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 5,
    pages: 1
  });

  // Action states
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, sortOrder, startDate, endDate, statusFilter]);

  // Debounced/Triggered search handler
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1);
      fetchInquiries();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Automatically mark selected inquiry as read when viewed
  useEffect(() => {
    if (!selectedId) return;
    const selected = inquiries.find(i => i._id === selectedId);
    if (selected && !selected.isRead) {
      const autoMarkAsRead = async () => {
        try {
          const res = await fetch(`/api/inquiries/${selectedId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true })
          });
          if (res.ok) {
            const updated = await res.json();
            setInquiries(prev => prev.map(i => i._id === updated._id ? { ...i, isRead: true, status: updated.status } : i));
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        } catch (error) {
          console.error("Failed to auto-mark as read:", error);
        }
      };
      autoMarkAsRead();
    }
  }, [selectedId, inquiries]);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      let url = `/api/inquiries?page=${currentPage}&limit=5&sort=${sortOrder}&search=${encodeURIComponent(searchQuery)}`;

      if (startDate) {
        url += `&startDate=${startDate}`;
      }
      if (endDate) {
        url += `&endDate=${endDate}`;
      }
      if (statusFilter === "unread") {
        url += `&read=false`;
      } else if (statusFilter === "starred") {
        url += `&starred=true`;
      }

      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        }
      });
      const data = await res.json();

      if (data.inquiries) {
        setInquiries(data.inquiries);
        setPagination(data.pagination);
        setUnreadCount(data.unreadCount || 0);
        setStarredCount(data.starredCount || 0);
        setAllCount(data.allCount || 0);

        // Auto-select first item if none is selected or current selected is not in results
        if (data.inquiries.length > 0) {
          const currentExists = data.inquiries.some((i: Inquiry) => i._id === selectedId);
          if (!selectedId || !currentExists) {
            setSelectedId(data.inquiries[0]._id);
          }
        } else {
          setSelectedId(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRead = async (inquiry: Inquiry) => {
    try {
      const res = await fetch(`/api/inquiries/${inquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !inquiry.isRead })
      });

      if (res.ok) {
        const updated = await res.json();
        setInquiries(prev => prev.map(i => i._id === updated._id ? { ...i, isRead: updated.isRead, status: updated.status } : i));
        setUnreadCount(prev => updated.isRead ? Math.max(0, prev - 1) : prev + 1);
      }
    } catch (error) {
      console.error("Failed to update read status:", error);
    }
  };

  const handleToggleStar = async (inquiry: Inquiry) => {
    try {
      const res = await fetch(`/api/inquiries/${inquiry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isStarred: !inquiry.isStarred })
      });

      if (res.ok) {
        const updated = await res.json();
        setInquiries(prev => prev.map(i => i._id === updated._id ? { ...i, isStarred: updated.isStarred } : i));
        setStarredCount(prev => updated.isStarred ? prev + 1 : Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to update starred status:", error);
    }
  };

  const handleDeleteClick = (inquiry: Inquiry) => {
    setInquiryToDelete(inquiry);
  };

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiryToDelete._id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setInquiryToDelete(null);
        fetchInquiries();
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setSearchQuery("");
  };

  const selectedInquiry = inquiries.find((i) => i._id === selectedId);

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">

      {/* Dynamic Header Component */}
      <AdminHeader
        title={
          <div className="flex items-center gap-3">
            <span>Query/Mails Inbox</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-accent text-primary text-[10px] font-bold uppercase tracking-widest rounded-full animate-pulse">
                {unreadCount} New
              </span>
            )}
          </div>
        }
        description="Review, categorize, and follow up on messages from gallery curators and website visitors."
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded font-label text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${showFilters || startDate || endDate || statusFilter !== "all"
                ? "bg-accent/10 border-accent text-accent"
                : "bg-white border-border text-text-muted hover:text-text-header"
                }`}
            >
              <Filter size={14} />
              <span>Filters</span>
            </button>
            <button
              onClick={() => setSortOrder(prev => prev === "latest" ? "oldest" : "latest")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded font-label text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-text-header transition-all cursor-pointer"
            >
              <ArrowUpDown size={14} />
              <span>Sort: {sortOrder === "latest" ? "Latest" : "Oldest"}</span>
            </button>
          </div>
        }
      />

      {/* Advanced Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">Inbox View</label>
            <div className="flex border border-border rounded overflow-hidden">
              <button
                onClick={() => setStatusFilter("all")}
                className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all ${statusFilter === "all" ? "bg-accent text-primary" : "bg-neutral-50 hover:bg-neutral-100 text-text-muted"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("unread")}
                className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all ${statusFilter === "unread" ? "bg-accent text-primary" : "bg-neutral-50 hover:bg-neutral-100 text-text-muted"
                  }`}
              >
                Unread
              </button>
              <button
                onClick={() => setStatusFilter("starred")}
                className={`flex-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all ${statusFilter === "starred" ? "bg-accent text-primary" : "bg-neutral-50 hover:bg-neutral-100 text-text-muted"
                  }`}
              >
                Starred
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">From Date</label>
            <div className="relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-border rounded focus:ring-1 focus:ring-accent outline-none bg-white font-label"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-label uppercase tracking-widest text-text-muted">To Date (Range)</label>
            <div className="relative">
              <Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-border rounded focus:ring-1 focus:ring-accent outline-none bg-white font-label"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 border border-border rounded font-label text-[10px] font-semibold uppercase tracking-wider text-text-muted hover:text-text-header transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Main Mailbox Workspace */}
      <div className="flex bg-white border border-border rounded-xl overflow-hidden shadow-sm flex-1 min-h-[500px]">

        {/* Left Side: Inbox List */}
        <div className="w-full md:w-5/12 border-r border-border flex flex-col h-full overflow-hidden">

          {/* List Search Bar */}
          <div className="p-4 border-b border-border bg-neutral-50/50 space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search by sender, email, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs border border-border rounded focus:ring-1 focus:ring-accent outline-none w-full bg-white transition-all font-body"
              />
            </div>

            {/* Quick Tabs: All / Unread / Starred */}
            <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-border">
              <button
                onClick={() => setStatusFilter("all")}
                className={`flex-1 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${statusFilter === "all" ? "bg-white text-text-header shadow-xs" : "hover:text-text-header text-text-muted"
                  }`}
              >
                All ({allCount})
              </button>
              <button
                onClick={() => setStatusFilter("unread")}
                className={`flex-1 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${statusFilter === "unread" ? "bg-white text-text-header shadow-xs" : "hover:text-text-header text-text-muted"
                  }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setStatusFilter("starred")}
                className={`flex-1 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${statusFilter === "starred" ? "bg-white text-text-header shadow-xs" : "hover:text-text-header text-text-muted"
                  }`}
              >
                Starred ({starredCount})
              </button>
            </div>
          </div>

          {/* Mail list items */}
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {isLoading ? (
              <div className="p-12 text-center text-text-muted text-xs font-label italic flex flex-col items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                <span>Scanning mailbox...</span>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="p-12 text-center text-text-muted text-xs font-label italic">
                No mail queries found matching criteria.
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  onClick={() => setSelectedId(inquiry._id)}
                  className={`w-full text-left p-5 transition-all border-l-2 flex gap-3 relative group cursor-pointer ${selectedId === inquiry._id
                    ? "bg-secondary/10 border-l-accent"
                    : "hover:bg-secondary/5 border-l-transparent"
                    } ${!inquiry.isRead ? "bg-accent/5" : ""}`}
                >
                  {/* Left Indicators */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(inquiry);
                      }}
                      className={`transition-colors cursor-pointer ${inquiry.isStarred
                        ? "text-amber-500 hover:text-amber-600"
                        : "text-neutral-300 hover:text-amber-500 group-hover:text-neutral-400"
                        }`}
                    >
                      <Star
                        size={15}
                        className={inquiry.isStarred ? "fill-amber-400 text-amber-500" : ""}
                      />
                    </button>
                  </div>

                  {/* Mail Body Preview */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className={`text-sm truncate ${!inquiry.isRead ? "font-headline font-bold text-text-header" : "font-headline font-medium text-text-header"}`}>
                        {inquiry.name}
                      </span>
                      <span className="text-[9px] text-text-muted font-label uppercase tracking-wider flex-shrink-0">
                        {new Date(inquiry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <p className={`text-xs truncate ${!inquiry.isRead ? "font-bold text-text-header" : "text-text-muted"}`}>
                      {inquiry.subject}
                    </p>

                    <p className="text-xs text-text-muted/70 line-clamp-2 leading-relaxed">
                      {inquiry.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Inbox Pagination Controls */}
          {pagination.total > 0 && (
            <div className="p-4 border-t border-border bg-neutral-50/50 flex items-center justify-between">
              <span className="text-[10px] text-text-muted font-label uppercase tracking-widest">
                Showing {inquiries.length} of {pagination.total} mails
              </span>
              {pagination.pages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={pagination.page === 1}
                    className="p-1.5 border border-border bg-white rounded text-text-muted disabled:opacity-30 disabled:pointer-events-none hover:text-text-header transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-[10px] text-text-muted font-label px-2">
                    {pagination.page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                    disabled={pagination.page === pagination.pages}
                    className="p-1.5 border border-border bg-white rounded text-text-muted disabled:opacity-30 disabled:pointer-events-none hover:text-text-header transition-colors cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Detailed Mail View */}
        <div className={`
          ${selectedId ? "flex fixed inset-0 z-50 md:relative md:inset-auto md:z-0 md:flex" : "hidden md:flex"}
          flex-1 flex-col bg-white md:bg-secondary/5 h-full overflow-y-auto transition-all duration-300
        `}>
          {selectedInquiry ? (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              
              {/* Mobile Back Button */}
              <button
                onClick={() => setSelectedId(null)}
                className="md:hidden flex items-center gap-1.5 text-[10px] text-text-muted hover:text-text-header font-label uppercase tracking-widest pb-2"
              >
                <ChevronLeft size={14} />
                <span>Back to List</span>
              </button>

              {/* Header Action bar */}
              <div className="bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-headline font-bold text-text-header">{selectedInquiry.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
                    <span className="font-semibold">{selectedInquiry.email}</span>
                    {selectedInquiry.phone && (
                      <>
                        <span className="text-neutral/20">•</span>
                        <span>{selectedInquiry.phone}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStar(selectedInquiry)}
                    className={`p-2 border rounded hover:bg-neutral-50 transition-colors cursor-pointer ${selectedInquiry.isStarred
                      ? "text-amber-500 border-amber-200 bg-amber-50/20"
                      : "text-text-muted border-border"
                      }`}
                    title={selectedInquiry.isStarred ? "Unstar inquiry" : "Star inquiry"}
                  >
                    <Star size={16} className={selectedInquiry.isStarred ? "fill-amber-400 text-amber-500" : ""} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(selectedInquiry)}
                    className="p-2 border border-border rounded hover:bg-red-50 hover:text-red-600 transition-colors text-text-muted cursor-pointer"
                    title="Delete inquiry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Inquiry Email Body Card */}
              <div className="bg-white border border-border rounded-2xl p-8 shadow-xs space-y-6">

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 pb-6 border-b border-border">
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full ${!selectedInquiry.isRead
                    ? "bg-accent/15 text-accent"
                    : "bg-neutral-100 text-neutral-500"
                    }`}>
                    {!selectedInquiry.isRead ? "Unread" : "Read"}
                  </span>

                  {selectedInquiry.isStarred && (
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                      <Star size={8} className="fill-amber-500" /> Starred
                    </span>
                  )}

                  <span className="text-[10px] text-text-muted font-label uppercase tracking-widest flex items-center gap-1.5 sm:ml-auto">
                    <Clock size={12} />
                    {new Date(selectedInquiry.createdAt).toLocaleString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                {/* Email content */}
                <div className="space-y-4">
                  <h4 className="text-base font-headline font-bold text-text-header leading-tight">
                    {selectedInquiry.subject}
                  </h4>

                  <div className="text-sm text-text-header leading-relaxed whitespace-pre-wrap font-body bg-neutral-50/30 p-6 border border-border rounded-xl">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Follow up response suggestion */}
                <div className="pt-6 border-t border-border flex items-center gap-4 border-dashed">
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                    className="px-6 py-2.5 bg-accent text-primary rounded font-label text-[10px] font-semibold uppercase tracking-widest hover:opacity-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <Mail size={12} />
                    <span>Reply via Email</span>
                  </a>
                </div>

              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text-muted text-xs font-label italic gap-3">
              <Mail size={24} className="stroke-1 text-text-muted/60" />
              <span>Select an inquiry to view details.</span>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Custom Modal */}
      <Modal
        isOpen={inquiryToDelete !== null}
        onClose={() => setInquiryToDelete(null)}
        title="Delete Inquiry"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center text-center gap-4 py-2">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500">
              <AlertTriangle size={24} className="animate-bounce" style={{ animationDuration: "2s" }} />
            </div>
            <div className="space-y-2 max-w-sm">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Are you sure you want to delete <strong className="font-semibold text-neutral-800 dark:text-neutral-200">"{inquiryToDelete?.name}'s"</strong> inquiry? This action will move it to the deleted archive and soft delete the communication.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setInquiryToDelete(null)}
              disabled={isDeleting}
              className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded font-label text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded font-label text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm shadow-red-600/10 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Inquiry</span>
              )}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default InquiriesPage;