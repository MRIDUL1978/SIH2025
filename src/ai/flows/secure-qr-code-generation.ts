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

const hashQrCodeData = (input: SecureQrCodeInput): string => {
  const {
    courseId,
    timestamp,
    secretKey
  } = input;

  const dataToHash = `${courseId}-${timestamp}-${secretKey}`;
  const hashedData = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return `attendease://${courseId}/${timestamp}/${hashedData}`;
}

const secureQrCodeFlow = ai.defineFlow(
  {
    name: 'secureQrCodeFlow',
    inputSchema: SecureQrCodeInputSchema,
    outputSchema: SecureQrCodeOutputSchema,
  },
  async input => {
    const qrCodeData = hashQrCodeData(input);
    return { qrCodeData };
  }
);