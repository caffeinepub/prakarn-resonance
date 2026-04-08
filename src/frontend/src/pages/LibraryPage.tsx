import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, FileText, Play, Search, Video, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useDebounce } from "../hooks/useDebounce";
import { useLectures } from "../hooks/useLectures";
import { useIsCallerAdmin, useNotes } from "../hooks/useNotes";
import type { ContentFilter, Lecture, Note } from "../types";

// ── Types ────────────────────────────────────────────────────────────────────

type ContentType = "lecture" | "note";

interface UnifiedItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  topic: string;
  uploadedAt: bigint;
  raw: Lecture | Note;
}

interface SelectedItem {
  item: UnifiedItem;
  url: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const diff = Date.now() - ms;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) !== 1 ? "s" : ""} ago`;
}

function getMediaUrl(item: UnifiedItem): string {
  if (item.type === "lecture") {
    return (item.raw as Lecture).videoFile.getDirectURL();
  }
  return (item.raw as Note).file.getDirectURL();
}

// ── Subcomponents ────────────────────────────────────────────────────────────

function ContentCardSkeleton() {
  return (
    <div className="card-interactive animate-pulse">
      <Skeleton className="h-36 w-full rounded-md mb-3" />
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-5 w-4/5 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  );
}

interface ContentCardProps {
  item: UnifiedItem;
  onOpen: (item: UnifiedItem) => void;
}

function ContentCard({ item, onOpen }: ContentCardProps) {
  const isLecture = item.type === "lecture";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      layout
    >
      <button
        type="button"
        data-ocid="content-card"
        className="card-interactive w-full text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => onOpen(item)}
        aria-label={`Open ${item.type}: ${item.title}`}
      >
        {/* Thumbnail */}
        <div className="relative h-36 w-full rounded-md mb-3 overflow-hidden bg-muted/60 flex items-center justify-center">
          <div
            className={`absolute inset-0 opacity-20 ${isLecture ? "bg-primary" : "bg-accent"}`}
          />
          <div
            className={`relative z-10 rounded-full p-4 ${isLecture ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"} group-hover:scale-110 transition-smooth`}
          >
            {isLecture ? (
              <Video className="h-8 w-8" aria-hidden="true" />
            ) : (
              <FileText className="h-8 w-8" aria-hidden="true" />
            )}
          </div>
          {isLecture && (
            <div className="absolute bottom-2 right-2 bg-background/80 rounded-full p-1">
              <Play
                className="h-3 w-3 text-primary fill-primary"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge
            variant="secondary"
            className={
              isLecture
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-accent/10 text-accent border-accent/20"
            }
          >
            {isLecture ? "Lecture" : "Notes"}
          </Badge>
          <Badge variant="outline" className="text-muted-foreground text-xs">
            {item.topic}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-sm text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 min-h-[2.5rem]">
          {item.description}
        </p>

        {/* Footer */}
        <p className="text-muted-foreground text-xs">
          {formatRelativeTime(item.uploadedAt)}
        </p>
      </button>
    </motion.div>
  );
}

interface ContentModalProps {
  selected: SelectedItem | null;
  onClose: () => void;
}

function ContentModal({ selected, onClose }: ContentModalProps) {
  const isLecture = selected?.item.type === "lecture";

  return (
    <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="px-6 pt-5 pb-0">
          <div className="flex items-start gap-3">
            <div
              className={`rounded-lg p-2 flex-shrink-0 ${isLecture ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}
            >
              {isLecture ? (
                <Video className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="font-display font-bold text-lg text-foreground line-clamp-2">
                {selected?.item.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  {selected?.item.topic}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {selected ? formatRelativeTime(selected.item.uploadedAt) : ""}
                </span>
              </div>
            </div>
          </div>
          {selected?.item.description && (
            <p className="text-muted-foreground text-sm mt-3 px-1 pb-1">
              {selected.item.description}
            </p>
          )}
        </DialogHeader>

        {/* Media */}
        <div className="mt-4 bg-background/60 border-t border-border">
          {selected && isLecture ? (
            <video
              key={selected.url}
              src={selected.url}
              controls
              className="w-full max-h-[420px] bg-background"
              data-ocid="lecture-video-player"
            >
              <track kind="captions" />
            </video>
          ) : selected ? (
            <iframe
              key={selected.url}
              src={selected.url}
              title={selected.item.title}
              className="w-full h-[480px] border-0"
              data-ocid="note-pdf-viewer"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 px-6 text-center"
      data-ocid="empty-state"
    >
      <div className="rounded-full bg-muted/60 p-6 mb-4">
        <BookOpen
          className="h-10 w-10 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      <h3 className="font-display font-bold text-lg text-foreground mb-2">
        {hasFilters ? "No content matches your filters" : "No content yet"}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs">
        {hasFilters
          ? "Try adjusting your search or filter to find what you're looking for."
          : "Your instructor hasn't uploaded any content yet. Check back soon!"}
      </p>
    </motion.div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"] as const;

const TYPE_OPTIONS: { value: ContentFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lectures", label: "Lectures" },
  { value: "notes", label: "Notes" },
];

export default function LibraryPage() {
  const { isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: lectures = [], isLoading: lecturesLoading } = useLectures();
  const { data: notes = [], isLoading: notesLoading } = useNotes();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContentFilter>("all");
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [selected, setSelected] = useState<SelectedItem | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const isLoading = lecturesLoading || notesLoading;

  // Unified feed sorted by date (newest first)
  const unified = useMemo<UnifiedItem[]>(() => {
    const lectureItems: UnifiedItem[] = lectures.map((l) => ({
      id: `lecture-${l.id}`,
      type: "lecture",
      title: l.title,
      description: l.description,
      topic: l.topic,
      uploadedAt: l.uploadedAt,
      raw: l,
    }));
    const noteItems: UnifiedItem[] = notes.map((n) => ({
      id: `note-${n.id}`,
      type: "note",
      title: n.title,
      description: n.description,
      topic: n.topic,
      uploadedAt: n.uploadedAt,
      raw: n,
    }));
    return [...lectureItems, ...noteItems].sort((a, b) =>
      Number(b.uploadedAt - a.uploadedAt),
    );
  }, [lectures, notes]);

  // Topics derived from content
  const topics = useMemo<string[]>(() => {
    const set = new Set(unified.map((i) => i.topic));
    return Array.from(set).sort();
  }, [unified]);

  // Filtered list
  const filtered = useMemo<UnifiedItem[]>(() => {
    let items = unified;
    if (typeFilter === "lectures")
      items = items.filter((i) => i.type === "lecture");
    if (typeFilter === "notes") items = items.filter((i) => i.type === "note");
    if (topicFilter !== "all")
      items = items.filter((i) => i.topic === topicFilter);
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }
    return items;
  }, [unified, typeFilter, topicFilter, debouncedSearch]);

  const hasFilters =
    typeFilter !== "all" ||
    topicFilter !== "all" ||
    debouncedSearch.trim().length > 0;

  const handleOpen = useCallback((item: UnifiedItem) => {
    const url = getMediaUrl(item);
    setSelected({ item, url });
  }, []);

  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <ProtectedRoute isRoleLoading={adminLoading}>
      <Layout isAdmin={isAdmin}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-foreground mb-1">
              Content Library
            </h1>
            <p className="text-muted-foreground text-sm">
              Browse video lectures and course notes from your instructor.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                aria-hidden="true"
              />
              <Input
                data-ocid="search-input"
                type="search"
                placeholder="Search by title or description…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9 bg-card border-input"
                aria-label="Search content"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Topic filter */}
            <div className="flex-shrink-0">
              <select
                data-ocid="topic-filter"
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth min-w-[140px]"
                aria-label="Filter by topic"
              >
                <option value="all">All Topics</option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type Toggle */}
          <fieldset
            className="inline-flex gap-1 rounded-lg border border-border bg-muted/40 p-1 mb-6"
            aria-label="Filter by content type"
          >
            {TYPE_OPTIONS.map(({ value, label }) => (
              <button
                type="button"
                key={value}
                data-ocid={`type-filter-${value}`}
                onClick={() => setTypeFilter(value)}
                className={`rounded-md px-4 py-1.5 text-sm font-display font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  typeFilter === value
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={typeFilter === value}
              >
                {label}
              </button>
            ))}
          </fieldset>

          {/* Grid */}
          {isLoading ? (
            <div className="content-grid">
              {SKELETON_KEYS.map((k) => (
                <ContentCardSkeleton key={k} />
              ))}
            </div>
          ) : (
            <div className="content-grid">
              <AnimatePresence mode="popLayout">
                {filtered.length > 0 ? (
                  filtered.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ delay: idx * 0.04, duration: 0.22 }}
                    >
                      <ContentCard item={item} onOpen={handleOpen} />
                    </motion.div>
                  ))
                ) : (
                  <EmptyState hasFilters={hasFilters} />
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Results count */}
          {!isLoading && filtered.length > 0 && (
            <p className="mt-6 text-muted-foreground text-xs text-center">
              Showing {filtered.length} of {unified.length} items
            </p>
          )}
        </div>

        {/* Media Modal */}
        <ContentModal selected={selected} onClose={handleClose} />
      </Layout>
    </ProtectedRoute>
  );
}
