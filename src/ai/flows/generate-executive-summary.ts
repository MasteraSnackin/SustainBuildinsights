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
import {getAskingPrices, getSoldPrices, getPriceTrends, getPlanningApplications, getConservationAreas, getSchools, getCrimeRates, getDemographics, getStampDuty, getRentEstimates, getSoldPricesFloorArea, getRentalComparables} from '@/services/patma';

const GenerateExecutiveSummaryInputSchema = z.object({
  postcode: z.string().describe('The postcode of the property to analyze.'),
  propertyPrice: z.number().describe('The current price of the property.'),
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

*   Property Valuation & Market Analysis: Compare current asking price ({{{propertyPrice}}}) vs. local sold prices, calculate price-per-floor-area metrics, and analyze 5-year price trends in the postcode.
*   Planning & Regulatory Landscape: List recent approved/rejected planning applications, identify conservation areas or Article 4 restrictions, and assess likelihood of planning permission success.
*   Neighborhood Insights: Evaluate school Ofsted ratings and catchment areas, compare crime rates to regional averages, and profile demographics for target tenant/buyer alignment.
*   Financial Feasibility: Calculate stamp duty for acquisition, estimate rental yield using local rent data, and model ROI with refurbishment cost assumptions (use £150/sqft baseline).
*   Case Studies: Compare similar redeveloped properties, highlighting profit margins and time-to-sale trends.

Postcode: {{{postcode}}}
Property Price: {{{propertyPrice}}}

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
    const askingPrices = await getAskingPrices(input.postcode);
    const soldPrices = await getSoldPrices(input.postcode);
    const priceTrends = await getPriceTrends(input.postcode);
    const planningApplications = await getPlanningApplications(input.postcode);
    const conservationAreas = await getConservationAreas(input.postcode);
    const schools = await getSchools(input.postcode);
    const crimeRates = await getCrimeRates(input.postcode);
    const demographics = await getDemographics(input.postcode);
    const stampDuty = await getStampDuty(input.propertyPrice);
    const rentEstimates = await getRentEstimates(input.postcode);
    const soldPricesFloorArea = await getSoldPricesFloorArea(input.postcode);
    const rentalComparables = await getRentalComparables(input.postcode);

    const {output} = await generateExecutiveSummaryPrompt(input);
    return output!;
  }
);
