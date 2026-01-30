
import { GoogleGenAI } from "@google/genai";
import { CandidateStatus, Candidate } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateWhatsAppMessage = async (candidate: Candidate, targetStatus: CandidateStatus): Promise<string> => {
  try {
    const prompt = `Generate a short, human-like WhatsApp message in Hinglish (Hindi written in English script) for a candidate named ${candidate.name} who is being hired as a ${candidate.role} in ${candidate.area}. 
    
    The status has changed to: ${targetStatus}.
    
    Context:
    - If status is INTERVIEW_SCHEDULED: Tell them their interview is scheduled and ask for confirmation.
    - If status is SELECTED: Congratulate them and say HR will contact for documents.
    - If status is DOCUMENT_PENDING: Request Aadhaar and Bank details photo on WhatsApp.
    - If status is REJECTED: Politely say we can't move forward this time.
    - If status is CONFIRMED: A simple reminder for the interview tomorrow.

    Keep it friendly, professional but very simple. Maximum 2 sentences. Use emojis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Message generation failed.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Hello ${candidate.name}, update on your application for ${candidate.role}. Status: ${targetStatus}.`;
  }
};
