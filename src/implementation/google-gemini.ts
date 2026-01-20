import { GoogleGenAI } from "@google/genai";
import { loadEnvFile } from "node:process";

loadEnvFile();

const googleAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

type AnimalAnalysisResult = {
  description: string;
};

type Info = {
  sex: string;
  species: string;
};

export async function extractImageDescription(
  image: Buffer,
  info: Info,
): Promise<AnimalAnalysisResult> {
  const response = await googleAi.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `
Write one very short, casual sentence commenting on the moment shown in the image, as if someone were remembering that day.
The animal must be the main subject of the sentence.
Humans may be mentioned only as context, never as the focus.
Avoid visual descriptions and detailed actions.
Keep the tone natural, informal, and slightly playful.`,
          },
          {
            text: `
If the animal appears to be a puppy, the comment should reflect youth or first-time experiences in a natural way.
If not, write as a normal routine moment.
            `,
          },
          {
            text: `              
              pet sex: ${info.sex},
              species: ${info.species},
            `,
          },
          {
            text: "Output language: Brazilian Portuguese",
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: image.toString("base64"),
            },
          },
        ],
      },
    ],
  });

  const text = response.text;

  return {
    description: text || "",
  };
}
