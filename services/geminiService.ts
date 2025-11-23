import { GoogleGenAI, Type } from "@google/genai";
import { JewelryFormData } from "../types";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeJewelryImage = async (file: File) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = await fileToGenerativePart(file);

  const prompt = `
    Analyze this jewelry image closely for a professional photography prompt generator.
    Extract the following details accurately:
    1. Category (e.g., Ring, Necklace).
    2. Material Details (e.g., 18K Gold, Emerald, Pave setting).
    3. Estimated Dimensions (e.g., 18mm diameter, 2ct stone).
    
    Return ONLY a JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            materialDetails: { type: Type.STRING },
            dimensions: { type: Type.STRING },
          },
          required: ["category", "materialDetails", "dimensions"],
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generatePreviewImage = async (prompt: string, referenceImage?: File | null): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash-image for standard generation as per guidelines
    // unless high resolution is strictly requested, but 2.5 is faster for previews.
    const model = 'gemini-2.5-flash-image';
    
    const parts: any[] = [{ text: prompt }];

    // If there is a reference image, we add it to guide the generation (Image-to-Image)
    if (referenceImage) {
        const base64Data = await fileToGenerativePart(referenceImage);
        parts.unshift({
            inlineData: {
                mimeType: referenceImage.type,
                data: base64Data
            }
        });
        parts.push({ text: "Use the attached image as a structural reference for the jewelry item described." });
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts },
            config: {
                // Not setting responseMimeType for image models as per guidelines
            }
        });

        // Extract image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data returned from Gemini.");
    } catch (error) {
        console.error("Image Generation Error:", error);
        throw error;
    }
}
