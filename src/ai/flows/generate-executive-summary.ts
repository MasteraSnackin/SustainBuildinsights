
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
import {getAskingPrices, getSoldPrices, getPriceTrends, getPlanningApplications, getConservationAreas, getSchools, getCrimeRates, getDemographics, getStampDuty, getRentEstimates, getSoldPricesFloorArea, getRentalComparables, getEpcData, getFloodRiskData, getAirQualityData, getHistoricalClimateData, getTransportLinks} from '@/services/patma';

const GenerateExecutiveSummaryInputSchema = z.object({
  postcode: z.string().describe('The postcode of the property to analyze.'),
  // propertyPrice: z.number().describe('The current price of the property.'), // Removed as per request
});
export type GenerateExecutiveSummaryInput = z.infer<typeof GenerateExecutiveSummaryInputSchema>;

const GenerateExecutiveSummaryOutputSchema = z.object({
  summary: z.string().describe('The executive summary of the property redevelopment potential.'),
});
export type GenerateExecutiveSummaryOutput = z.infer<typeof GenerateExecutiveSummaryOutputSchema>;

export async function generateExecutiveSummary(input: GenerateExecutiveSummaryInput): Promise<GenerateExecutiveSummaryOutput> {
  return generateExecutiveSummaryFlow(input);
}

const generateExecutiveSummaryPrompt = ai.definePrompt({
  name: 'generateExecutiveSummaryPrompt',
  input: {schema: GenerateExecutiveSummaryInputSchema},
  output: {schema: GenerateExecutiveSummaryOutputSchema},
  prompt: `You are an expert property investment analyst. You are provided with data from the PaTMa API about a property at the given postcode. Use this data to generate an executive summary of the property's redevelopment potential, highlighting key opportunities and risks.

Consider the following:

*   Property Valuation & Market Analysis: Analyze local asking prices, local sold prices, calculate price-per-floor-area metrics, and analyze 5-year price trends in the postcode.
*   Planning & Regulatory Landscape: List recent approved/rejected planning applications, identify conservation areas or Article 4 restrictions, and assess likelihood of planning permission success.
*   Neighborhood Insights: Evaluate school Ofsted ratings and catchment areas, compare crime rates to regional averages, and profile demographics for target tenant/buyer alignment.
*   Energy, Climate & Environment: Summarize EPC rating, flood risk, air quality, and historical climate data. Note any implications for redevelopment (e.g., insulation upgrades, flood mitigation).
*   Transport Links: Describe key local transport options (train, bus, road access) and their proximity.
*   Financial Feasibility: Calculate stamp duty for acquisition (assume a typical market price for the area if not provided), estimate rental yield using local rent data, and model ROI with refurbishment cost assumptions (use £150/sqft baseline).
*   Case Studies: Compare similar redeveloped properties, highlighting profit margins and time-to-sale trends.

Postcode: {{{postcode}}}

Executive Summary:`,
});

const generateExecutiveSummaryFlow = ai.defineFlow(
  {
    name: 'generateExecutiveSummaryFlow',
    inputSchema: GenerateExecutiveSummaryInputSchema,
    outputSchema: GenerateExecutiveSummaryOutputSchema,
  },
  async input => {
    // Call PaTMa API endpoints to gather data
    // Note: The actual API calls are mocked in services/patma.ts
    // In a real application, these would be live API calls with error handling and potential rate limiting.
    // A mock property price is used here for services that might require it (like stamp duty).
    // The AI prompt itself no longer directly receives a user-inputted property price.
    const mockPropertyPriceForServices = 500000; // Example value, can be adjusted or derived

    const askingPrices = await getAskingPrices(input.postcode);
    const soldPrices = await getSoldPrices(input.postcode);
    const priceTrends = await getPriceTrends(input.postcode);
    const planningApplications = await getPlanningApplications(input.postcode);
    const conservationAreas = await getConservationAreas(input.postcode);
    const schools = await getSchools(input.postcode);
    const crimeRates = await getCrimeRates(input.postcode);
    const demographics = await getDemographics(input.postcode);
    const stampDuty = await getStampDuty(mockPropertyPriceForServices);
    const rentEstimates = await getRentEstimates(input.postcode);
    const soldPricesFloorArea = await getSoldPricesFloorArea(input.postcode);
    const rentalComparables = await getRentalComparables(input.postcode);
    const epcData = await getEpcData(input.postcode);
    const floodRiskData = await getFloodRiskData(input.postcode);
    const airQualityData = await getAirQualityData(input.postcode);
    const historicalClimateData = await getHistoricalClimateData(input.postcode);
    const transportLinks = await getTransportLinks(input.postcode);

    // For the AI prompt, we pass the raw input.
    // The prompt itself is designed to understand that it needs to consider various data points
    // which are implicitly available via the mocked service calls or would be fetched in a real scenario.
    // If specific data needed to be explicitly passed to the prompt beyond the input schema,
    // we would augment the input object here.

    const {output} = await generateExecutiveSummaryPrompt(input);
    return output!;
  }
);
