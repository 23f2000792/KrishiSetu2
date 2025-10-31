import type { User, MarketPrice, Post, ScanResult, UserRole } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const demoCredentials = {
  admin: {
    email: 'admin@krish-demo.test',
    password: 'admin@123',
  },
};

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Ramesh Kumar',
    email: 'farmer@krish-demo.test',
    role: 'Farmer',
    region: 'Punjab',
    languages: ['Punjabi', 'Hindi'],
    phone: '+91-9876543210',
    prefs: { push: true, voice: false },
    avatar: PlaceHolderImages.find(p => p.id === 'avatar1')!.imageUrl,
  },
  {
    id: 'user-2',
    name: 'Admin User',
    email: 'admin@krish-demo.test',
    role: 'Admin',
    region: 'Delhi',
    languages: ['English', 'Hindi'],
    phone: '+91-9999999999',
    prefs: { push: true, voice: true },
    avatar: PlaceHolderImages.find(p => p.id === 'avatar2')!.imageUrl,
  },
  {
    id: 'user-3',
    name: 'Sita Devi',
    email: 'sita@example.com',
    role: 'Farmer',
    region: 'Haryana',
    languages: ['Hindi'],
    phone: '+91-9123456789',
    prefs: { push: false, voice: true },
    avatar: PlaceHolderImages.find(p => p.id === 'avatar3')!.imageUrl,
  },
  {
    id: 'user-4',
    name: 'Dr. Anil Sharma',
    email: 'anil.sharma@example.com',
    role: 'Expert',
    region: 'Maharashtra',
    languages: ['English', 'Marathi'],
    phone: '+91-8888888888',
    prefs: { push: true, voice: false },
    avatar: PlaceHolderImages.find(p => p.id === 'avatar4')!.imageUrl,
  },
];

export const marketPrices: MarketPrice[] = [
  {
    id: 'market-1',
    crop: 'Wheat',
    region: 'Punjab',
    prices: [
      { date: '2023-05-01', price: 2050 },
      { date: '2023-05-08', price: 2075 },
      { date: '2023-05-15', price: 2060 },
      { date: '2023-05-22', price: 2100 },
      { date: '2023-05-29', price: 2120 },
    ],
    forecast: 2.5,
  },
  {
    id: 'market-2',
    crop: 'Rice (Basmati)',
    region: 'Haryana',
    prices: [
      { date: '2023-05-01', price: 3200 },
      { date: '2023-05-08', price: 3250 },
      { date: '2023-05-15', price: 3230 },
      { date: '2023-05-22', price: 3300 },
      { date: '2023-05-29', price: 3350 },
    ],
    forecast: -1.2,
  },
  {
    id: 'market-3',
    crop: 'Cotton',
    region: 'Maharashtra',
    prices: [
      { date: '2023-05-01', price: 5500 },
      { date: '2023-05-08', price: 5450 },
      { date: '2023-05-15', price: 5600 },
      { date: '2023-05-22', price: 5650 },
      { date: '2023-05-29', price: 5620 },
    ],
    forecast: 3.1,
  },
];

export const communityPosts: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    authorName: 'Ramesh Kumar',
    authorAvatar: users[0].avatar,
    content: "My wheat crop is showing signs of yellowing. Any advice on what this could be? Attaching a photo.",
    image: PlaceHolderImages.find(p => p.id === 'wheat_yellow')!.imageUrl,
    language: 'Punjabi',
    upvotes: 15,
    comments: [
      { id: 'comment-1', authorName: 'Dr. Anil Sharma', authorAvatar: users[3].avatar, comment: 'This looks like a nitrogen deficiency. Try a urea spray.' },
      { id: 'comment-2', authorName: 'Sita Devi', authorAvatar: users[2].avatar, comment: 'I had the same issue last year. The expert is right.' }
    ],
    createdAt: '2 days ago',
  },
  {
    id: 'post-2',
    authorId: 'user-3',
    authorName: 'Sita Devi',
    authorAvatar: users[2].avatar,
    content: "Monsoon is early this year in Haryana. How is everyone preparing their fields for paddy transplantation?",
    language: 'Hindi',
    upvotes: 22,
    comments: [],
    createdAt: '1 day ago',
  },
    {
    id: 'post-3',
    authorId: 'user-1',
    authorName: 'Ramesh Kumar',
    authorAvatar: users[0].avatar,
    content: "Great harvest of Basmati rice this season! Sharing the joy with everyone.",
    image: PlaceHolderImages.find(p => p.id === 'rice_harvest')!.imageUrl,
    language: 'English',
    upvotes: 45,
    comments: [
      { id: 'comment-3', authorName: 'Sita Devi', authorAvatar: users[2].avatar, comment: 'Congratulations! Looks wonderful.' }
    ],
    createdAt: '5 days ago',
  },
  {
    id: 'post-4',
    authorId: 'user-4',
    authorName: 'Dr. Anil Sharma',
    authorAvatar: users[3].avatar,
    content: "PSA: A new pest, the fall armyworm, has been reported in cotton fields in Maharashtra. Be vigilant and use recommended pesticides.",
    language: 'English',
    upvotes: 50,
    comments: [],
    createdAt: '3 days ago',
  },
  {
    id: 'post-5',
    authorId: 'user-3',
    authorName: 'Sita Devi',
    authorAvatar: users[2].avatar,
    content: "Trying organic farming for vegetables this time. Any tips for beginners?",
    image: PlaceHolderImages.find(p => p.id === 'vegetables')!.imageUrl,
    language: 'Hindi',
    upvotes: 30,
    comments: [
       { id: 'comment-4', authorName: 'Dr. Anil Sharma', authorAvatar: users[3].avatar, comment: 'Great initiative! Start with vermicompost and neem oil for pest control.' }
    ],
    createdAt: '8 days ago',
  },
];

export const scannerResults: ScanResult[] = [
  {
    id: 'scan-1',
    imageUrl: PlaceHolderImages.find(p => p.id === 'leaf_blight')!.imageUrl,
    prediction: 'Northern Corn Leaf Blight',
    confidence: 0.92,
    recommendedSteps: 'Apply a foliar fungicide. Ensure proper crop rotation in the next season. Remove and destroy infected plant debris.',
    createdAt: '2023-06-10T10:30:00Z',
  },
  {
    id: 'scan-2',
    imageUrl: PlaceHolderImages.find(p => p.id === 'leaf_rust')!.imageUrl,
    prediction: 'Wheat Leaf Rust',
    confidence: 0.88,
    recommendedSteps: 'Resistant wheat varieties are the best defense. Apply fungicides like propiconazole or tebuconazole if infection is severe.',
    createdAt: '2023-06-09T14:00:00Z',
  },
  {
    id: 'scan-3',
    imageUrl: PlaceHolderImages.find(p => p.id === 'nutrient_deficiency')!.imageUrl,
    prediction: 'Nitrogen Deficiency',
    confidence: 0.95,
    recommendedSteps: 'Top-dress with a nitrogen-rich fertilizer like urea. Incorporate organic matter such as compost into the soil.',
    createdAt: '2023-06-08T09:15:00Z',
  },
  {
    id: 'scan-4',
    imageUrl: PlaceHolderImages.find(p => p.id === 'healthy_leaf')!.imageUrl,
    prediction: 'Healthy Leaf',
    confidence: 0.99,
    recommendedSteps: 'Your plant appears healthy. Continue good agricultural practices, including regular watering and monitoring for pests.',
    createdAt: '2023-06-07T11:45:00Z',
  },
];
