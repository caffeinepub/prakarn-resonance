import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Note {
    id: NoteId;
    title: string;
    topic: string;
    file: ExternalBlob;
    description: string;
    uploadedAt: bigint;
}
export type NoteId = bigint;
export interface LectureInput {
    title: string;
    topic: string;
    description: string;
    videoFile: ExternalBlob;
}
export interface NoteInput {
    title: string;
    topic: string;
    file: ExternalBlob;
    description: string;
}
export type LectureId = bigint;
export interface Lecture {
    id: LectureId;
    title: string;
    topic: string;
    description: string;
    videoFile: ExternalBlob;
    uploadedAt: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteLecture(id: LectureId): Promise<void>;
    deleteNote(id: NoteId): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getLecture(id: LectureId): Promise<Lecture | null>;
    getNote(id: NoteId): Promise<Note | null>;
    isCallerAdmin(): Promise<boolean>;
    listLectures(): Promise<Array<Lecture>>;
    listNotes(): Promise<Array<Note>>;
    uploadLecture(input: LectureInput): Promise<Lecture>;
    uploadNote(input: NoteInput): Promise<Note>;
}
