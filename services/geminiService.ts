import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, PredictionResult, ClaimData, ClaimPredictionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePatientData = async (data: PatientData): Promise<PredictionResult> => {
  if (!process.env.API_KEY) {
    // Fallback for demo purposes if no key is provided
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
    if (!resultText) throw new Error("Empty response from AI");

    return JSON.parse(resultText) as PredictionResult;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze patient data. Please try again.");
  }
};

export const analyzeClaimFraud = async (data: ClaimData): Promise<ClaimPredictionResult> => {
  if (!process.env.API_KEY) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      isFraud: false,
      riskScore: 12,
      reasoning: "Mock Analysis: API Key missing. Data appears within normal bounds.",
      flaggedFields: []
    };
  }

  try {
    const prompt = `
      You are an expert Medical Insurance Fraud Detection AI. Analyze the following claim for potential fraud:

      Claim Details:
      - Amount: $${data.claimAmount}
      - Patient Age: ${data.patientAge}
      - Gender: ${data.patientGender}
      - Provider Specialty: ${data.providerSpecialty}
      - Status: ${data.claimStatus}
      - Patient Income: ${data.patientIncome}
      - Marital Status: ${data.patientMaritalStatus}
      - Employment: ${data.patientEmploymentStatus}
      - Location: ${data.providerLocation}
      - Claim Type: ${data.claimType}
      - Submission Method: ${data.claimSubmissionMethod}
      - Disease Severity: ${data.diseaseSeverity}

      Analyze for anomalies, mismatch in severity vs cost, or suspicious patterns.
      Return JSON:
      {
        "isFraud": boolean,
        "riskScore": number (0-100),
        "reasoning": "Short explanation of findings",
        "flaggedFields": ["List of suspicious field names e.g. 'claimAmount', 'providerSpecialty'"]
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
                isFraud: { type: Type.BOOLEAN },
                riskScore: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
                flaggedFields: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['isFraud', 'riskScore', 'reasoning', 'flaggedFields']
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");

    return JSON.parse(resultText) as ClaimPredictionResult;
  } catch (error) {
    console.error("Gemini Fraud API Error:", error);
    throw new Error("Failed to analyze claim. Please try again.");
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
    if (!process.env.API_KEY) return "I can only answer when the API Key is configured.";
    
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: "You are a helpful medical assistant for a physician. Be concise, professional, and accurate."
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text || "I didn't understand that.";
    } catch (e) {
        console.error(e);
        return "Sorry, I encountered an error processing your request.";
    }
}
