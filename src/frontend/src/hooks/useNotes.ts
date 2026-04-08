import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob } from "../backend";
import type { UserRole } from "../backend";
import type { Note, NoteId } from "../types";
import { useBackend } from "./useBackend";

const NOTES_KEY = ["notes"] as const;

export function useNotes() {
  const { actor, isActorReady } = useBackend();

  return useQuery<Note[]>({
    queryKey: NOTES_KEY,
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listNotes();
      return Array.isArray(result) ? result : [];
    },
    enabled: isActorReady,
  });
}

export function useGetNote(id: NoteId) {
  const { actor, isActorReady } = useBackend();

  return useQuery<Note | null>({
    queryKey: ["note", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getNote(id);
    },
    enabled: isActorReady && id != null,
  });
}

export interface UploadNoteInput {
  title: string;
  description: string;
  topic: string;
  file: File;
  onProgress?: (percentage: number) => void;
}

export function useUploadNote() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      topic,
      file,
      onProgress,
    }: UploadNoteInput) => {
      if (!actor) throw new Error("Actor not available");

      const bytes = new Uint8Array(await file.arrayBuffer());
      let fileBlob = ExternalBlob.fromBytes(bytes);
      if (onProgress) {
        fileBlob = fileBlob.withUploadProgress(onProgress);
      }

      return actor.uploadNote({ title, description, topic, file: fileBlob });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
    },
  });
}

export function useDeleteNote() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: NoteId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching, isActorReady } = useBackend();

  const query = useQuery({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserRole();
    },
    enabled: isActorReady,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: isActorReady && query.isFetched,
  };
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching, isActorReady } = useBackend();

  const query = useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: isActorReady,
    retry: false,
  });

  return {
    ...query,
    isAdmin: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
  };
}

export function useAssignRole() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.assignCallerUserRole(data.user, data.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerUserRole"] });
      queryClient.invalidateQueries({ queryKey: ["isCallerAdmin"] });
    },
  });
}
