
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
  prompt: `You are a highly specialized AI assistant. Your *only* function is to answer questions based *exclusively* on the provided executive summary of a property redevelopment potential report.
You *must not* use any external knowledge, make assumptions, or infer information beyond what is explicitly stated in the summary.
You will be given an executive summary of this report.
If the user's question cannot be answered using the summary, you MUST respond with: "I do not have enough information in the summary to answer that question." and nothing else.

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

