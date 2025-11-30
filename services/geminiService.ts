import { GoogleGenAI, Type } from "@google/genai";
import { DesignData, DesignRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDesignData = async (request: DesignRequest): Promise<DesignData> => {
  const prompt = `
    Create an interior design schema for a ${request.style} ${request.roomType} 
    with dimensions ${request.dimensions.width}m x ${request.dimensions.depth}m.
    Provide a color palette (hex codes) and brief layout advice.
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
            palette: {
              type: Type.OBJECT,
              properties: {
                primaryColor: { type: Type.STRING, description: "Hex code for main furniture" },
                secondaryColor: { type: Type.STRING, description: "Hex code for secondary elements" },
                accentColor: { type: Type.STRING, description: "Hex code for accents/decor" },
                floorColor: { type: Type.STRING, description: "Hex code for flooring" },
                wallColor: { type: Type.STRING, description: "Hex code for walls" },
              },
              required: ["primaryColor", "secondaryColor", "accentColor", "floorColor", "wallColor"],
            },
            advice: { type: Type.STRING, description: "Brief design advice (max 50 words)" },
            furnitureLayoutNotes: { type: Type.STRING, description: "Specific notes on furniture placement" }
          },
          required: ["palette", "advice", "furnitureLayoutNotes"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from Gemini");
    return JSON.parse(text) as DesignData;
  } catch (error) {
    console.error("Error generating design data:", error);
    throw error;
  }
};

export const generateConceptImage = async (request: DesignRequest): Promise<string | null> => {
  const prompt = `
    Photorealistic architectural visualization of a ${request.style} ${request.roomType}, 
    interior view, high quality, 4k, daylight, 
    room size ${request.dimensions.width}m width by ${request.dimensions.depth}m depth.
  `;

  try {
    // Using gemini-2.5-flash-image for generation as per instructions for general image tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating concept image:", error);
    return null; 
  }
};