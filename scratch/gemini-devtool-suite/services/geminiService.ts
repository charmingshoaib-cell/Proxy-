import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { ModelType } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// Coding Assistant - Supports multiple models including Gemini 2.0
export const createChatSession = (modelType: ModelType = ModelType.FLASH_LITE_1_5): ChatSession => {
  const model = genAI.getGenerativeModel({
    model: modelType,
    systemInstruction: "You are an expert Senior Software Engineer. You provide concise, correct, and modern code solutions using TypeScript, React, and Tailwind CSS. When providing code, wrap it in markdown code blocks.",
  });

  return model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 2048,
    },
  });
};

export const sendMessageToChat = async (chat: ChatSession, message: string): Promise<string> => {
  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text() || "No response generated.";
  } catch (error: any) {
    console.error("Chat Error:", error);
    // Extract a more helpful error message
    const errorMsg = error?.message || error?.toString() || "Unknown error";
    return `Model Error: ${errorMsg}. Please check your quota or API key.`;
  }
};

// Asset Generator - Uses Gemini 1.5 Flash (for prompt-based image description or simulated generation)
export const generateAsset = async (prompt: string): Promise<string | null> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([
        `Generate a detailed UI design description for: ${prompt}. Return a base64 placeholder image representing a preview.`,
    ]);
    const response = await result.response;
    const text = response.text();
    
    // For a real asset generator, we might use a different service, but let's simulate with a stable placeholder for now
    // since Gemini 1.5 doesn't natively generate images as base64 in the text response without specific tuned params.
    return `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`; // Mocked asset
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

// Unit Test Generator
export const generateUnitTests = async (code: string, modelType: ModelType = ModelType.PRO): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: modelType });
    const result = await model.generateContent(
      `Generate comprehensive unit tests for the following code using Vitest/Jest and React Testing Library if applicable. Code: \n\n\`\`\`\n${code}\n\`\`\``
    );
    const response = await result.response;
    return response.text() || "Could not generate tests.";
  } catch (error) {
    console.error("Test Gen Error:", error);
    return "Error generating unit tests.";
  }
};

// Regex Explainer - Uses Gemini Flash for low-latency responses
export const explainRegexPattern = async (pattern: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });
    const result = await model.generateContent(
      `Explain this regex pattern in plain English for a developer: \`${pattern}\`. Break it down component by component.`
    );
    const response = await result.response;
    return response.text() || "Could not generate explanation.";
  } catch (error) {
    console.error("Regex Explainer Error:", error);
    return "Error generating explanation.";
  }
};
