import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { SentimentReport, SYSTEM_INSTRUCTION } from "../types";

export async function analyzeSentiment(inputData: string, isSearch: boolean = false): Promise<SentimentReport | { error: string; executive_summary: string }> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  
  const prompt = isSearch 
    ? `SEARCH AND AUDIT TASK:
       1. Use Google Search to find the latest raw logs, social media discussions (Reddit, X/Twitter), and technical reports regarding the following topic: "${inputData}".
       2. Extract specific metrics, quotes, and sentiments from these search results.
       3. Synthesize a detailed but balanced audit report based on the findings.
       4. Follow the strict auditing rules and return the JSON report.
       
       TOPIC: ${inputData}`
    : `RAW DATA AUDIT TASK:
       1. Analyze the following raw data stream (which may contain social media posts, logs, or technical reports).
       2. Extract specific metrics, quotes, and sentiments directly from the provided text.
       3. Synthesize a detailed audit report based ONLY on the provided data.
       4. Follow the strict auditing rules and return the JSON report.
       
       RAW DATA:
       ${inputData}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        tools: isSearch ? [{ googleSearch: {} }] : undefined,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Sentiment Analysis Error:", error);
    return {
      error: "ANALYSIS_FAILED",
      executive_summary: "An unexpected error occurred during the audit process."
    };
  }
}
