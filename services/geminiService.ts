import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY not found in environment variables");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateJokeImage = async (jokeText: string, category: string): Promise<string | null> => {
    try {
        const ai = getClient();
        
        // Construct a prompt specifically for comic generation with strict text requirements
        const prompt = `
          Create a colorful single-page comic strip or single panel comic that visualizes the following joke. 
          
          MANDATORY REQUIREMENTS for TEXT:
          1. Include speech bubbles containing the dialogue from the joke.
          2. SPELLING MUST BE PERFECT. Copy the "Joke Text" EXACTLY as written below.
          3. Ensure the text is high-contrast, large, and easily readable.
          
          Joke Category: ${category}
          Joke Text: "${jokeText}"
          
          Style: Vibrant, American Comic Book style, distinct outlines, expressive characters, professional lettering.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: prompt }
                ]
            },
            config: {
                 imageConfig: {
                    aspectRatio: "1:1", 
                }
            }
        });

        if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64EncodeString = part.inlineData.data;
                    return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
                }
            }
        }
        
        return null;

    } catch (error) {
        console.error("Gemini Image Generation Error:", error);
        return null;
    }
};