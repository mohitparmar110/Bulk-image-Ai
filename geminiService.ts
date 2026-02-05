
import { GoogleGenAI } from "@google/genai";

// Standard file to base64 conversion utility
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateLifestyleImage = async (
  base64Data: string,
  mimeType: string,
  prompt: string,
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1"
): Promise<string> => {
  // Always use this specific initialization pattern as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are a world-class commercial product photographer and digital retoucher. 
    Your mission is to take a product image (often on a plain white background) and seamlessly place it into a photorealistic lifestyle environment.
    
    CORE REQUIREMENTS:
    1. PRODUCT INTEGRITY: Do NOT alter the product's shape, color, texture, or branding. The product must remain the central hero of the shot.
    2. LIGHTING CONSISTENCY: Analyze the light on the product and ensure the new environment's lighting matches perfectly. Add realistic contact shadows, ambient occlusion, and reflections where the product meets surfaces.
    3. PHOTOREALISM: The background should be high-resolution with realistic depth-of-field (bokeh) to keep focus on the product.
    4. COMPOSITION: Place the product in a logical, aesthetically pleasing position (e.g., on a table, floor, or shelf).
    5. No extra text, watermarks, or distorted elements.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Create a professional lifestyle photo of this product. Environment description: ${prompt}. Ensure the product is perfectly integrated with realistic lighting and shadows.`,
          },
        ],
      },
      config: {
        systemInstruction,
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      },
    });

    let imageUrl = '';
    // Guideline: Iterate through parts to find the image, do not assume it's the first part.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("No image was generated in the response.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
