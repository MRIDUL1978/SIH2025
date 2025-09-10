// This file is used to generate secure QR codes for attendance tracking using time-sensitive hashing.

'use server';

/**
 * @fileOverview Generates time-sensitive QR codes for secure attendance tracking.
 *
 * - generateSecureQrCode - Generates a secure QR code for a given course.
 * - SecureQrCodeInput - The input type for the generateSecureQrCode function.
 * - SecureQrCodeOutput - The return type for the generateSecureQrCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import crypto from 'crypto';

const SecureQrCodeInputSchema = z.object({
  courseId: z.string().describe('The ID of the course for which to generate the QR code.'),
  timestamp: z.number().describe('The timestamp for which the QR code is valid (in milliseconds).'),
  secretKey: z.string().describe('A secret key to use for hashing.'),
});
export type SecureQrCodeInput = z.infer<typeof SecureQrCodeInputSchema>;

const SecureQrCodeOutputSchema = z.object({
  qrCodeData: z.string().describe('The data for the QR code, including the hashed information.'),
});
export type SecureQrCodeOutput = z.infer<typeof SecureQrCodeOutputSchema>;

export async function generateSecureQrCode(input: SecureQrCodeInput): Promise<SecureQrCodeOutput> {
  return secureQrCodeFlow(input);
}

const hashQrCodeData = ai.defineTool({
  name: 'hashQrCodeData',
  description: 'Hashes the QR code data using SHA256 with a timestamp and secret key for security.',
  inputSchema: SecureQrCodeInputSchema,
  outputSchema: z.string(),
},
async (input) => {
  const {
    courseId,
    timestamp,
    secretKey
  } = input;

  const dataToHash = `${courseId}-${timestamp}-${secretKey}`;
  const hashedData = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return hashedData;
});

const qrCodePrompt = ai.definePrompt({
  name: 'qrCodePrompt',
  tools: [hashQrCodeData],
  input: {schema: SecureQrCodeInputSchema},
  output: {schema: SecureQrCodeOutputSchema},
  prompt: `You are tasked with generating secure QR code data for course attendance.

  Use the hashQrCodeData tool to generate a secure hash based on the course ID, timestamp, and secret key.
  The current timestamp is: {{{timestamp}}}.

  The course ID is: {{{courseId}}}.

  The secret key is: {{{secretKey}}}.

  The hashed data from the hashQrCodeData tool call should be returned as the qrCodeData.
  Ensure the output is a string.
  `,
});

const secureQrCodeFlow = ai.defineFlow(
  {
    name: 'secureQrCodeFlow',
    inputSchema: SecureQrCodeInputSchema,
    outputSchema: SecureQrCodeOutputSchema,
  },
  async input => {
    const {output} = await qrCodePrompt(input);
    return output!;
  }
);
