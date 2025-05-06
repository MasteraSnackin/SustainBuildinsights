# Property Insights Pro

Property Insights Pro is a Next.js application designed to provide comprehensive property redevelopment analysis. It leverages the PaTMa API for property data, Genkit for AI-powered insights and summaries, and Mapbox for location visualization. Users can input a UK postcode and a PaTMa API key to generate a detailed report covering various aspects of a property's potential.

## Features

- **Dynamic Report Generation:** Input a UK postcode and PaTMa API key to generate a multi-section report.
- **Executive Summary:** AI-generated summary of the property's redevelopment potential.
- **Valuation & Market Analysis:**
    - Local asking and sold prices (last 5 years).
    - 5-year price trends visualized in a chart.
    - Price-per-floor-area metrics.
- **Planning & Regulatory Landscape:**
    - Recent planning applications (approved/rejected in the last 5 years).
    - Identification of conservation areas.
    - Assessment of planning permission likelihood (qualitative).
- **Location Overview:**
    - Static map image of the postcode using Mapbox Static Images API.
    - Option to use custom map styles from [Mapbox Studio](https://www.mapbox.com/mapbox-studio).
    - Administrative boundaries (Local Authority, Council, Constituency, Ward, Country).
    - Notable geographic features (e.g., conservation areas, flood zones).
- **Neighborhood Insights:**
    - Local schools and Ofsted ratings.
    - Crime rates by type, visualized in a chart.
    - Demographic data (age & income), visualized in a chart.
- **Energy, Climate & Environment:**
    - Energy Performance Certificate (EPC) rating and details.
    - Flood risk assessment (Rivers/Sea, Surface Water, Reservoirs).
    - Air Quality Index (AQI) and category.
    - Historical climate data (average rainfall, temperature).
- **Transport Links:**
    - Nearby transport options (train, bus, road access) and their proximity.
- **Financial Feasibility:**
    - Stamp Duty Land Tax (SDLT) calculation.
    - Estimated rental yield.
    - Simplified Return on Investment (ROI) model.
- **Case Studies & Comparables:**
    - Examples of recently sold and rental properties in the area.
- **Interactive Chatbot:**
    - Ask questions about the generated executive summary.
    - The chatbot uses **only** the information present in the current report summary.
    - Voice input support for asking questions.
- **Report Actions:**
    - **Email Report:** Opens the user's default email client with the report content (limited by URL length).
    - **Download Report:** Downloads the report content as a `.txt` file.
    - **Convert to Podcast:** Generates a (mock) audio version of the report summary.
    - **Read Aloud:** Uses browser's SpeechSynthesis API to read the report summary aloud.
- **Responsive Design:** User interface adapts to different screen sizes.
- **Collapsible Sidebar:** Provides navigation and access to the chatbot and report actions.

## Technologies Used

- **Frontend:**
    - Next.js (App Router)
    - React
    - TypeScript
    - Tailwind CSS
    - ShadCN UI (for UI components)
    - Lucide React (for icons)
    - Recharts (for charts)
- **AI & Backend Logic (Server Actions / Genkit Flows):**
    - Genkit (with Google AI - Gemini)
        - Executive Summary Generation
        - Chatbot Functionality
        - (Mock) Podcast Audio Generation
- **APIs:**
    - PaTMa API (Property Prospector API - mock implementation in `src/services/patma.ts`)
    - Mapbox Static Images API (for map visualization)
    - Browser SpeechSynthesis API (for "Read Aloud")
    - Browser Web Speech API (for voice input in chatbot)

## Getting Started

### Prerequisites

- Node.js (version 20.x or later recommended)
- npm or yarn
- A PaTMa API Key (for actual data fetching, though the current service is mocked)
- A Google AI API Key (for Genkit, configure in `.env` or your Google Cloud project)
- A Mapbox Access Token (for displaying maps, configure in `.env.local`)
- (Optional) A Mapbox Style ID if you want to use custom maps from [Mapbox Studio](https://www.mapbox.com/mapbox-studio).

### Environment Variables

Create a `.env` file in the root of the project and add your Google AI API key:

```env
# .env
GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
```

Create a `.env.local` file in the root of the project and add your Mapbox access token and optionally, your Mapbox style ID:

```env.local
# .env.local
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN
# Optional: Specify your custom Mapbox style ID from Mapbox Studio (e.g., yourusername/ckxxxxxxxxxxxxxxx)
# If not set, it defaults to 'mapbox/streets-v12'
# NEXT_PUBLIC_MAPBOX_STYLE_ID=yourusername/yourstyleid 
```

**Note:** The PaTMa API key is currently entered directly in the UI. The application will store it in `localStorage` for convenience.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

1.  **Run the Next.js development server:**
    ```bash
    npm run dev
    ```
    This will typically start the application on `http://localhost:9002`.

2.  **Run the Genkit development server (in a separate terminal):**
    For Genkit flows to be inspectable and testable via the Genkit developer UI:
    ```bash
    npm run genkit:dev
    # or for watching changes
    npm run genkit:watch
    ```
    The Genkit developer UI will be available at `http://localhost:4000`.

## Available Scripts

-   `npm run dev`: Starts the Next.js development server (with Turbopack).
-   `npm run genkit:dev`: Starts the Genkit development server.
-   `npm run genkit:watch`: Starts the Genkit development server with file watching.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
-   `npm run typecheck`: Performs TypeScript type checking.

## Project Structure

```
.
├── README.md
├── components.json       # ShadCN UI configuration
├── next.config.ts        # Next.js configuration
├── package.json
├── public/               # Static assets
├── src/
│   ├── ai/               # Genkit AI related files
│   │   ├── dev.ts        # Genkit development server entry point
│   │   ├── flows/        # Genkit flows (e.g., summary generation, chat)
│   │   └── genkit.ts     # Genkit AI client initialization
│   ├── app/              # Next.js App Router
│   │   ├── globals.css   # Global styles and Tailwind CSS theme
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Main page component
│   ├── components/       # Reusable UI components
│   │   ├── charts/       # Chart components (e.g., PriceTrendsChart)
│   │   ├── icons/        # Custom icon components (e.g., Logo)
│   │   ├── property-insights/ # Components specific to report sections
│   │   ├── property-insights-dashboard.tsx # Main dashboard component
│   │   ├── report-actions.tsx # Component for email, download, podcast actions
│   │   └── ui/           # ShadCN UI components
│   ├── hooks/            # Custom React hooks (e.g., useToast, useMobile)
│   ├── lib/              # Utility functions (e.g., cn for classnames)
│   └── services/         # API service integrations (e.g., patma.ts)
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## API Usage

### PaTMa API (Mocked)

The application uses a mocked version of the PaTMa API, defined in `src/services/patma.ts`. In a real-world scenario, this file would contain actual API calls to PaTMa endpoints. The mock data simulates various property-related information such as:

-   Asking Prices
-   Sold Prices & Price per Floor Area
-   Price Trends
-   Planning Applications
-   Conservation Areas
-   Schools & Ofsted Ratings
-   Crime Rates
-   Demographics
-   Stamp Duty Calculation
-   Rent Estimates & Rental Comparables
-   EPC Data
-   Flood Risk Data
-   Air Quality Data
-   Historical Climate Data
-   Transport Links
-   Administrative Boundaries (simulating MapIt)

The PaTMa API key is required by the UI form but is only used by the mock functions to demonstrate data fetching flow.

### Genkit (Google AI)

Genkit is used for AI-powered features:

-   **Executive Summary Generation:** `src/ai/flows/generate-executive-summary.ts` defines a flow that takes a postcode and uses a Gemini model to generate a summary based on (mocked) data fetched from PaTMa services.
-   **Chat with Report:** `src/ai/flows/chat-with-report-flow.ts` defines a flow that allows users to ask questions about the generated executive summary. The AI is prompted to only use the provided summary context for its answers.
-   **Podcast Audio Generation:** `src/ai/flows/generate-podcast-audio-flow.ts` provides a mock flow for converting text to audio. In a real application, this would integrate with a Text-to-Speech (TTS) service.

The Genkit AI client is initialized in `src/ai/genkit.ts`.

### Mapbox Static Images API

The `src/components/property-insights/map-location.tsx` component uses the Mapbox Static Images API to display a map for the given postcode. 
- An access token (`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`) must be provided in `.env.local`. 
- Optionally, a custom map style ID (`NEXT_PUBLIC_MAPBOX_STYLE_ID`) from [Mapbox Studio](https://www.mapbox.com/mapbox-studio) can be specified in `.env.local`. If not provided, it defaults to `mapbox/streets-v12`.
If the access token is missing or invalid, a placeholder image is shown.

## Contributing

Contributions are welcome! Please follow the standard fork-and-pull-request workflow. Ensure your code adheres to the project's linting and type-checking standards.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the `LICENSE` file for details (if one exists).
(Currently, no LICENSE file is specified, assuming MIT as a common open-source license).

---

This README provides a comprehensive overview of the Property Insights Pro application. For more specific details, please refer to the code comments and individual component/module documentation.
