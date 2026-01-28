import { GoogleGenAI } from "@google/genai";

export const getConservationAdvice = async (
  prediction: number, 
  inputs: any
): Promise<string> => {
  // Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance.
  // We assume the API_KEY is pre-configured and valid.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    As a Water Conservation Expert at Thakur College, analyze this scenario:
    - Predicted Usage: ${prediction} Liters/Day
    - Household Size: ${inputs.householdSize}
    - Temperature: ${inputs.temperature}°C
    - Season: ${inputs.season}
    - Leak Status: ${inputs.leakStatus ? 'Leak Detected' : 'No Leaks'}
    - Usage Pattern: ${inputs.usagePattern}
    
    Provide 3 concise, highly professional bullet points of advice to optimize water efficiency. 
    Keep it strictly professional for a faculty demonstration.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    // Use the .text property to get the generated content.
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI insights.";
  }
};