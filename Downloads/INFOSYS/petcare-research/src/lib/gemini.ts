import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is missing from your .env file.");
}

export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-pro";
