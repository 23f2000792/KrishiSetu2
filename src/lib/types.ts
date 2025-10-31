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
};

export type MarketPrice = {
  id: string;
  crop: string;
  region: string;
  prices: { date: string; price: number }[];
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
  createdAt: string;
};

export type ScanResult = {
  id: string;
  imageUrl: string;
  prediction: string;
  confidence: number;
  recommendedSteps: string;
  createdAt: string;
};
