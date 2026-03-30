export enum View {
  ASSISTANT = 'ASSISTANT',
  ASSETS = 'ASSETS',
  REGEX = 'REGEX',
  JSON = 'JSON',
  TEST = 'TEST',
  TERMINAL = 'TERMINAL',
  WORKSPACE = 'WORKSPACE',
  GAMBLER = 'GAMBLER',
  DASHBOARD = 'DASHBOARD',
  FILE_EDITOR = 'FILE_EDITOR'
}

export interface DriveRoot {
  id: string;
  path: string;
}

export enum ModelType {
  PRO = 'gemini-1.5-pro',
  FLASH = 'gemini-1.5-flash',
  FLASH_LITE_1_5 = 'gemini-flash-lite-latest',
  FLASH_2_0 = 'gemini-2.0-flash-exp',
  FLASH_2_0_FULL = 'gemini-2.0-flash',
  FLASH_2_0_LITE = 'gemini-2.0-flash-lite-preview-02-05',
  PRO_2_0_EXP = 'gemini-2.0-pro-exp-02-05',
  THINKING_2_0 = 'gemini-2.0-flash-thinking-exp-01-21'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export interface RegexExplanation {
  pattern: string;
  explanation: string;
  error?: string;
}
