import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'Farmer' | 'Expert' | 'Admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region: string;
  phone: string;
  prefs: {
    push: boolean;
    voice: boolean;
  };
  avatar?: string;
  farmSize?: number;
  crops?: string[];
};

export type PricePoint = { date: string; price: number };

export type MarketPrice = {
  id:string;
  crop: string;
  region: string;
  prices: PricePoint[];
  forecast: number; // percentage change
};

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  image?: string;
  language: string;
  upvotes: number;
  comments: {
    id: string;
    authorName: string;
    authorAvatar?: string;
    comment: string;
  }[];
  createdAt: Timestamp;
};

export type ScanResult = {
  id: string;
  userId: string;
  imageUrl: string;
  prediction: string;
  confidence: number;
  recommendedSteps: string;
  createdAt: string;
};

export type SoilReport = {
  id: string;
  userId: string;
  uploadedAt: Timestamp;
  fileUrl: string;
  extractedData: {
    pH: number;
    N: string;
    P: string;
    K: string;
    OC: number;
    EC: number;
  };
  aiSummary: {
    fertilityIndex: number;
    fertilityStatus: string;
    soilType: string;
    recommendedCrops: string[];
    fertilizerPlan: string;
    organicAdvice: string;
    warnings: string[];
    explanation: string;
  };
}
