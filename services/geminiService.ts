import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, PredictionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePatientData = async (data: PatientData): Promise<PredictionResult> => {
  if (!process.env.API_KEY) {
    // Fallback for demo purposes if no key is provided in environment
    console.warn("No API Key provided. Returning mock data.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      riskLevel: 'Medium',
      probability: 45,
      analysis: "API Key missing. Mock analysis: Patient shows slightly elevated liver enzymes which may indicate early stage dysfunction.",
      recommendations: ["Ensure API Key is set in environment", "Review input data manually"]
    };
  }

  try {
    const prompt = `
      You are an expert hepatologist AI assistant. Analyze the following patient data for Liver Disease:
      
      Patient Demographics:
      - Age: ${data.age}
      - Gender: ${data.gender}
      
      Clinical Chemistry (Liver Function Tests):
      - Total Bilirubin: ${data.totalBilirubin} mg/dL
      - Direct Bilirubin: ${data.directBilirubin} mg/dL
      - Alkaline Phosphotase: ${data.alkalinePhosphotase} IU/L
      - Alamine Aminotransferase (ALT): ${data.alamineAminotransferase} IU/L
      - Aspartate Aminotransferase (AST): ${data.aspartateAminotransferase} IU/L
      - Total Proteins: ${data.totalProteins} g/dL
      - Albumin: ${data.albumin} g/dL
      - Albumin/Globulin Ratio: ${data.albuminGlobulinRatio}

      Based on these values, provide a risk assessment for liver disease. 
      Return the output strictly as a JSON object with the following schema:
      {
        "riskLevel": "Low" | "Medium" | "High",
        "probability": number (0-100),
        "analysis": "A concise paragraph explaining the key findings indicating the risk.",
        "recommendations": ["List of 3-4 concise actionable medical recommendations"]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            probability: { type: Type.NUMBER },
            analysis: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ['riskLevel', 'probability', 'analysis', 'recommendations']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from AI");
    }

    return JSON.parse(resultText) as PredictionResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze patient data. Please try again.");
  }
};