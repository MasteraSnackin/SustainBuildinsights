
'use server';

/**
 * @fileOverview Generates an executive summary of a property's redevelopment potential using PaTMa API data.
 *
 * - generateExecutiveSummary - A function that generates the executive summary.
 * - GenerateExecutiveSummaryInput - The input type for the generateExecutiveSummary function.
 * - GenerateExecutiveSummaryOutput - The return type for the generateExecutiveSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  getAskingPrices, type AskingPrice,
  getSoldPrices, type SoldPrice,
  getPriceTrends, type PriceTrends,
  getPlanningApplications, type PlanningApplication,
  getConservationAreas, type ConservationArea,
  getSchools, type School,
  getCrimeRates, type CrimeRates,
  getDemographics, type Demographics,
  getStampDuty, type StampDuty,
  getRentEstimates, type RentEstimates,
  getSoldPricesFloorArea, type SoldPricesFloorArea,
  getRentalComparables, type RentalComparables,
  getEpcData, type EpcData,
  getFloodRiskData, type FloodRiskData,
  getAirQualityData, type AirQualityData,
  getHistoricalClimateData, type HistoricalClimateData,
  getTransportLinks, type TransportLink,
  getAdministrativeBoundaries, type AdministrativeBoundaries,
  getTreeCoverageData, type TreeCoverageData,
  getSoilTypeData, type SoilTypeData,
  getWaterSourceData, type WaterSourceData,
  getIndustrialActivityData, type IndustrialActivityData
} from '@/services/patma';

// Schemas for PaTMa data types
const AskingPriceSchema = z.object({
  price: z.number(),
  date: z.string(),
});

const SoldPriceSchema = z.object({
  price: z.number(),
  date: z.string(),
});

const PriceTrendsSchema = z.object({
  averagePrice: z.number(),
  date: z.string(),
});

const PlanningApplicationSchema = z.object({
  applicationId: z.string(),
  status: z.string(),
  date: z.string(),
  description: z.string(),
});

const ConservationAreaSchema = z.object({
  name: z.string(),
});

const SchoolSchema = z.object({
  name: z.string(),
  ofstedRating: z.string(),
});

const CrimeRatesSchema = z.object({
  type: z.string(),
  rate: z.number(),
});

const DemographicsSchema = z.object({
  age: z.string(),
  income: z.number(),
});

const StampDutySchema = z.object({
  amount: z.number(),
});

const RentEstimatesSchema = z.object({
  averageRent: z.number(),
});

const SoldPricesFloorAreaSchema = z.object({
  pricePerFloorArea: z.number(),
  date: z.string(),
});

const RentalComparablesSchema = z.object({
  averageRent: z.number(),
  propertyType: z.string(),
  bedrooms: z.number(),
});

const EpcDataSchema = z.object({
  currentRating: z.string(),
  potentialRating: z.string(),
  currentScore: z.number(),
  potentialScore: z.number(),
  assessmentDate: z.string(),
  reportUrl: z.string().optional(),
});

const FloodRiskDataSchema = z.object({
  riversAndSea: z.string(),
  surfaceWater: z.string(),
  reservoirs: z.string().optional(),
  detailsUrl: z.string().optional(),
});

const AirQualityDataSchema = z.object({
  aqi: z.number(),
  dominantPollutant: z.string().optional(),
  category: z.string(),
  lastUpdated: z.string(),
});

const HistoricalClimateDataSchema = z.object({
  averageAnnualRainfallMm: z.number(),
  averageAnnualMeanTempC: z.number(),
  averageSunshineHoursPerDay: z.number().optional(),
  averageWindSpeedMph: z.number().optional(),
  dataYears: z.number().optional(),
  source: z.string().optional(),
});

const TransportLinkSchema = z.object({
  type: z.string(),
  name: z.string(),
  distanceMiles: z.number(),
  journeyTimeToHub: z.string().optional(),
});

const AdministrativeBoundariesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  localAuthority: z.string(),
  council: z.string(),
  constituency: z.string(),
  ward: z.string(),
  country: z.string(),
});

const TreeCoverageDataSchema = z.object({
  coveragePercentage: z.number(),
  dominantSpecies: z.array(z.string()).optional(),
  lastUpdated: z.string(),
  sourceUrl: z.string().optional(),
});

const SoilTypeDataSchema = z.object({
  primarySoilType: z.string(),
  soilPh: z.number().optional(),
  drainageClass: z.string().optional(),
  agriculturalPotential: z.string().optional(),
  sourceUrl: z.string().optional(),
});

const WaterSourceDataSchema = z.object({
  nearestRiverName: z.string().optional(),
  nearestRiverDistanceKm: z.number().optional(),
  groundwaterAvailability: z.string().optional(),
  waterQuality: z.string().optional(),
  sourceUrl: z.string().optional(),
});

const IndustrialActivityDataSchema = z.object({
  hasMajorIndustrialZones: z.boolean(),
  majorActivities: z.array(z.string()).optional(),
  proximityToSensitiveSitesKm: z.number().optional(),
  sourceUrl: z.string().optional(),
});


const PropertyDataContextSchema = z.object({
  postcode: z.string().describe('The postcode of the property to analyze.'),
  askingPrices: z.array(AskingPriceSchema).nullable().describe('Local asking prices.'),
  soldPrices: z.array(SoldPriceSchema).nullable().describe('Local sold prices.'),
  priceTrends: z.array(PriceTrendsSchema).nullable().describe('5-year price trends in the postcode.'),
  planningApplications: z.array(PlanningApplicationSchema).nullable().describe('Recent planning applications.'),
  conservationAreas: z.array(ConservationAreaSchema).nullable().describe('Conservation areas affecting the postcode.'),
  schools: z.array(SchoolSchema).nullable().describe('Local schools and Ofsted ratings.'),
  crimeRates: z.array(CrimeRatesSchema).nullable().describe('Crime rates data.'),
  demographics: z.array(DemographicsSchema).nullable().describe('Demographic data for the area.'),
  stampDuty: StampDutySchema.nullable().describe('Calculated Stamp Duty Land Tax.'),
  rentEstimates: RentEstimatesSchema.nullable().describe('Estimated rental income.'),
  soldPricesFloorArea: z.array(SoldPricesFloorAreaSchema).nullable().describe('Sold prices per floor area.'),
  rentalComparables: z.array(RentalComparablesSchema).nullable().describe('Comparable rental properties.'),
  epcData: EpcDataSchema.nullable().describe('Energy Performance Certificate data.'),
  floodRiskData: FloodRiskDataSchema.nullable().describe('Flood risk assessment.'),
  airQualityData: AirQualityDataSchema.nullable().describe('Air Quality Index and details.'),
  historicalClimateData: HistoricalClimateDataSchema.nullable().describe('Historical climate data.'),
  transportLinks: z.array(TransportLinkSchema).nullable().describe('Nearby transport links.'),
  administrativeBoundaries: AdministrativeBoundariesSchema.nullable().describe('Administrative boundaries for the location.'),
  treeCoverageData: TreeCoverageDataSchema.nullable().describe('Tree coverage data for the area.'),
  soilTypeData: SoilTypeDataSchema.nullable().describe('Soil type information.'),
  waterSourceData: WaterSourceDataSchema.nullable().describe('Local water source data.'),
  industrialActivityData: IndustrialActivityDataSchema.nullable().describe('Nearby industrial activity.'),
});

export type GenerateExecutiveSummaryInput = z.infer<typeof PropertyDataContextSchema>;

const GenerateExecutiveSummaryOutputSchema = z.object({
  summary: z.string().describe('The executive summary of the property redevelopment potential.'),
});
export type GenerateExecutiveSummaryOutput = z.infer<typeof GenerateExecutiveSummaryOutputSchema>;

export async function generateExecutiveSummary(input: GenerateExecutiveSummaryInput): Promise<GenerateExecutiveSummaryOutput> {
  return generateExecutiveSummaryFlow(input);
}

const generateExecutiveSummaryPrompt = ai.definePrompt({
  name: 'generateExecutiveSummaryPrompt',
  input: {schema: PropertyDataContextSchema},
  output: {schema: GenerateExecutiveSummaryOutputSchema},
  prompt: `You are an expert property investment analyst. You are provided with comprehensive data from various (mocked) PaTMa API endpoints about a property at the given postcode: {{{postcode}}}.
Your task is to generate a detailed executive summary of the property's redevelopment potential. You *MUST* use *ALL* the provided data sections in your analysis.

Here's the data you have access to:

**1. Property Valuation & Market Analysis:**
   - Asking Prices: {{#if askingPrices}} {{jsonStringify askingPrices}} {{else}}Not available{{/if}}
   - Sold Prices: {{#if soldPrices}} {{jsonStringify soldPrices}} {{else}}Not available{{/if}}
   - Price Trends (5-year): {{#if priceTrends}} {{jsonStringify priceTrends}} {{else}}Not available{{/if}}
   - Sold Prices per Floor Area: {{#if soldPricesFloorArea}} {{jsonStringify soldPricesFloorArea}} {{else}}Not available{{/if}}
   Analyze local asking prices, local sold prices (last 5 years), calculate price-per-floor-area metrics, and analyze 5-year price trends.

**2. Planning & Regulatory Landscape:**
   - Recent Planning Applications (last 5 years): {{#if planningApplications}} {{jsonStringify planningApplications}} {{else}}Not available{{/if}}
   - Conservation Areas: {{#if conservationAreas}} {{jsonStringify conservationAreas}} {{else}}Not available{{/if}}
   List recent approved/rejected planning applications (last 5 years), identify conservation areas or Article 4 restrictions (if inferable), and assess likelihood of planning permission success based on the data.

**3. Location Overview & Administrative Details:**
   - Administrative Boundaries: {{#if administrativeBoundaries}} {{jsonStringify administrativeBoundaries}} {{else}}Not available{{/if}}
   Summarize administrative details (Local Authority, Council, Constituency, Ward, Country) and coordinates.

**4. Neighborhood Insights:**
   - Schools & Ofsted Ratings: {{#if schools}} {{jsonStringify schools}} {{else}}Not available{{/if}}
   - Crime Rates: {{#if crimeRates}} {{jsonStringify crimeRates}} {{else}}Not available{{/if}}
   - Demographics (Age & Income): {{#if demographics}} {{jsonStringify demographics}} {{else}}Not available{{/if}}
   Evaluate school Ofsted ratings, compare crime rates (qualitatively if regional average not provided), and profile demographics for target tenant/buyer alignment.

**5. Energy, Climate & Environment:**
   - EPC Data: {{#if epcData}} {{jsonStringify epcData}} {{else}}Not available{{/if}}
   - Flood Risk: {{#if floodRiskData}} {{jsonStringify floodRiskData}} {{else}}Not available{{/if}}
   - Air Quality: {{#if airQualityData}} {{jsonStringify airQualityData}} {{else}}Not available{{/if}}
   - Historical Climate: {{#if historicalClimateData}} {{jsonStringify historicalClimateData}} {{else}}Not available{{/if}}
   - Tree Coverage: {{#if treeCoverageData}} {{jsonStringify treeCoverageData}} {{else}}Not available{{/if}}
   - Soil Type: {{#if soilTypeData}} {{jsonStringify soilTypeData}} {{else}}Not available{{/if}}
   - Water Sources: {{#if waterSourceData}} {{jsonStringify waterSourceData}} {{else}}Not available{{/if}}
   - Nearby Industrial Activity: {{#if industrialActivityData}} {{jsonStringify industrialActivityData}} {{else}}Not available{{/if}}
   Summarize EPC rating, flood risk, air quality, historical climate data, tree coverage, soil type, water sources and industrial activity. Note any implications for redevelopment (e.g., insulation upgrades, flood mitigation, site constraints).

**6. Transport Links:**
   - Transport Options: {{#if transportLinks}} {{jsonStringify transportLinks}} {{else}}Not available{{/if}}
   Describe key local transport options (train, bus, road access) and their proximity.

**7. Financial Feasibility:**
   - Stamp Duty (for a typical market price): {{#if stampDuty}} {{jsonStringify stampDuty}} {{else}}Not available{{/if}}
   - Rent Estimates: {{#if rentEstimates}} {{jsonStringify rentEstimates}} {{else}}Not available{{/if}}
   Calculate stamp duty for acquisition (assume a typical market price of £500,000 for the area if not directly provided for SDLT context), estimate rental yield using local rent data, and model ROI with refurbishment cost assumptions (use £150/sqft baseline; if floor area is not provided, make a reasonable assumption for a typical property, e.g., 1000 sqft, and state this assumption).

**8. Case Studies & Comparables:**
   - Rental Comparables: {{#if rentalComparables}} {{jsonStringify rentalComparables}} {{else}}Not available{{/if}}
   Use the provided sold price per floor area and rental comparables data to discuss the market. Highlight profit margins and time-to-sale trends IF inferable from data (state if not).

Structure your executive summary to cover all these aspects, highlighting key opportunities and risks for redevelopment based *solely* on the provided data.

Executive Summary for Postcode: {{{postcode}}}
---
`,
});


const generateExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'generateExecutiveSummaryFlow',
    inputSchema: PropertyDataContextSchema, // Use the comprehensive schema
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async (propertyData) => {
    // All data is now expected to be passed directly in the `propertyData` input object.
    // The caller (e.g., the dashboard component) will be responsible for fetching this data.
    // This flow now only focuses on passing the collected data to the prompt.

    const {output} = await generateExecutiveSummaryPrompt(propertyData);
    return output!;
  }
);
