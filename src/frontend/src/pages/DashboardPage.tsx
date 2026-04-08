import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Film, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import {
  useDeleteLecture,
  useLectures,
  useUploadLecture,
} from "../hooks/useLectures";
import {
  useDeleteNote,
  useIsCallerAdmin,
  useNotes,
  useUploadNote,
} from "../hooks/useNotes";
import type { Lecture, LectureId, Note, NoteId } from "../types";

// ─── Shared Types ──────────────────────────────────────────────────────────────

type ActiveTab = "lectures" | "notes";

interface UploadFormState {
  title: string;
  description: string;
  topic: string;
  file: File | null;
  progress: number;
  isUploading: boolean;
  showForm: boolean;
}

const INITIAL_FORM: UploadFormState = {
  title: "",
  description: "",
  topic: "",
  file: null,
  progress: 0,
  isUploading: false,
  showForm: false,
};

const TOPIC_SUGGESTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "History",
  "Literature",
  "Economics",
  "Psychology",
  "Philosophy",
];

// ─── Upload Progress Bar ────────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="w-full bg-muted rounded-full h-2 overflow-hidden"
      aria-label={`Upload progress: ${value}%`}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// ─── File Drop Zone ─────────────────────────────────────────────────────────────

interface FileDropZoneProps {
  accept: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  icon: React.ReactNode;
  hint: string;
  inputId: string;
}

function FileDropZone({
  accept,
  file,
  onFileChange,
  icon,
  hint,
  inputId,
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFileChange(dropped);
  };

  return (
    <label
      htmlFor={inputId}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-smooth block ${
        isDragOver
          ? "border-primary bg-primary/5"
          : file
            ? "border-accent bg-accent/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      data-ocid="file-dropzone"
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
      <div className="flex flex-col items-center gap-3">
        <div
          className={`p-3 rounded-full ${file ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}
        >
          {file ? <FileText className="w-6 h-6" /> : icon}
        </div>
        {file ? (
          <div className="space-y-1">
            <p className="font-display font-semibold text-foreground text-sm truncate max-w-xs">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              type="button"
              className="text-xs text-destructive hover:underline mt-1"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-display font-medium text-foreground text-sm">
              Drop file here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        )}
      </div>
    </label>
  );
}

// ─── Upload Form ───────────────────────────────────────────────────────────────

interface UploadFormProps {
  type: "lecture" | "note";
  form: UploadFormState;
  setForm: React.Dispatch<React.SetStateAction<UploadFormState>>;
  onSubmit: () => void;
}

function UploadForm({ type, form, setForm, onSubmit }: UploadFormProps) {
  const isLecture = type === "lecture";

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            {isLecture ? (
              <Film className="w-4 h-4 text-primary" />
            ) : (
              <FileText className="w-4 h-4 text-primary" />
            )}
          </div>
          <h3 className="font-display font-semibold text-foreground">
            Upload {isLecture ? "Lecture Video" : "Notes PDF"}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setForm(INITIAL_FORM)}
          className="text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="Close upload form"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${type}-title`}>Title *</Label>
          <Input
            id={`${type}-title`}
            placeholder={
              isLecture
                ? "Introduction to Quantum Mechanics"
                : "Chapter 3 Study Notes"
            }
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            data-ocid={`${type}-title-input`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${type}-topic`}>Topic *</Label>
          <Input
            id={`${type}-topic`}
            list={`${type}-topics`}
            placeholder="Physics, Mathematics..."
            value={form.topic}
            onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
            data-ocid={`${type}-topic-input`}
          />
          <datalist id={`${type}-topics`}>
            {TOPIC_SUGGESTIONS.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`${type}-description`}>Description</Label>
        <Textarea
          id={`${type}-description`}
          placeholder="Brief description of the content..."
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={3}
          data-ocid={`${type}-description-input`}
        />
      </div>

      <FileDropZone
        accept={isLecture ? "video/*" : "application/pdf"}
        file={form.file}
        onFileChange={(file) => setForm((f) => ({ ...f, file }))}
        icon={
          isLecture ? (
            <Upload className="w-6 h-6" />
          ) : (
            <FileText className="w-6 h-6" />
          )
        }
        hint={isLecture ? "MP4, WebM, MOV up to 2 GB" : "PDF documents only"}
        inputId={`${type}-file`}
      />

      {form.isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{form.progress}%</span>
          </div>
          <ProgressBar value={form.progress} />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => setForm(INITIAL_FORM)}
          disabled={form.isUploading}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={
            form.isUploading ||
            !form.title.trim() ||
            !form.topic.trim() ||
            !form.file
          }
          data-ocid={`${type}-upload-submit`}
        >
          {form.isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload {isLecture ? "Lecture" : "Notes"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Content Table ─────────────────────────────────────────────────────────────

interface ContentRow {
  id: LectureId | NoteId;
  title: string;
  topic: string;
  uploadedAt: bigint;
}

interface ContentTableProps {
  rows: ContentRow[];
  isLoading: boolean;
  type: "lecture" | "note";
  onDelete: (id: LectureId | NoteId) => void;
  isDeleting: boolean;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ContentTable({
  rows,
  isLoading,
  type,
  onDelete,
  isDeleting,
}: ContentTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border bg-muted/20"
        data-ocid={`${type}-empty-state`}
      >
        <div className="p-4 rounded-full bg-muted mb-4">
          {type === "lecture" ? (
            <Film className="w-8 h-8 text-muted-foreground" />
          ) : (
            <FileText className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <h4 className="font-display font-semibold text-foreground mb-1">
          No {type === "lecture" ? "lectures" : "notes"} yet
        </h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          Upload your first {type === "lecture" ? "lecture video" : "notes PDF"}{" "}
          to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Desktop table header */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-3 bg-muted/40 border-b border-border text-xs font-display font-semibold text-muted-foreground uppercase tracking-wide">
        <span>Title</span>
        <span className="w-28 text-center">Topic</span>
        <span className="w-28 text-center">Upload Date</span>
        <span className="w-16 text-center">Actions</span>
      </div>

      <div className="divide-y divide-border">
        {rows.map((row) => (
          <div
            key={row.id.toString()}
            className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-2 md:gap-4 px-4 py-4 hover:bg-muted/20 transition-smooth"
            data-ocid={`${type}-row`}
          >
            <div className="min-w-0">
              <p className="font-display font-medium text-foreground truncate">
                {row.title}
              </p>
              <div className="md:hidden flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {row.topic}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(row.uploadedAt)}
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center w-28">
              <Badge variant="secondary" className="truncate max-w-full">
                {row.topic}
              </Badge>
            </div>
            <div className="hidden md:flex items-center justify-center w-28 text-sm text-muted-foreground">
              {formatDate(row.uploadedAt)}
            </div>
            <div className="flex items-center justify-end md:justify-center w-full md:w-16">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    disabled={isDeleting}
                    aria-label={`Delete ${row.title}`}
                    data-ocid={`${type}-delete-btn`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete {type === "lecture" ? "Lecture" : "Note"}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove{" "}
                      <strong>"{row.title}"</strong>. Students will lose access
                      immediately. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep it</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onDelete(row.id)}
                      data-ocid={`${type}-delete-confirm`}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Lectures Section ──────────────────────────────────────────────────────────

function LecturesSection() {
  const [form, setForm] = useState<UploadFormState>(INITIAL_FORM);
  const { data: lectures = [], isLoading } = useLectures();
  const uploadLecture = useUploadLecture();
  const deleteLecture = useDeleteLecture();

  const handleUpload = async () => {
    if (!form.file || !form.title.trim() || !form.topic.trim()) return;

    setForm((f) => ({ ...f, isUploading: true, progress: 0 }));
    try {
      await uploadLecture.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim(),
        topic: form.topic.trim(),
        videoFile: form.file,
        onProgress: (pct) =>
          setForm((f) => ({ ...f, progress: Math.round(pct) })),
      });
      toast.success("Lecture uploaded successfully!");
      setForm(INITIAL_FORM);
    } catch {
      toast.error("Upload failed. Please try again.");
      setForm((f) => ({ ...f, isUploading: false, progress: 0 }));
    }
  };

  const handleDelete = async (id: LectureId) => {
    try {
      await deleteLecture.mutateAsync(id);
      toast.success("Lecture deleted.");
    } catch {
      toast.error("Failed to delete lecture.");
    }
  };

  const rows: ContentRow[] = lectures.map((l: Lecture) => ({
    id: l.id,
    title: l.title,
    topic: l.topic,
    uploadedAt: l.uploadedAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Lectures
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {lectures.length} video lecture{lectures.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!form.showForm && (
          <Button
            onClick={() => setForm({ ...INITIAL_FORM, showForm: true })}
            data-ocid="upload-lecture-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Lecture
          </Button>
        )}
      </div>

      {form.showForm && (
        <UploadForm
          type="lecture"
          form={form}
          setForm={setForm}
          onSubmit={handleUpload}
        />
      )}

      <ContentTable
        rows={rows}
        isLoading={isLoading}
        type="lecture"
        onDelete={(id) => handleDelete(id as LectureId)}
        isDeleting={deleteLecture.isPending}
      />
    </div>
  );
}

// ─── Notes Section ─────────────────────────────────────────────────────────────

function NotesSection() {
  const [form, setForm] = useState<UploadFormState>(INITIAL_FORM);
  const { data: notes = [], isLoading } = useNotes();
  const uploadNote = useUploadNote();
  const deleteNote = useDeleteNote();

  const handleUpload = async () => {
    if (!form.file || !form.title.trim() || !form.topic.trim()) return;

    setForm((f) => ({ ...f, isUploading: true, progress: 0 }));
    try {
      await uploadNote.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim(),
        topic: form.topic.trim(),
        file: form.file,
        onProgress: (pct) =>
          setForm((f) => ({ ...f, progress: Math.round(pct) })),
      });
      toast.success("Notes uploaded successfully!");
      setForm(INITIAL_FORM);
    } catch {
      toast.error("Upload failed. Please try again.");
      setForm((f) => ({ ...f, isUploading: false, progress: 0 }));
    }
  };

  const handleDelete = async (id: NoteId) => {
    try {
      await deleteNote.mutateAsync(id);
      toast.success("Notes deleted.");
    } catch {
      toast.error("Failed to delete notes.");
    }
  };

  const rows: ContentRow[] = notes.map((n: Note) => ({
    id: n.id,
    title: n.title,
    topic: n.topic,
    uploadedAt: n.uploadedAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Notes
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {notes.length} notes document{notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!form.showForm && (
          <Button
            onClick={() => setForm({ ...INITIAL_FORM, showForm: true })}
            data-ocid="upload-notes-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Notes
          </Button>
        )}
      </div>

      {form.showForm && (
        <UploadForm
          type="note"
          form={form}
          setForm={setForm}
          onSubmit={handleUpload}
        />
      )}

      <ContentTable
        rows={rows}
        isLoading={isLoading}
        type="note"
        onDelete={(id) => handleDelete(id as NoteId)}
        isDeleting={deleteNote.isPending}
      />
    </div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isAdmin, isLoading } = useIsCallerAdmin();
  const [activeTab, setActiveTab] = useState<ActiveTab>("lectures");

  return (
    <ProtectedRoute requireAdmin isAdmin={isAdmin} isRoleLoading={isLoading}>
      <Layout isAdmin={isAdmin}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl text-foreground">
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your video lectures and course notes.
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex gap-1 p-1 bg-muted rounded-xl w-fit mb-8 border border-border"
            role="tablist"
            data-ocid="dashboard-tabs"
          >
            {(["lectures", "notes"] as ActiveTab[]).map((tab) => (
              <button
                type="button"
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-display font-semibold text-sm transition-smooth ${
                  activeTab === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`tab-${tab}`}
              >
                {tab === "lectures" ? (
                  <Film className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {activeTab === "lectures" ? <LecturesSection /> : <NotesSection />}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
