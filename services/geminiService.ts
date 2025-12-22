import { GoogleGenAI, Type } from "@google/genai";
import { Question, AIAnalysis } from "../types";

export const analyzeQuestion = async (
  apiKey: string,
  question: Question
): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a philosophy expert. Please analyze the following multiple-choice question and identify the correct answer.
    
    Question: ${question.text}
    Options:
    ${question.options.map((opt, i) => `${i}: ${opt}`).join('\n')}

    Provide the index (0-based) of the correct option and a brief explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctOptionIndex: {
              type: Type.INTEGER,
              description: "The 0-based index of the correct option from the provided list.",
            },
            explanation: {
              type: Type.STRING,
              description: "A short explanation of why this answer is correct.",
            },
          },
          required: ["correctOptionIndex", "explanation"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
