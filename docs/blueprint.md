# **App Name**: KrishiSetu

## Core Features:

- AI Copilot Chat: AI-powered chat interface providing real-time agri-advisory services. Farmers can input queries via text or voice, receiving contextually relevant advice, powered by a reasoning LLM tool that may incorporate information on weather, soil conditions, and market prices in its responses.
- Market Price Prediction: Displays mandi prices for selected crops, filters by crop and region, and visualizes price trends with a line chart. Also includes a forecast card with the predicted percentage change in price, driven by mocked local cloud function endpoints.
- Leaf Scanner: Allows users to upload or take a photo of a leaf to predict disease or nutrient deficiencies. Displays results with confidence levels and recommended steps. Users can save scan records to Firestore.
- Community Feed: Enables farmers to share posts, comments, and upvotes, creating a collaborative knowledge-sharing platform.
- User Authentication: Implements secure user authentication with email/password and social login options, plus a demo login feature with predefined demo credentials.
- Responsive Dashboard: Presents key summary cards (wallet, advisories, market snapshot), interactive market chart, and quick actions, adapted for desktop, tablet, and mobile.

## Style Guidelines:

- Primary color: Green (#0F9D58) to represent agriculture and growth.
- Accent color: Orange (#F6A623) to highlight important CTAs and sections.
- Neutral dark color: Dark Gray (#0B1320) for text and key UI elements.
- Background color: Off-white (#F8FAFB) to create a clean and minimal interface.
- Headline Font: 'Poppins', sans-serif, for a modern, geometric aesthetic. Note: currently only Google Fonts are supported.
- Body Font: 'Inter', sans-serif, for readability and a clean feel. Note: currently only Google Fonts are supported.
- Utilize rounded corners (12px) and soft shadows to create a modern, card-based UI.
- Apply an 8/16px spacing scale for consistency and visual clarity.
- Incorporate subtle fade/slide transitions for modals and page changes.
- Implement a small sync animation and offline indicator to provide feedback to users.