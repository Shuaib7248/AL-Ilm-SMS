import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIInsights = async (prompt: string, contextData?: any): Promise<string> => {
  try {
    const contextString = contextData ? `\nContext Data: ${JSON.stringify(contextData)}` : '';
    const fullPrompt = `${prompt}${contextString}\n\nPlease keep the response concise, professional, and formatted for a school management dashboard. If using markdown, keep it simple.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "No insights available at this time.";
  } catch (error) {
    console.error("Error generating AI insights:", error);
    return "Unable to generate insights due to a connection error. Please try again later.";
  }
};

export const generateStudentReportComment = async (studentName: string, performanceData: any) => {
    const prompt = `Write a brief, encouraging report card comment for a student named ${studentName}. 
    Consider the following performance data: ${JSON.stringify(performanceData)}. 
    Mention both academic and madrasa progress if available.`;
    
    return generateAIInsights(prompt);
}