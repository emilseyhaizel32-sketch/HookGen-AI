import { GoogleGenAI, Type } from "@google/genai";

const MODEL_NAME = "gemini-3.1-flash-lite-preview";

export interface Hook {
  id: number;
  visual: string;
  audio: string;
  explanation: string;
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
              },
              required: ["id", "visual", "audio", "explanation"],
            },
          },
        },
        required: ["hooks"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as HookResponse;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    throw new Error("Failed to generate hooks. Please try again.");
  }
}
