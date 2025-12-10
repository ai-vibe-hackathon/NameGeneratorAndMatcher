Proposed Changes
Tech Stack
Frontend: React 18, Vite, Vanilla CSS (Modern features: Variables, Flexbox, Grid, Animations).
Backend: Node.js, Express.
Data: JSON file based storage (for MVP).
Testing: Vitest for unit logic (matching algorithms).
Architecture
The project will be a monorepo structure:

/client: Frontend React application.
/server: Backend API application.
/shared: Shared types and constants.
Core Components
1. Backend (/server)
API Endpoints:
GET /api/names: Search and filter names.
New Params: theme, length (short/medium/long), firstLetter.
POST /api/match: Calculate compatibility score between two names.
Logic:
matchAlgorithm.js: Calculates score based on phonetics (Soundex), length, and origin.
[NEW] Chinese Support: Use pinyin library to convert Chinese characters to phonetics for matching.
2. Frontend (/client)
Pages:
Home: Landing page with "Enter two names" CTA and "Generate Name" button.
Generator: Filter interface (Gender, Origin, Vibe) -> List of names.
MatchResult: Visual score display with "Harmony" details.
Components:
NameCard: Displays name, meaning, and origin.
HarmonyMeter: Animated gauge/circle showing the match percentage.
VibeFilters: Interactive filter pills.
Verification Plan
Automated Tests
Run backend tests for matching algorithm: npm test (in server).
Verify API endpoints return correct JSON structure.
Manual Verification
Generator: Test all filters (e.g., "French" + "Female") ensure results match.
Matching: Input known pairs (e.g., "Romeo" & "Juliet") and verify the score is calculated and displayed.
Responsive: Check UI on mobile and desktop views.
