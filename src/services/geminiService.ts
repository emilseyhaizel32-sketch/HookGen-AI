import { GoogleGenAI, Type } from "@google/genai";

const MODEL_NAME = "gemini-3.1-flash-lite-preview";

export interface Hook {
  id: number;
  visual: string;
  audio: string;
  explanation: string;
  hashtags: string[];
}

export interface HookResponse {
  hooks: Hook[];
}

export async function generateHooks(content: string): Promise<HookResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `Analyze the following script/transcript and generate 5 high-energy, viral-style hooks for YouTube Shorts and TikTok. 
    Each hook must have:
    1. A "visual" component: What should be happening on screen in the first 3 seconds.
    2. An "audio" component: What is being said or what sound effects are used.
    3. A brief "explanation" of why this hook works.
    4. A list of 5 "hashtags" that are trending and relevant to this specific hook and content.

    Script/Transcript:
    ${content}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hooks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                visual: { type: Type.STRING },
                audio: { type: Type.STRING },
                explanation: { type: Type.STRING },
                hashtags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["id", "visual", "audio", "explanation", "hashtags"],
            },
          },
        },
        required: ["hooks"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("The AI returned an empty response. This can happen with very short or ambiguous scripts.");
    return JSON.parse(text) as HookResponse;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    
    // Handle specific API error cases if possible
    if (error.message?.includes("API key")) {
      throw new Error("Invalid API Key. Please check your environment configuration.");
    }
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      throw new Error("Rate limit exceeded. Please wait a moment before trying again.");
    }
    if (error.message?.includes("safety")) {
      throw new Error("The content was flagged by safety filters. Please try a different script.");
    }
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the AI's response. The model might have generated invalid JSON. Please try again.");
    }
    
    throw new Error(error.message || "Failed to generate hooks. Please check your connection and try again.");
  }
}
