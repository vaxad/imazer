"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function processImageWithAI(
  imageFile: File,
  question: string,
): Promise<string> {
  try {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    // Process with AI
    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `I have an image that I'll describe to you. Please answer the following question about it:
                    Question: ${question}
                    Image description: This is an uploaded image that the user wants to analyze.`,
            },
            {
              type: "image",
              image: base64Image,
            },
          ],
        },
      ],
    });

    return text;
  } catch (error) {
    console.error("Error processing image with AI:", error);
    return "Sorry, there was an error processing this image.";
  }
}
