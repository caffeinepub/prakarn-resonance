import type {
  ExternalBlob,
  Lecture,
  LectureId,
  LectureInput,
  Note,
  NoteId,
  NoteInput,
} from "../backend";
export { UserRole } from "../backend";

// Re-export backend types directly so the rest of the app imports from one place
export type {
  ExternalBlob,
  Lecture,
  LectureId,
  LectureInput,
  Note,
  NoteId,
  NoteInput,
};

// ── Auth & Role ────────────────────────────────────────────────────────

export type UserRoleString = "admin" | "user" | "guest";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRoleString;
  principalText: string | null;
}

// ── UI State ───────────────────────────────────────────────────────────

export type ContentFilter = "all" | "lectures" | "notes";

export interface UploadProgress {
  percentage: number;
  filename: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
