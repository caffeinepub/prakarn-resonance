import type { backendInterface } from "../backend";
import { UserRole, ExternalBlob } from "../backend";

const makeBlob = (url: string): ExternalBlob => {
  return ExternalBlob.fromURL(url);
};

const sampleVideoUrl = "https://www.w3schools.com/html/mov_bbb.mp4";
const samplePdfUrl = "https://www.w3.org/WAI/WCAG21/wcag21-noref.pdf";

export const mockBackend: backendInterface = {
  _immutableObjectStorageBlobsAreLive: async () => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async () => undefined,
  _immutableObjectStorageCreateCertificate: async () => ({ method: "", blob_hash: "" }),
  _immutableObjectStorageRefillCashier: async () => ({}),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,

  assignCallerUserRole: async () => undefined,

  deleteLecture: async () => undefined,

  deleteNote: async () => undefined,

  getCallerUserRole: async () => UserRole.admin,

  getLecture: async (id) => ({
    id: id,
    title: "Introduction to Quantum Computing",
    topic: "Physics",
    description: "A foundational lecture covering quantum bits, superposition, and entanglement.",
    videoFile: makeBlob(sampleVideoUrl),
    uploadedAt: BigInt(Date.now()),
  }),

  getNote: async (id) => ({
    id: id,
    title: "Quantum Computing Reference Sheet",
    topic: "Physics",
    file: makeBlob(samplePdfUrl),
    description: "Key formulas and concepts from the quantum computing lecture series.",
    uploadedAt: BigInt(Date.now()),
  }),

  isCallerAdmin: async () => true,

  listLectures: async () => [
    {
      id: BigInt(1),
      title: "Introduction to Quantum Computing",
      topic: "Physics",
      description: "A foundational lecture covering quantum bits, superposition, and entanglement.",
      videoFile: makeBlob(sampleVideoUrl),
      uploadedAt: BigInt(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: BigInt(2),
      title: "Neural Networks Fundamentals",
      topic: "Machine Learning",
      description: "Deep dive into perceptrons, activation functions, and backpropagation.",
      videoFile: makeBlob(sampleVideoUrl),
      uploadedAt: BigInt(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: BigInt(3),
      title: "Cognitive Psychology: Memory Models",
      topic: "Psychology",
      description: "Exploring working memory, long-term memory, and encoding strategies.",
      videoFile: makeBlob(sampleVideoUrl),
      uploadedAt: BigInt(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: BigInt(4),
      title: "Organic Chemistry Reactions",
      topic: "Chemistry",
      description: "Understanding substitution, elimination, and addition reactions.",
      videoFile: makeBlob(sampleVideoUrl),
      uploadedAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: BigInt(5),
      title: "Graph Theory and Algorithms",
      topic: "Mathematics",
      description: "BFS, DFS, shortest path algorithms and their real-world applications.",
      videoFile: makeBlob(sampleVideoUrl),
      uploadedAt: BigInt(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: BigInt(6),
      title: "Behavioral Economics",
      topic: "Economics",
      description: "How psychological biases influence economic decision-making.",
      videoFile: makeBlob(sampleVideoUrl),
      uploadedAt: BigInt(Date.now() - 12 * 60 * 60 * 1000),
    },
  ],

  listNotes: async () => [
    {
      id: BigInt(1),
      title: "Quantum Computing Cheat Sheet",
      topic: "Physics",
      file: makeBlob(samplePdfUrl),
      description: "Essential formulas and quantum gate reference.",
      uploadedAt: BigInt(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      id: BigInt(2),
      title: "Neural Network Architecture Diagrams",
      topic: "Machine Learning",
      file: makeBlob(samplePdfUrl),
      description: "Visual guide to common network architectures.",
      uploadedAt: BigInt(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      id: BigInt(3),
      title: "Organic Chemistry Reaction Guide",
      topic: "Chemistry",
      file: makeBlob(samplePdfUrl),
      description: "Step-by-step reaction mechanisms with examples.",
      uploadedAt: BigInt(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ],

  uploadLecture: async (input) => ({
    id: BigInt(99),
    title: input.title,
    topic: input.topic,
    description: input.description,
    videoFile: input.videoFile,
    uploadedAt: BigInt(Date.now()),
  }),

  uploadNote: async (input) => ({
    id: BigInt(99),
    title: input.title,
    topic: input.topic,
    file: input.file,
    description: input.description,
    uploadedAt: BigInt(Date.now()),
  }),
};
