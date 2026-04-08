import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalBlob } from "../backend";
import type { Lecture, LectureId } from "../types";
import { useBackend } from "./useBackend";

const LECTURES_KEY = ["lectures"] as const;

export function useLectures() {
  const { actor, isActorReady } = useBackend();

  return useQuery<Lecture[]>({
    queryKey: LECTURES_KEY,
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listLectures();
      return Array.isArray(result) ? result : [];
    },
    enabled: isActorReady,
  });
}

export function useGetLecture(id: LectureId) {
  const { actor, isActorReady } = useBackend();

  return useQuery<Lecture | null>({
    queryKey: ["lecture", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLecture(id);
    },
    enabled: isActorReady && id != null,
  });
}

export interface UploadLectureInput {
  title: string;
  description: string;
  topic: string;
  videoFile: File;
  onProgress?: (percentage: number) => void;
}

export function useUploadLecture() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      topic,
      videoFile,
      onProgress,
    }: UploadLectureInput) => {
      if (!actor) throw new Error("Actor not available");

      const bytes = new Uint8Array(await videoFile.arrayBuffer());
      let videoBlob = ExternalBlob.fromBytes(bytes);
      if (onProgress) {
        videoBlob = videoBlob.withUploadProgress(onProgress);
      }

      return actor.uploadLecture({
        title,
        description,
        topic,
        videoFile: videoBlob,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LECTURES_KEY });
    },
  });
}

export function useDeleteLecture() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: LectureId) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteLecture(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LECTURES_KEY });
    },
  });
}
