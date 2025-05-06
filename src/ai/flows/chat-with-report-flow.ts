
'use server';
/**
 * @fileOverview A chatbot flow to answer questions based on a property report summary.
 *
 * - chatWithReport - A function that handles the chat interaction.
 * - ChatWithReportInput - The input type for the chatWithReport function.
 * - ChatWithReportOutput - The return type for the chatWithReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithReportInputSchema = z.object({
  reportContext: z.string().describe('The executive summary of the property report.'),
  userQuestion: z.string().describe("The user's question about the report."),
});
export type ChatWithReportInput = z.infer<typeof ChatWithReportInputSchema>;

const ChatWithReportOutputSchema = z.object({
  botResponse: z.string().describe("The AI's answer to the user's question."),
});
export type ChatWithReportOutput = z.infer<typeof ChatWithReportOutputSchema>;

export async function chatWithReport(input: ChatWithReportInput): Promise<ChatWithReportOutput> {
  return chatWithReportFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatWithReportPrompt',
  input: {schema: ChatWithReportInputSchema},
  output: {schema: ChatWithReportOutputSchema},
  prompt: `You are an expert assistant. Your sole purpose is to answer questions based *only* on the information provided in the executive summary of the property report generated right now.
You *must not* reference any external sources, previous reports, or background knowledge.
When answering questions or providing analysis, base your responses *strictly* on the data, findings, and context from *this current report summary*.
Do not speculate or make assumptions beyond the report’s content.

If a question cannot be answered with the information in the summary, you *must* clearly state:
“This information is not available in the current report.”
And nothing else.

Example Interactions (for context on how to respond):

User: What is the flood risk for the property?
Chatbot: According to the current report, the flood risk for the property is classified as “Moderate.”

User: What is the average property price in the area over the last 10 years?
Chatbot: This information is not available in the current report.

This prompt ensures your responses are strictly limited to the scope of the current report, maintaining accuracy and relevance.

Here is the executive summary:
---
{{{reportContext}}}
---

User's question: {{{userQuestion}}}

Your answer:`,
});

const chatWithReportFlow = ai.defineFlow(
  {
    name: 'chatWithReportFlow',
    inputSchema: ChatWithReportInputSchema,
    outputSchema: ChatWithReportOutputSchema,
  },
  async (input) => {
    const {output} = await chatPrompt(input);
    return output!;
  }
);

